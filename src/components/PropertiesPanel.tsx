import React, { useState } from 'react';
import styled from 'styled-components';
import { ChromePicker } from 'react-color';
import { useApp } from '../context/AppContext';
import { FlutterWidget } from '../types';
import { IconSelector } from './IconSelector';
import { TableEditor } from './TableEditor';
import { DropdownOptionsEditor } from './DropdownOptionsEditor';
import { ChecklistItemsEditor } from './ChecklistItemsEditor';
import { generateFlutterApp, generateFunctionalAppWithAI } from '../services/authService';

const PanelContainer = styled.div`
  width: 320px;
  height: 100vh;
  background: #FFFFFF;
  border-left: 1px solid #E1E5E9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 
    -1px 0 3px 0 rgba(0, 0, 0, 0.05),
    -1px 0 2px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    width: 280px;
  }

  @media (max-width: 480px) {
    width: 240px;
  }
`;

const PanelHeader = styled.div`
  padding: 28px 24px;
  background: #FFFFFF;
  border-bottom: 1px solid #E1E5E9;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 20px 18px;
  }
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.025em;
  font-family: 'Inter', system-ui, sans-serif;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  min-height: 0;
  background: #F8FAFC;
  scrollbar-width: thin;
  scrollbar-color: #D1D5DB #F9FAFB;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #F9FAFB;
  }

  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
  }

  @media (max-width: 768px) {
    padding: 16px 18px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
  }
`;

const PropertyGroup = styled.div`
  margin-bottom: 32px;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 
    0 1px 3px 0 rgba(0, 0, 0, 0.05),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #E5E7EB;

  @media (max-width: 768px) {
    margin-bottom: 24px;
    padding: 16px;
  }
`;

const PropertyLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 4px;
  }
`;

const PropertyInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: #FFFFFF;
  color: #374151;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #9CA3AF;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
  }
`;

const PropertySelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: #FFFFFF;
  color: #374151;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #9CA3AF;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
  }
`;

const PropertyTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: #FFFFFF;
  color: #374151;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #9CA3AF;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background: #FFFFFF;
  color: #3B82F6;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F9FAFB;
    border-color: #3B82F6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ExportButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #e03c1fff 0%, #a34130ff 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #8a3737ff 0%, #df0b0bff 100%);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ExportWithAIButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px -3px rgba(139, 92, 246, 0.3);
    background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
`;



const ColorPreview = styled.div<{ color: string }>`
  width: 100%;
  height: 40px;
  background-color: ${props => props.color};
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${props => {
    // Calculate contrast for text color
    const hex = props.color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }};
  font-weight: 500;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  text-shadow: ${props => {
    const hex = props.color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '1px 1px 1px rgba(255,255,255,0.8)' : '1px 1px 1px rgba(0,0,0,0.8)';
  }};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: #3B82F6;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &::after {
    content: '🎨';
    position: absolute;
    top: 4px;
    right: 8px;
    font-size: 16px;
    opacity: 0.7;
  }
`;

const ColorPickerPopover = styled.div`
  position: absolute;
  z-index: 10000;
  margin-top: 8px;
  left: 0;
  right: 0;
`;



const EmptyState = styled.div`
  text-align: center;
  color: #999;
  padding: 40px 20px;
`;

const EditButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  fontSize: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #2563EB;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const InfoBox = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #64748B;
  background: #F8FAFC;
  padding: 8px;
  border-radius: 4px;
`;



const WidgetInfo = styled.div`
  background: #e3f2fd;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const WidgetType = styled.div`
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 4px;
`;

const WidgetId = styled.div`
  font-size: 12px;
  color: #666;
  font-family: monospace;
