import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import { Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEVICE_TYPES, WIDGET_TEMPLATES } from '../constants/widgets';
import { CanvasWidget } from './CanvasWidget';
import { DragItem, Position } from '../types';
import { collaborationService } from '../services/collaborationService';
import { v4 as uuidv4 } from 'uuid';

const CanvasContainer = styled.div`
  flex: 1;
  padding: 32px;
  background: linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%);
  overflow: auto;
  position: relative;
  height: 100vh;
  max-height: 100vh;
  scrollbar-width: thin;
  scrollbar-color: #CBD5E1 #F1F5F9;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #F1F5F9;
  }

  &::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94A3B8;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const DeviceFrame = styled.div<{ width: number; height: number; isOver: boolean; deviceType: string }>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  margin: 0 auto;
  background: ${props => {
    if (props.deviceType.includes('iphone') || props.deviceType.includes('pixel') || props.deviceType.includes('galaxy')) {
      return 'linear-gradient(145deg, #1a1a1a, #2d2d2d)';
    }
    return '#ffffff';
  }};
  border-radius: ${props => {
    if (props.deviceType.includes('iphone')) return '32px';
    if (props.deviceType.includes('pixel') || props.deviceType.includes('galaxy')) return '22px';
    if (props.deviceType.includes('ipad')) return '18px';
    return '12px';
  }};
  box-shadow: 
    0 8px 28px rgba(0, 0, 0, 0.12),
    ${props => props.deviceType.includes('iphone') || props.deviceType.includes('pixel') || props.deviceType.includes('galaxy') 
      ? 'inset 0 0 0 7px #2d2d2d, inset 0 0 0 10px #1a1a1a' 
      : ''};
  position: relative;
  overflow: hidden;
  border: 2px solid ${props => props.isOver ? '#2196f3' : 'transparent'};
  transition: all 0.2s ease;
  padding: ${props => {
    if (props.deviceType.includes('iphone')) return '24px 6px';
    if (props.deviceType.includes('pixel') || props.deviceType.includes('galaxy')) return '20px 5px';
    if (props.deviceType.includes('ipad')) return '16px 10px';
    return '0';
  }};

  /* Phone notch simulation */
  ${props => props.deviceType.includes('iphone') && `
    &::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 20px;
      background: #1a1a1a;
      border-radius: 14px;
      z-index: 10;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 9px;
      left: 50%;
      transform: translateX(-50%);
      width: 42px;
      height: 5px;
      background: #333;
      border-radius: 3px;
      z-index: 11;
    }
  `}

  /* Pixel camera hole */
  ${props => props.deviceType.includes('pixel') && `
    &::before {
      content: '';
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      width: 10px;
      height: 10px;
      background: #000;
      border-radius: 50%;
      z-index: 10;
    }
  `}
`;

const DeviceScreen = styled.div<{ deviceType: string }>`
  width: 100%;
  height: 100%;
  position: relative;
  background: #fafafa;
  overflow: hidden;
  border-radius: ${props => {
    if (props.deviceType.includes('iphone')) return '28px';
    if (props.deviceType.includes('pixel') || props.deviceType.includes('galaxy')) return '18px';
    if (props.deviceType.includes('ipad')) return '14px';
    return '8px';
  }};
`;

const DropZone = styled.div<{ isOver: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.isOver ? 'rgba(33, 150, 243, 0.1)' : 'transparent'};
  border: ${props => props.isOver ? '2px dashed #2196f3' : '2px dashed transparent'};
  transition: all 0.2s ease;
  z-index: 1;
`;

const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
  pointer-events: none;
  z-index: 0;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.7;
`;

const CanvasScrollArea = styled.div`
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
`;

interface CanvasProps {
  sendCursorMove?: (position: { x: number; y: number }) => void;
}

