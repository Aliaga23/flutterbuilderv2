import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Resizable } from 'react-resizable';
import styled from 'styled-components';
import * as LucideIcons from 'lucide-react';
import { FlutterWidget } from '../types';
import { useApp } from '../context/AppContext';
import { WidgetContextMenu } from './WidgetContextMenu';
import { collaborationService } from '../services/collaborationService';
import 'react-resizable/css/styles.css';

 const WidgetContainer = styled.div<{ 
   x: number; 
   y: number; 
   width: number; 
   height: number; 
   isSelected: boolean;
   isDragging: boolean;
 }>`
   position: absolute;
   left: ${props => props.x}px;
   top: ${props => props.y}px;
   width: ${props => props.width}px;
   height: ${props => props.height}px;
   cursor: move;
   border: ${props => props.isSelected ? '2px solid #2196f3' : '1px solid #ddd'};
   border-radius: 4px;
   opacity: ${props => props.isDragging ? 0.5 : 1};
   z-index: ${props => props.isSelected ? 1000 : 1};
   background-color: ${props => props.isDragging ? 'rgba(33, 150, 243, 0.1)' : 'transparent'};
   box-shadow: ${props => props.isSelected ? '0 0 8px rgba(33, 150, 243, 0.5)' : 'none'};
  pointer-events: ${props => props.isDragging ? 'none' : 'auto'};

   &:hover {
     border-color: #2196f3;
     box-shadow: 0 0 5px rgba(33, 150, 243, 0.3);
   }

   .react-resizable-handle {
     opacity: ${props => props.isSelected ? 1 : 0};
   }

   &:hover .react-resizable-handle {
     opacity: 1;
   }
 `;

const WidgetContent = styled.div<{ backgroundColor?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.backgroundColor || '#f5f5f5'};
  border-radius: 4px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const TextWidget = styled.div<{ 
  fontSize?: number; 
  color?: string; 
  fontWeight?: string;
  textAlign?: string;
}>`
  font-size: ${props => props.fontSize || 16}px;
  color: ${props => props.color || '#000000'};
  font-weight: ${props => props.fontWeight || 'normal'};
  text-align: ${props => props.textAlign || 'left'};
  padding: 8px;
  width: 100%;
`;

const ButtonWidget = styled.button<{
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
}>`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.backgroundColor || '#2196F3'};
  color: ${props => props.textColor || '#FFFFFF'};
  font-size: ${props => props.fontSize || 16}px;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    opacity: 0.9;
  }
`;

const ImageWidget = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

const CheckboxWidget = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  font-size: 14px;
`;

const SwitchWidget = styled.div<{ value?: boolean; activeColor?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .switch {
    width: 50px;
    height: 24px;
    background-color: ${props => props.value ? props.activeColor || '#2196F3' : '#CCCCCC'};
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: white;
      top: 2px;
      left: ${props => props.value ? '28px' : '2px'};
      transition: left 0.2s ease;
    }
  }
`;