`;

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [showPicker, setShowPicker] = React.useState(false);
  const colorRef = React.useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPicker]);

  const handleColorChange = (color: any) => {
    onChange(color.hex);
  };

  return (
    <PropertyGroup ref={colorRef} style={{ position: 'relative' }}>
      <PropertyLabel>{label}</PropertyLabel>
      <ColorPreview
        color={value}
        onClick={() => setShowPicker(!showPicker)}
      >
        {value}
      </ColorPreview>
      {showPicker && (
        <ColorPickerPopover>
          <ChromePicker
            color={value}
            onChange={handleColorChange}
            disableAlpha={false}
          />
        </ColorPickerPopover>
      )}
    </PropertyGroup>
  );
}

export function PropertiesPanel() {
  const { state, dispatch, generateJSON } = useApp();
  const selectedWidget = state.selectedWidget;
  const dragPosition = state.dragPosition;
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [isDropdownOptionsEditorOpen, setIsDropdownOptionsEditorOpen] = useState(false);
  const [isChecklistItemsEditorOpen, setIsChecklistItemsEditorOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingWithAI, setIsExportingWithAI] = useState(false);

  const updateProperty = (property: string, value: any) => {
    if (!selectedWidget) return;

    dispatch({
      type: 'UPDATE_WIDGET',
      payload: {
        widgetId: selectedWidget.id,
        properties: {
          [property]: value
        }
      }
    });
  };

  const handleExportToFlutter = async () => {
    try {
      setIsExporting(true);
      
      // Generate the project JSON data
      const projectJson = JSON.parse(generateJSON());
      
      // Call the Flutter generation API
      const blob = await generateFlutterApp(projectJson);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename from project name
      const projectName = projectJson.name || 'flutter_app';
      const safeFileName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      link.download = `${safeFileName}_flutter_app.zip`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('Flutter application exported successfully!');
    } catch (error) {
      console.error('Error al exportar a Flutter:', error);
      alert('Error exporting Flutter application. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWithAI = async () => {
    try {
      setIsExportingWithAI(true);
      
      // Generate the project JSON data
      const projectJson = JSON.parse(generateJSON());
      
      // Get AI description from user
      const description = prompt(
        'Describe what you want to make functional in your app (e.g., "make it functional without deprecated code"):',
        'make it functional without deprecated code'
      );
      
      if (!description) {
        setIsExportingWithAI(false);
        return;
      }
      
      // Call the functional AI generation API
      const blob = await generateFunctionalAppWithAI(projectJson, description);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename from project name
      const projectName = projectJson.name || 'flutter_app';
      const safeFileName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      link.download = `${safeFileName}_ai_functional_flutter_app.zip`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('AI-powered functional Flutter application exported successfully!');
    } catch (error) {
      console.error('Error al exportar con AI:', error);
      alert('Error exporting AI-powered Flutter application. Please try again.');
    } finally {
      setIsExportingWithAI(false);
    }
  };

  const handleTableSave = (columns: string[], rows: string[][]) => {
    updateProperty('columns', columns);
    updateProperty('rows', rows);
  };

  // Drag position indicator component
  const DragPositionIndicator = () => {
    if (!dragPosition) return null;
    
    return (
      <PropertyGroup style={{ 
        backgroundColor: '#FEF3C7', 
        borderColor: '#F59E0B',
        borderWidth: '2px' 
      }}>
        <PropertyLabel style={{ color: '#92400E', fontWeight: 600 }}>
          🎯 Drag Position (Live)
        </PropertyLabel>
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          fontSize: '14px',
          fontFamily: 'monospace',
          color: '#92400E',
          fontWeight: 500
        }}>
          <div>X: {dragPosition.x}</div>
          <div>Y: {dragPosition.y}</div>
        </div>
      </PropertyGroup>
    );
  };

  if (!selectedWidget) {
    return (
      <PanelContainer>
        <PanelHeader>
          <PanelTitle>Properties</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <ExportButton onClick={handleExportToFlutter} disabled={isExporting}>
            {isExporting ? (
              <>
                <div className="spinner"></div>
                Exporting...
              </>
            ) : (
              <>
                Export to Flutter
              </>
            )}
          </ExportButton>
          
          <ExportWithAIButton onClick={handleExportWithAI} disabled={isExportingWithAI}>
            {isExportingWithAI ? (
              <>
                <div className="spinner"></div>
                Exporting with AI...
              </>
            ) : (
              <>
                Export with AI
              </>
            )}
          </ExportWithAIButton>
          
          <EmptyState>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙</div>
            <div>Select a widget to edit its properties</div>
          </EmptyState>
        </PanelContent>
      </PanelContainer>
    );
  }

  const renderProperties = (widget: FlutterWidget) => {
    const { properties } = widget;

    const commonProperties = (
      <>
        <PropertyGroup>
          <PropertyLabel>Position X</PropertyLabel>
          <PropertyInput
            type="number"
            value={Math.round(widget.position.x)}
            onChange={(e) => {
              dispatch({
                type: 'MOVE_WIDGET',
                payload: {
                  widgetId: widget.id,
                  position: { ...widget.position, x: Math.round(Number(e.target.value)) }
                }
              });
            }}
          />
        </PropertyGroup>

        <PropertyGroup>
          <PropertyLabel>Position Y</PropertyLabel>
          <PropertyInput
            type="number"
            value={Math.round(widget.position.y)}
            onChange={(e) => {
              dispatch({
                type: 'MOVE_WIDGET',
                payload: {
                  widgetId: widget.id,
                  position: { ...widget.position, y: Math.round(Number(e.target.value)) }
                }
              });
            }}
          />
        </PropertyGroup>

        <PropertyGroup>
          <PropertyLabel>Width</PropertyLabel>
          <PropertyInput
            type="number"
            value={widget.size.width}
            onChange={(e) => {
              dispatch({
                type: 'UPDATE_WIDGET',
                payload: {
                  widgetId: widget.id,
                  size: { ...widget.size, width: Number(e.target.value) }
                }
              });
            }}
          />
        </PropertyGroup>

        <PropertyGroup>
          <PropertyLabel>Height</PropertyLabel>
          <PropertyInput
            type="number"
            value={widget.size.height}
            onChange={(e) => {
              dispatch({
                type: 'UPDATE_WIDGET',
                payload: {
                  widgetId: widget.id,
                  size: { ...widget.size, height: Number(e.target.value) }
                }
              });
            }}
          />
        </PropertyGroup>
      </>
    );

    switch (widget.type) {
      case 'text':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Text</PropertyLabel>
              <PropertyTextarea
                value={properties.text || ''}
                onChange={(e) => updateProperty('text', e.target.value)}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Font Size</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.fontSize || 16}
                onChange={(e) => updateProperty('fontSize', Number(e.target.value))}
              />
            </PropertyGroup>
            <ColorPicker
              label="Text Color"
              value={properties.color || '#000000'}
              onChange={(color) => updateProperty('color', color)}
            />
            <PropertyGroup>
              <PropertyLabel>Font Weight</PropertyLabel>
              <PropertySelect
                value={properties.fontWeight || 'normal'}
                onChange={(e) => updateProperty('fontWeight', e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="300">Light</option>
                <option value="500">Medium</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
              </PropertySelect>
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Text Align</PropertyLabel>
              <PropertySelect
                value={properties.textAlign || 'left'}
                onChange={(e) => updateProperty('textAlign', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </PropertySelect>
            </PropertyGroup>
          </>
        );

      case 'button':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Button Text</PropertyLabel>
              <PropertyInput
                value={properties.text || ''}
                onChange={(e) => updateProperty('text', e.target.value)}
              />
            </PropertyGroup>
            <ColorPicker
              label="Background Color"
              value={properties.backgroundColor || '#2196F3'}
              onChange={(color) => updateProperty('backgroundColor', color)}
            />
            <ColorPicker
              label="Text Color"
              value={properties.textColor || '#FFFFFF'}
              onChange={(color) => updateProperty('textColor', color)}
            />
            <PropertyGroup>
              <PropertyLabel>Font Size</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.fontSize || 16}
                onChange={(e) => updateProperty('fontSize', Number(e.target.value))}
              />
            </PropertyGroup>
          </>
        );

      case 'textfield':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Placeholder</PropertyLabel>
              <PropertyInput
                value={properties.placeholder || ''}
                onChange={(e) => updateProperty('placeholder', e.target.value)}
              />
            </PropertyGroup>
            <ColorPicker
              label="Border Color"
              value={properties.borderColor || '#CCCCCC'}
              onChange={(color) => updateProperty('borderColor', color)}
            />
          </>
        );

      case 'image':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Image URL</PropertyLabel>
              <PropertyInput
                value={properties.src || ''}
                onChange={(e) => updateProperty('src', e.target.value)}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Fit</PropertyLabel>
              <PropertySelect
                value={properties.fit || 'cover'}
                onChange={(e) => updateProperty('fit', e.target.value)}
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
                <option value="fitWidth">Fit Width</option>
                <option value="fitHeight">Fit Height</option>
              </PropertySelect>
            </PropertyGroup>
          </>
        );

      case 'container':
        return (
          <>
            {commonProperties}
            <ColorPicker
              label="Background Color"
              value={properties.color || '#E3F2FD'}
              onChange={(color) => updateProperty('color', color)}
            />
            <PropertyGroup>
              <PropertyLabel>Padding</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.padding || 16}
                onChange={(e) => updateProperty('padding', Number(e.target.value))}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Margin</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.margin || 8}
                onChange={(e) => updateProperty('margin', Number(e.target.value))}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Border Radius</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.borderRadius || 4}
                onChange={(e) => updateProperty('borderRadius', Number(e.target.value))}
              />
            </PropertyGroup>
          </>
        );

      case 'appbar':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Title</PropertyLabel>
              <PropertyInput
                value={properties.title || ''}
                onChange={(e) => updateProperty('title', e.target.value)}
              />
            </PropertyGroup>
            <ColorPicker
              label="Background Color"
              value={properties.backgroundColor || '#2196F3'}
              onChange={(color) => updateProperty('backgroundColor', color)}
            />
            <ColorPicker
              label="Title Color"
              value={properties.titleColor || '#FFFFFF'}
              onChange={(color) => updateProperty('titleColor', color)}
            />
          </>
        );

      case 'bottomnavbar':
        const items = properties.items || [];
        const icons = properties.icons || [];
        
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Items</PropertyLabel>
              <PropertyTextarea
                value={items.join('\n')}
                onChange={(e) => {
                  const newItems = e.target.value.split('\n').filter(item => item.trim());
                  updateProperty('items', newItems);
                  // Adjust icons array to match items length
                  const currentIcons = properties.icons || [];
                  const adjustedIcons = newItems.map((_, index) => currentIcons[index] || 'Home');
                  updateProperty('icons', adjustedIcons);
                }}
                placeholder="Enter each item on a new line"
              />
            </PropertyGroup>
            
            {items.length > 0 && (
              <PropertyGroup>
                <PropertyLabel>Icons</PropertyLabel>
                {items.map((item: string, index: number) => (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                      {item}
                    </div>
                    <IconSelector
                      value={icons[index] || 'Home'}
                      onChange={(iconName: string) => {
                        const newIcons = [...icons];
                        newIcons[index] = iconName;
                        updateProperty('icons', newIcons);
                      }}
                      placeholder="Select icon"
                    />
                  </div>
                ))}
              </PropertyGroup>
            )}
            
            <PropertyGroup>
              <PropertyLabel>Selected Index</PropertyLabel>
              <PropertyInput
                type="number"
                min="0"
                max={Math.max(0, items.length - 1)}
                value={properties.selectedIndex || 0}
                onChange={(e) => updateProperty('selectedIndex', Number(e.target.value))}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Show Labels</PropertyLabel>
              <PropertySelect
                value={properties.showLabels ? 'true' : 'false'}
                onChange={(e) => updateProperty('showLabels', e.target.value === 'true')}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </PropertySelect>
            </PropertyGroup>
            <ColorPicker
              label="Background Color"
              value={properties.backgroundColor || '#FFFFFF'}
              onChange={(color) => updateProperty('backgroundColor', color)}
            />
            <ColorPicker
              label="Selected Color"
              value={properties.selectedColor || '#2196F3'}
              onChange={(color) => updateProperty('selectedColor', color)}
            />
            <ColorPicker
              label="Unselected Color"
              value={properties.unselectedColor || '#757575'}
              onChange={(color) => updateProperty('unselectedColor', color)}
            />
          </>
        );

      case 'checklist':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Checklist Items</PropertyLabel>
              <EditButton onClick={() => setIsChecklistItemsEditorOpen(true)}>
                📝 Edit Checklist Items
              </EditButton>
              <InfoBox>
                {properties.items?.length || 0} items, {(properties.checkedItems || []).length} checked
              </InfoBox>
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Font Size</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.fontSize || 14}
                onChange={(e) => updateProperty('fontSize', Number(e.target.value))}
              />
            </PropertyGroup>
            <ColorPicker
              label="Text Color"
              value={properties.itemColor || '#000000'}
              onChange={(color) => updateProperty('itemColor', color)}
            />
            <ColorPicker
              label="Checked Color"
              value={properties.checkedColor || '#2196F3'}
              onChange={(color) => updateProperty('checkedColor', color)}
            />
            <ColorPicker
              label="Unchecked Color"
              value={properties.uncheckedColor || '#757575'}
              onChange={(color) => updateProperty('uncheckedColor', color)}
            />
          </>
        );

      case 'table':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Table Data</PropertyLabel>
              <EditButton onClick={() => setShowTableEditor(true)}>
                📝 Edit Table Data
              </EditButton>
              <InfoBox>
                Current: {properties.columns?.length || 0} columns, {properties.rows?.length || 0} rows
              </InfoBox>
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Font Size</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.fontSize || 14}
                onChange={(e) => updateProperty('fontSize', Number(e.target.value))}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Cell Padding</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.padding || 8}
                onChange={(e) => updateProperty('padding', Number(e.target.value))}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Show Borders</PropertyLabel>
              <PropertySelect
                value={properties.showBorders ? 'true' : 'false'}
                onChange={(e) => updateProperty('showBorders', e.target.value === 'true')}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </PropertySelect>
            </PropertyGroup>
            <ColorPicker
              label="Header Background"
              value={properties.headerColor || '#2196F3'}
              onChange={(color) => updateProperty('headerColor', color)}
            />
            <ColorPicker
              label="Header Text Color"
              value={properties.headerTextColor || '#FFFFFF'}
              onChange={(color) => updateProperty('headerTextColor', color)}
            />
            <ColorPicker
              label="Row Background"
              value={properties.rowColor || '#FFFFFF'}
              onChange={(color) => updateProperty('rowColor', color)}
            />
            <ColorPicker
              label="Alternate Row Background"
              value={properties.alternateRowColor || '#F5F5F5'}
              onChange={(color) => updateProperty('alternateRowColor', color)}
            />
            <ColorPicker
              label="Text Color"
              value={properties.textColor || '#000000'}
              onChange={(color) => updateProperty('textColor', color)}
            />
            <ColorPicker
              label="Border Color"
              value={properties.borderColor || '#E0E0E0'}
              onChange={(color) => updateProperty('borderColor', color)}
            />
          </>
        );

      case 'checkbox':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Label</PropertyLabel>
              <PropertyInput
                value={properties.label || ''}
                onChange={(e) => updateProperty('label', e.target.value)}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Checked</PropertyLabel>
              <PropertySelect
                value={properties.value ? 'true' : 'false'}
                onChange={(e) => updateProperty('value', e.target.value === 'true')}
              >
                <option value="true">Checked</option>
                <option value="false">Unchecked</option>
              </PropertySelect>
            </PropertyGroup>
            <ColorPicker
              label="Active Color"
              value={properties.activeColor || '#2196F3'}
              onChange={(color) => updateProperty('activeColor', color)}
            />
          </>
        );

      case 'icon':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Icon</PropertyLabel>
              <IconSelector
                value={properties.iconName || 'Star'}
                onChange={(iconName) => updateProperty('iconName', iconName)}
                placeholder="Select an icon"
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Size</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.size || 24}
                onChange={(e) => updateProperty('size', Number(e.target.value))}
              />
            </PropertyGroup>
            <ColorPicker
              label="Color"
              value={properties.color || '#000000'}
              onChange={(color) => updateProperty('color', color)}
            />
          </>
        );

      case 'radio':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Label</PropertyLabel>
              <PropertyInput
                value={properties.label || ''}
                onChange={(e) => updateProperty('label', e.target.value)}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Selected</PropertyLabel>
              <PropertySelect
                value={properties.value ? 'true' : 'false'}
                onChange={(e) => updateProperty('value', e.target.value === 'true')}
              >
                <option value="true">Selected</option>
                <option value="false">Not Selected</option>
              </PropertySelect>
            </PropertyGroup>
            <ColorPicker
              label="Active Color"
              value={properties.activeColor || '#2196F3'}
              onChange={(color) => updateProperty('activeColor', color)}
            />
          </>
        );
        
      case 'dropdown':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Placeholder</PropertyLabel>
              <PropertyInput
                value={properties.placeholder || 'Select an option'}
                onChange={(e) => updateProperty('placeholder', e.target.value)}
              />
            </PropertyGroup>
            
            <PropertyGroup>
              <PropertyLabel>Options</PropertyLabel>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748B' }}>
                  {(properties.items || []).length} options defined
                </span>
                <ActionButton onClick={() => setIsDropdownOptionsEditorOpen(true)}>
                  Edit Options
                </ActionButton>
              </div>
              {properties.items && properties.items.length > 0 && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '8px', 
                  backgroundColor: '#F9FAFB', 
                  borderRadius: '4px', 
                  maxHeight: '120px', 
                  overflow: 'auto' 
                }}>
                  {properties.items.map((item: string, index: number) => (
                    <div key={index} style={{ 
                      padding: '6px 8px', 
                      marginBottom: '4px', 
                      borderRadius: '4px',
                      background: '#FFF',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              )}
              {isDropdownOptionsEditorOpen && selectedWidget?.type === 'dropdown' && (
                <DropdownOptionsEditor 
                  isOpen={isDropdownOptionsEditorOpen}
                  onClose={() => setIsDropdownOptionsEditorOpen(false)}
                  options={properties.items || []}
                  onSave={(options) => updateProperty('items', options)}
                />
              )}
            </PropertyGroup>
            
            <PropertyGroup>
              <PropertyLabel>Selected Value</PropertyLabel>
              <PropertySelect
                value={properties.value || ''}
                onChange={(e) => updateProperty('value', e.target.value)}
              >
                <option value="">None (Show Placeholder)</option>
                {(properties.items || []).map((item: string, index: number) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </PropertySelect>
            </PropertyGroup>
            
            <PropertyGroup>
              <PropertyLabel>Font Size</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.fontSize || 14}
                onChange={(e) => updateProperty('fontSize', Number(e.target.value))}
              />
            </PropertyGroup>
            
            <PropertyGroup>
              <PropertyLabel>Border Radius</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.borderRadius || 4}
                onChange={(e) => updateProperty('borderRadius', Number(e.target.value))}
              />
            </PropertyGroup>
            
            <PropertyGroup>
              <PropertyLabel>Border Width</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.borderWidth || 1}
                onChange={(e) => updateProperty('borderWidth', Number(e.target.value))}
              />
            </PropertyGroup>
            
            <PropertyGroup>
              <PropertyLabel>Elevation</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.elevation || 2}
                onChange={(e) => updateProperty('elevation', Number(e.target.value))}
              />
            </PropertyGroup>
            
            <ColorPicker
              label="Background Color"
              value={properties.backgroundColor || '#FFFFFF'}
              onChange={(color) => updateProperty('backgroundColor', color)}
            />
            
            <ColorPicker
              label="Border Color"
              value={properties.borderColor || '#CCCCCC'}
              onChange={(color) => updateProperty('borderColor', color)}
            />
            
            <ColorPicker
              label="Text Color"
              value={properties.textColor || '#000000'}
              onChange={(color) => updateProperty('textColor', color)}
            />
            
            <ColorPicker
              label="Arrow Color"
              value={properties.arrowColor || '#757575'}
              onChange={(color) => updateProperty('arrowColor', color)}
            />
            
            <ColorPicker
              label="Hover Color"
              value={properties.hoverColor || '#F5F5F5'}
              onChange={(color) => updateProperty('hoverColor', color)}
            />
          </>
        );

      case 'switch':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Value</PropertyLabel>
              <PropertySelect
                value={properties.value ? 'true' : 'false'}
                onChange={(e) => updateProperty('value', e.target.value === 'true')}
              >
                <option value="true">On</option>
                <option value="false">Off</option>
              </PropertySelect>
            </PropertyGroup>
            <ColorPicker
              label="Active Color"
              value={properties.activeColor || '#2196F3'}
              onChange={(color) => updateProperty('activeColor', color)}
            />
            <ColorPicker
              label="Inactive Color"
              value={properties.inactiveColor || '#CCCCCC'}
              onChange={(color) => updateProperty('inactiveColor', color)}
            />
          </>
        );

      case 'slider':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Value</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.value || 50}
                onChange={(e) => updateProperty('value', Number(e.target.value))}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Minimum</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.min || 0}
                onChange={(e) => updateProperty('min', Number(e.target.value))}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Maximum</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.max || 100}
                onChange={(e) => updateProperty('max', Number(e.target.value))}
              />
            </PropertyGroup>
            <ColorPicker
              label="Active Color"
              value={properties.activeColor || '#2196F3'}
              onChange={(color) => updateProperty('activeColor', color)}
            />
          </>
        );

      case 'divider':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Orientation</PropertyLabel>
              <PropertySelect
                value={properties.orientation || 'horizontal'}
                onChange={(e) => updateProperty('orientation', e.target.value)}
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </PropertySelect>
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Thickness</PropertyLabel>
              <PropertyInput
                type="number"
                value={properties.thickness || 1}
                onChange={(e) => updateProperty('thickness', Number(e.target.value))}
              />
            </PropertyGroup>
            <ColorPicker
              label="Color"
              value={properties.color || '#E0E0E0'}
              onChange={(color) => updateProperty('color', color)}
            />
          </>
        );

      case 'progress':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Value (0-1)</PropertyLabel>
              <PropertyInput
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={properties.value || 0.5}
                onChange={(e) => updateProperty('value', Number(e.target.value))}
              />
            </PropertyGroup>
            <ColorPicker
              label="Background Color"
              value={properties.backgroundColor || '#E0E0E0'}
              onChange={(color) => updateProperty('backgroundColor', color)}
            />
            <ColorPicker
              label="Progress Color"
              value={properties.valueColor || '#2196F3'}
              onChange={(color) => updateProperty('valueColor', color)}
            />
          </>
        );

      case 'chip':
        return (
          <>
            {commonProperties}
            <PropertyGroup>
              <PropertyLabel>Label</PropertyLabel>
              <PropertyInput
                value={properties.label || ''}
                onChange={(e) => updateProperty('label', e.target.value)}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Delete Icon</PropertyLabel>
              <PropertySelect
                value={properties.deleteIcon ? 'true' : 'false'}
                onChange={(e) => updateProperty('deleteIcon', e.target.value === 'true')}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </PropertySelect>
            </PropertyGroup>
            <ColorPicker
              label="Background Color"
              value={properties.backgroundColor || '#E0E0E0'}
              onChange={(color) => updateProperty('backgroundColor', color)}
            />
            <ColorPicker
              label="Text Color"
              value={properties.textColor || '#000000'}
              onChange={(color) => updateProperty('textColor', color)}
            />
          </>
        );

      default:
        return commonProperties;
    }
  };

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>Inspector</PanelTitle>
      </PanelHeader>
      <PanelContent>
        <WidgetInfo>
          <WidgetType>{selectedWidget.name}</WidgetType>
          <WidgetId>ID: {selectedWidget.id}</WidgetId>
        </WidgetInfo>

        <DragPositionIndicator />

        {renderProperties(selectedWidget)}

        <div style={{ 
          padding: '16px 0', 
          fontSize: '12px', 
          color: '#999', 
          textAlign: 'center',
          borderTop: '1px solid #e0e0e0',
          marginTop: '20px'
        }}>
          Right-click widget to delete
        </div>
      </PanelContent>
      
      <TableEditor
        isOpen={showTableEditor}
        onClose={() => setShowTableEditor(false)}
        columns={selectedWidget?.properties.columns || []}
        rows={selectedWidget?.properties.rows || []}
        onSave={handleTableSave}
      />
      
      {isChecklistItemsEditorOpen && selectedWidget?.type === 'checklist' && (
        <ChecklistItemsEditor
          isOpen={isChecklistItemsEditorOpen}
          onClose={() => setIsChecklistItemsEditorOpen(false)}
          items={selectedWidget?.properties.items || []}
          checkedItems={selectedWidget?.properties.checkedItems || []}
          onSave={(items, checkedItems) => {
            updateProperty('items', items);
            updateProperty('checkedItems', checkedItems);
          }}
        />
      )}
    </PanelContainer>
  );
}