export function Canvas({ sendCursorMove }: CanvasProps = {}) {
  const { state, dispatch, getCurrentPage } = useApp();
  const currentPage = getCurrentPage();
  const currentDevice = DEVICE_TYPES.find(device => device.id === state.project.selectedDeviceId);
  const dropZoneRef = React.useRef<HTMLDivElement>(null);
  const lastMoveTime = React.useRef<number>(0);

  // Calculate actual content dimensions considering device padding
  const getContentDimensions = () => {
    if (!currentDevice) return { width: 0, height: 0 };
    
    let paddingTop = 0, paddingBottom = 0, paddingLeft = 0, paddingRight = 0;
    
    if (currentDevice.id.includes('iphone')) {
      paddingTop = 24; paddingBottom = 24; paddingLeft = 6; paddingRight = 6;
    } else if (currentDevice.id.includes('pixel') || currentDevice.id.includes('galaxy')) {
      paddingTop = 20; paddingBottom = 20; paddingLeft = 5; paddingRight = 5;
    } else if (currentDevice.id.includes('ipad')) {
      paddingTop = 16; paddingBottom = 16; paddingLeft = 10; paddingRight = 10;
    }
    
    return {
      width: currentDevice.width - paddingLeft - paddingRight,
      height: currentDevice.height - paddingTop - paddingBottom
    };
  };

  const contentDimensions = getContentDimensions();

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ['widget', 'canvas-widget'],
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
    hover: (item: DragItem, monitor) => {
      // Solo para widgets existentes que se están moviendo
      if (item.type === 'canvas-widget' && item.widget && dropZoneRef.current) {
        const clientOffset = monitor.getClientOffset();
        const dropZoneRect = dropZoneRef.current.getBoundingClientRect();
        
        if (clientOffset) {
          const widgetWidth = item.widget.size.width;
          const widgetHeight = item.widget.size.height;

          const position: Position = {
            x: Math.round(Math.max(0, Math.min(clientOffset.x - dropZoneRect.left - widgetWidth/2, dropZoneRect.width - widgetWidth))),
            y: Math.round(Math.max(0, Math.min(clientOffset.y - dropZoneRect.top - widgetHeight/2, dropZoneRect.height - widgetHeight)))
          };

          // Actualizar posición en tiempo real
          dispatch({
            type: 'MOVE_WIDGET',
            payload: {
              widgetId: item.widget.id,
              position
            }
          });
          
          // Enviar colaboración con throttling (máximo cada 50ms)
          const now = Date.now();
          if (collaborationService.isConnected() && now - lastMoveTime.current > 50) {
            // Enviar movimiento del widget
            collaborationService.sendWidgetMoved(item.widget.id, position);
            
            // Enviar también la posición del cursor (posición global)
            if (sendCursorMove) {
              sendCursorMove({ x: clientOffset.x, y: clientOffset.y });
            }
            
            lastMoveTime.current = now;
          }
        }
      }
    },
    drop: (item: DragItem, monitor) => {
      if (!monitor.didDrop() && currentPage && currentDevice && dropZoneRef.current) {
        const clientOffset = monitor.getClientOffset();
        const dropZoneRect = dropZoneRef.current.getBoundingClientRect();
        
        if (clientOffset) {
          // Solo manejar widgets nuevos aquí
          if (item.type === 'widget' && item.widgetType) {
            const template = WIDGET_TEMPLATES.find(t => t.id === item.widgetType);
            if (template) {
              const widgetWidth = template.defaultProperties.width || 100;
              const widgetHeight = template.defaultProperties.height || 100;

              const position: Position = {
                x: Math.round(Math.max(0, Math.min(clientOffset.x - dropZoneRect.left - widgetWidth/2, dropZoneRect.width - widgetWidth))),
                y: Math.round(Math.max(0, Math.min(clientOffset.y - dropZoneRect.top - widgetHeight/2, dropZoneRect.height - widgetHeight)))
              };

              const newWidget = {
                id: uuidv4(),
                type: item.widgetType,
                name: template.name,
                position,
                size: { 
                  width: widgetWidth, 
                  height: widgetHeight 
                },
                properties: { ...template.defaultProperties }
              };

              dispatch({ 
                type: 'ADD_WIDGET', 
                payload: { widget: newWidget, pageId: currentPage.id } 
              });
              
              // Send collaboration event for new widget
              if (collaborationService.isConnected()) {
                collaborationService.sendWidgetAdded(newWidget, currentPage.id);
              }
            }
          }
        }
        
        // Clear drag position in context
        dispatch({
          type: 'SET_DRAG_POSITION',
          payload: null
        });
      }
    }
  });

  if (!currentDevice || !currentPage) {
    return <div>Loading...</div>;
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect widget when clicking on empty canvas
    if (e.target === e.currentTarget) {
      dispatch({ type: 'SELECT_WIDGET', payload: null });
    }
  };

  return (
    <CanvasContainer>
      <CanvasScrollArea>
        <DeviceFrame 
          width={currentDevice.width} 
          height={currentDevice.height}
          isOver={isOver}
          deviceType={currentDevice.id}
        >
          <DeviceScreen deviceType={currentDevice.id}>
            <DropZone 
              ref={(el) => {
                drop(el);
                dropZoneRef.current = el;
              }}
              isOver={isOver}
              onClick={handleCanvasClick}
            />
            
            {currentPage.widgets.length === 0 && (
              <EmptyState>
                <EmptyIcon><Smartphone size={48} /></EmptyIcon>
                <EmptyText>Empty Canvas</EmptyText>
                <EmptySubtext>Drag widgets from the library to start building</EmptySubtext>
              </EmptyState>
            )}

            {currentPage.widgets.map(widget => (
              <CanvasWidget
                key={widget.id}
                widget={widget}
                deviceWidth={contentDimensions.width}
                deviceHeight={contentDimensions.height}
              />
            ))}
          </DeviceScreen>
        </DeviceFrame>
      </CanvasScrollArea>
    </CanvasContainer>
  );
}