const SliderWidget = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  
  .slider {
    width: 100%;
    height: 4px;
    background-color: #E0E0E0;
    border-radius: 2px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      background-color: #2196F3;
      border-radius: 50%;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const IconWidget = styled.div<{ color?: string; size?: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#000000'};
  font-size: ${props => props.size || 24}px;
`;

const DividerWidget = styled.div<{
  orientation?: string;
  thickness?: number;
  color?: string;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .divider {
    background-color: ${props => props.color || '#E0E0E0'};
    ${props => props.orientation === 'vertical' 
      ? `width: ${props.thickness || 1}px; height: 100%;`
      : `height: ${props.thickness || 1}px; width: 100%;`
    }
  }
`;

const ProgressWidget = styled.div<{ value?: number; valueColor?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  
  .progress-track {
    width: 100%;
    height: 4px;
    background-color: #E0E0E0;
    border-radius: 2px;
    overflow: hidden;
    
    .progress-indicator {
      height: 100%;
      width: ${props => (props.value || 0) * 100}%;
      background-color: ${props => props.valueColor || '#2196F3'};
      transition: width 0.3s ease;
    }
  }
`;

const ChipWidget = styled.div<{
  backgroundColor?: string;
  textColor?: string;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.backgroundColor || '#E0E0E0'};
  color: ${props => props.textColor || '#000000'};
  border-radius: 16px;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 500;
`;

const CheckListWidget = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  overflow-y: auto;
  background-color: #FFFFFF;
  border-radius: 4px;

  .checklist-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 4px 0;

    &:hover {
      background-color: rgba(33, 150, 243, 0.1);
      border-radius: 4px;
      margin: 0 -4px;
      padding: 4px 4px;
    }
  }
`;

const TableWidget = styled.div<{
  showBorders?: boolean;
  borderColor?: string;
}>`
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #FFFFFF;
  border-radius: 4px;
  border: ${props => props.showBorders ? `1px solid ${props.borderColor || '#E0E0E0'}` : 'none'};

  table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  th, td {
    padding: 8px;
    text-align: left;
    border: ${props => props.showBorders ? `1px solid ${props.borderColor || '#E0E0E0'}` : 'none'};
  }

  th {
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  tbody tr:nth-child(even) {
    background-color: var(--alternate-row-color);
  }

  tbody tr:nth-child(odd) {
    background-color: var(--row-color);
  }
`;

const InputWidget = styled.input<{ borderColor?: string }>`
  width: 100%;
  height: 100%;
  border: 1px solid ${props => props.borderColor || '#CCCCCC'};
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const ContainerWidget = styled.div<{ 
  backgroundColor?: string;
  borderRadius?: number;
  hasChildren?: boolean;
}>`
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor || '#E3F2FD'};
  border-radius: ${props => props.borderRadius || 4}px;
  border: 2px dashed ${props => props.hasChildren ? 'transparent' : '#ccc'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BottomNavWidget = styled.div<{
  backgroundColor?: string;
  selectedColor?: string;
  unselectedColor?: string;
}>`
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor || '#FFFFFF'};
  border-top: 1px solid #E0E0E0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 100;

  .nav-items {
    display: flex;
    justify-content: space-around;
    width: 100%;
    align-items: center;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: ${props => props.unselectedColor || '#757575'};
    transition: color 0.2s ease;
    cursor: pointer;

    &.active {
      color: ${props => props.selectedColor || '#2196F3'};
    }

    &:hover {
      opacity: 0.8;
    }
  }

  .nav-icon {
    font-size: 20px;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 500;
  }
`;

const DropdownWidget = styled.div<{
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  textColor?: string;
  hoverColor?: string;
  arrowColor?: string;
  fontSize?: number;
  elevation?: number;
}>`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: ${props => props.backgroundColor || '#FFFFFF'};
  border: ${props => `${props.borderWidth || 1}px solid ${props.borderColor || '#CCCCCC'}`};
  border-radius: ${props => props.borderRadius || 4}px;
  color: ${props => props.textColor || '#000000'};
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-family: inherit;
  font-size: ${props => props.fontSize || 14}px;
  box-shadow: ${props => props.elevation ? `0 2px ${props.elevation}px rgba(0,0,0,0.2)` : 'none'};
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: ${props => props.hoverColor || '#F5F5F5'};
    box-shadow: ${props => props.elevation ? `0 4px ${props.elevation * 2}px rgba(0,0,0,0.2)` : 'none'};
  }

  .dropdown-selected {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 8px 0;
  }

  .dropdown-arrow {
    margin-left: 8px;
    color: ${props => props.arrowColor || '#757575'};
    transition: transform 0.2s ease;
  }
`;

const AppBarWidget = styled.div<{
  backgroundColor?: string;
  titleColor?: string;
  elevation?: number;
}>`
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor || '#2196F3'};
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 ${props => props.elevation || 4}px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 100;

  .appbar-title {
    flex: 1;
    text-align: center;
    color: ${props => props.titleColor || '#FFFFFF'};
    font-size: 18px;
    font-weight: 500;
    margin: 0;
  }

  .appbar-leading {
    margin-right: 16px;
  }

  .appbar-actions {
    margin-left: 16px;
  }
`;

interface CanvasWidgetProps {
  widget: FlutterWidget;
  deviceWidth?: number;
  deviceHeight?: number;
}

export function CanvasWidget({ widget, deviceWidth, deviceHeight }: CanvasWidgetProps) {
  const { state, dispatch } = useApp();
  const isSelected = state.selectedWidget?.id === widget.id;
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'canvas-widget',
    item: { type: 'canvas-widget', widget },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    // Eliminar hooks que pueden estar causando problemas
  });

  const handleSelect = (e: React.MouseEvent) => {
    if (e.detail === 1) { // Only on single click, not during drag
      e.stopPropagation();
      dispatch({ type: 'SELECT_WIDGET', payload: widget });
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Select the widget first
    dispatch({ type: 'SELECT_WIDGET', payload: widget });
    
    // Show context menu
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true
    });
  };

  const handleDeleteWidget = () => {
    dispatch({ type: 'DELETE_WIDGET', payload: widget.id });
    setContextMenu({ ...contextMenu, visible: false });
    
    // Send collaboration event for widget deletion
    if (collaborationService.isConnected()) {
      collaborationService.sendWidgetDeleted(widget.id);
    }
  };

  const handleEditWidget = () => {
    // Widget is already selected, just close menu
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only select widget if not already selected to avoid interfering with drag
    if (!isSelected) {
      e.stopPropagation();
      dispatch({ type: 'SELECT_WIDGET', payload: widget });
    }
  };

  const handleResize = (e: any, { size }: { size: { width: number; height: number } }) => {
    // Don't allow resizing of AppBar, BottomNavigationBar, and Table with 100% width if they are auto-adjusted
    if (adjustedWidget.type === 'appbar' || adjustedWidget.type === 'bottomnavbar' || 
        (adjustedWidget.type === 'table' && adjustedWidget.properties.width === '100%')) {
      return; // Prevent manual resizing
    }

    const newProperties = {
      ...widget.properties,
      width: size.width,
      height: size.height
    };

    dispatch({
      type: 'UPDATE_WIDGET',
      payload: {
        widgetId: widget.id,
        properties: newProperties
      }
    });
    
    // Send collaboration event for widget resize
    if (collaborationService.isConnected()) {
      collaborationService.sendWidgetUpdated(widget.id, newProperties, size);
    }
  };

  // Auto-adjust widget size and position for AppBar and BottomNavigationBar
  const getAdjustedWidget = () => {
    if (!deviceWidth || !deviceHeight) return widget;

    let adjustedWidget = { ...widget };

    if (widget.type === 'appbar') {
      // AppBar should span full width and be at the top
      adjustedWidget = {
        ...widget,
        size: {
          width: deviceWidth,
          height: widget.size.height
        },
        position: {
          x: 0,
          y: 0
        }
      };
    } else if (widget.type === 'bottomnavbar') {
      // BottomNavigationBar should span full width and be at the bottom of content area
      adjustedWidget = {
        ...widget,
        size: {
          width: deviceWidth,
          height: widget.size.height
        },
        position: {
          x: 0,
          y: Math.max(0, deviceHeight - widget.size.height)
        }
      };
    } else if (widget.type === 'table' && widget.properties.width === '100%') {
      // Table should span full width when width is set to 100%
      adjustedWidget = {
        ...widget,
        size: {
          width: deviceWidth,
          height: widget.size.height
        },
        position: {
          x: 0,
          y: widget.position.y
        }
      };
    }

    // Ensure widget stays within bounds
    if (adjustedWidget.position.x + adjustedWidget.size.width > deviceWidth) {
      adjustedWidget.position.x = Math.max(0, deviceWidth - adjustedWidget.size.width);
    }
    if (adjustedWidget.position.y + adjustedWidget.size.height > deviceHeight) {
      adjustedWidget.position.y = Math.max(0, deviceHeight - adjustedWidget.size.height);
    }

    return adjustedWidget;
  };

  const adjustedWidget = getAdjustedWidget();

  const renderWidgetContent = () => {
    const { properties } = widget;

    switch (widget.type) {
      case 'text':
        return (
          <TextWidget
            fontSize={properties.fontSize}
            color={properties.color}
            fontWeight={properties.fontWeight}
            textAlign={properties.textAlign}
          >
            {properties.text}
          </TextWidget>
        );

      case 'button':
        return (
          <ButtonWidget
            backgroundColor={properties.backgroundColor}
            textColor={properties.textColor}
            fontSize={properties.fontSize}
          >
            {properties.text}
          </ButtonWidget>
        );

      case 'textfield':
        return (
          <InputWidget
            placeholder={properties.placeholder}
            borderColor={properties.borderColor}
          />
        );

      case 'image':
        return (
          <ImageWidget
            src={properties.src}
            alt="Widget Image"
          />
        );

      case 'checkbox':
        return (
          <CheckboxWidget>
            <input 
              type="checkbox" 
              checked={properties.value} 
              readOnly
              style={{ accentColor: properties.activeColor }}
            />
            <span>{properties.label}</span>
          </CheckboxWidget>
        );

      case 'radio':
        return (
          <CheckboxWidget>
            <input 
              type="radio" 
              checked={properties.value} 
              readOnly
              style={{ accentColor: properties.activeColor }}
            />
            <span>{properties.label}</span>
          </CheckboxWidget>
        );

      case 'switch':
        return (
          <SwitchWidget 
            value={properties.value} 
            activeColor={properties.activeColor}
          >
            <div className="switch"></div>
          </SwitchWidget>
        );

      case 'slider':
        return (
          <SliderWidget>
            <div className="slider"></div>
          </SliderWidget>
        );

      case 'icon':
        const IconComponent = (LucideIcons as any)[properties.iconName] || LucideIcons.Star;
        return (
          <IconWidget color={properties.color} size={properties.size}>
            <IconComponent size={properties.size || 24} />
          </IconWidget>
        );

      case 'divider':
        return (
          <DividerWidget 
            orientation={properties.orientation}
            thickness={properties.thickness}
            color={properties.color}
          >
            <div className="divider"></div>
          </DividerWidget>
        );

      case 'progress':
        return (
          <ProgressWidget value={properties.value} valueColor={properties.valueColor}>
            <div className="progress-track">
              <div className="progress-indicator"></div>
            </div>
          </ProgressWidget>
        );

      case 'chip':
        return (
          <ChipWidget
            backgroundColor={properties.backgroundColor}
            textColor={properties.textColor}
          >
            {properties.label}
          </ChipWidget>
        );

      case 'appbar':
        return (
          <AppBarWidget 
            backgroundColor={properties.backgroundColor}
            titleColor={properties.titleColor}
            elevation={properties.elevation}
          >
            <div className="appbar-leading">
              {properties.leadingIcon && (
                <IconWidget color={properties.iconColor} size={24}>
                  {(LucideIcons as any)[properties.leadingIcon] ? 
                    React.createElement((LucideIcons as any)[properties.leadingIcon], { size: 24 })
                    : properties.leadingIcon
                  }
                </IconWidget>
              )}
            </div>
            <TextWidget className="appbar-title">
              {properties.title}
            </TextWidget>
            <div className="appbar-actions">
              {properties.actions?.map((action: any, index: number) => (
                <IconWidget key={index} color={properties.iconColor} size={24}>
                  {(LucideIcons as any)[action.icon] ? 
                    React.createElement((LucideIcons as any)[action.icon], { size: 24 })
                    : action.icon
                  }
                </IconWidget>
              ))}
            </div>
          </AppBarWidget>
        );

      case 'bottomnavbar':
        return (
          <BottomNavWidget 
            backgroundColor={properties.backgroundColor}
            selectedColor={properties.selectedColor}
            unselectedColor={properties.unselectedColor}
          >
            <div className="nav-items">
              {(properties.items || ['Home', 'Search', 'Profile']).map((item: string, index: number) => {
                const iconName = properties.icons?.[index] || ['Home', 'Search', 'User'][index] || 'Circle';
                const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Circle;
                
                return (
                  <div 
                    key={index} 
                    className={`nav-item ${index === properties.selectedIndex ? 'active' : ''}`}
                  >
                    <div className="nav-icon">
                      <IconComponent size={20} />
                    </div>
                    {properties.showLabels && <span className="nav-label">{item}</span>}
                  </div>
                );
              })}
            </div>
          </BottomNavWidget>
        );

      case 'checklist':
        return (
          <CheckListWidget>
            {(properties.items || ['Task 1', 'Task 2', 'Task 3']).map((item: string, index: number) => {
              const isChecked = (properties.checkedItems || []).includes(index);
              return (
                <div 
                  key={index} 
                  className="checklist-item"
                  style={{
                    color: properties.itemColor || '#000000',
                    fontSize: `${properties.fontSize || 14}px`,
                    marginBottom: `${properties.spacing || 8}px`
                  }}
                >
                  {isChecked ? (
                    <LucideIcons.CheckSquare 
                      size={16} 
                      style={{ 
                        color: properties.checkedColor || '#2196F3',
                        marginRight: '8px'
                      }} 
                    />
                  ) : (
                    <LucideIcons.Square 
                      size={16} 
                      style={{ 
                        color: properties.uncheckedColor || '#757575',
                        marginRight: '8px'
                      }} 
                    />
                  )}
                  <span>
                    {item}
                  </span>
                </div>
              );
            })}
          </CheckListWidget>
        );

      case 'table':
        return (
          <TableWidget 
            showBorders={properties.showBorders}
            borderColor={properties.borderColor}
            style={{
              '--row-color': properties.rowColor || '#FFFFFF',
              '--alternate-row-color': properties.alternateRowColor || '#F5F5F5'
            } as React.CSSProperties}
          >
            <table>
              <thead>
                <tr style={{ 
                  backgroundColor: properties.headerColor || '#2196F3',
                  color: properties.headerTextColor || '#FFFFFF'
                }}>
                  {(properties.columns || ['Column 1', 'Column 2']).map((column: string, index: number) => (
                    <th key={index} style={{ fontSize: `${properties.fontSize || 14}px` }}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(properties.rows || [['Data 1', 'Data 2']]).map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td 
                        key={cellIndex}
                        style={{ 
                          color: properties.textColor || '#000000',
                          fontSize: `${properties.fontSize || 14}px`,
                          padding: `${properties.padding || 8}px`
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWidget>
        );

      case 'listview':
        return (
          <ContainerWidget backgroundColor="#E8F5E8">
            <span style={{ color: '#999', fontSize: '12px' }}>
              ListView
            </span>
          </ContainerWidget>
        );
        
      case 'dropdown':
        return (
          <DropdownWidget
            backgroundColor={properties.backgroundColor}
            borderColor={properties.borderColor}
            borderWidth={properties.borderWidth}
            borderRadius={properties.borderRadius}
            textColor={properties.textColor}
            hoverColor={properties.hoverColor}
            arrowColor={properties.arrowColor}
            fontSize={properties.fontSize}
            elevation={properties.elevation}
          >
            <div className="dropdown-selected">
              {properties.value || properties.placeholder || 'Select an option'}
            </div>
            <div className="dropdown-arrow">
              <LucideIcons.ChevronDown size={properties.fontSize || 16} color={properties.arrowColor} />
            </div>
          </DropdownWidget>
        );

      default:
        return (
          <WidgetContent>
            <span style={{ color: '#999', fontSize: '12px' }}>
              {widget.type}
            </span>
          </WidgetContent>
        );
    }
  };

  const isResizable = !(adjustedWidget.type === 'appbar' || adjustedWidget.type === 'bottomnavbar' || 
                       (adjustedWidget.type === 'table' && adjustedWidget.properties.width === '100%'));

  return (
    <>
      {isResizable ? (
        <Resizable
          width={adjustedWidget.size.width}
          height={adjustedWidget.size.height}
          onResize={handleResize}
          minConstraints={[50, 50]}
          maxConstraints={[800, 600]}
        >
          <WidgetContainer
            ref={drag as any}
            x={adjustedWidget.position.x}
            y={adjustedWidget.position.y}
            width={adjustedWidget.size.width}
            height={adjustedWidget.size.height}
            isSelected={isSelected}
            isDragging={isDragging}
            onClick={handleSelect}
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDown}
          >
            {renderWidgetContent()}
          </WidgetContainer>
        </Resizable>
      ) : (
        <WidgetContainer
          ref={drag as any}
          x={adjustedWidget.position.x}
          y={adjustedWidget.position.y}
          width={adjustedWidget.size.width}
          height={adjustedWidget.size.height}
          isSelected={isSelected}
          isDragging={isDragging}
          onClick={handleSelect}
          onContextMenu={handleContextMenu}
          onMouseDown={handleMouseDown}
        >
          {renderWidgetContent()}
        </WidgetContainer>
      )}
      
      <WidgetContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        onDelete={handleDeleteWidget}
        onEdit={handleEditWidget}
      />
    </>
  );
}
