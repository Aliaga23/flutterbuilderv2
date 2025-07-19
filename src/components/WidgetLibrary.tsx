import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import * as LucideIcons from 'lucide-react';
import { WIDGET_TEMPLATES, WIDGET_CATEGORIES } from '../constants/widgets';
import { WidgetTemplate } from '../types';

const LibraryContainer = styled.div`
  width: 320px;
  height: 100vh;
  background: #FFFFFF;
  border-right: 1px solid #E1E5E9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 
    1px 0 3px 0 rgba(0, 0, 0, 0.05),
    1px 0 2px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    width: 280px;
  }

  @media (max-width: 480px) {
    width: 240px;
  }
`;

const LibraryHeader = styled.div`
  padding: 28px 24px;
  background: #FFFFFF;
  border-bottom: 1px solid #E1E5E9;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 20px 18px;
  }
`;

const LibraryTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.025em;
  font-family: 'Inter', system-ui, sans-serif;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }
`;

const CategoryFilter = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  background: #FFFFFF;
  color: #374151;
  transition: all 0.2s ease;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #9CA3AF;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 10px 14px;
  }
`;

const WidgetList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0;
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
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const WidgetItem = styled.div<{ isDragging: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  cursor: move;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.isDragging ? 0.5 : 1};
  position: relative;

  &:hover {
    border-color: #3B82F6;
    box-shadow: 
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
    background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 14px;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 8px;
  }
`;

const WidgetIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: #3B82F6;
  background: linear-gradient(135deg, #EBF4FF 0%, #DBEAFE 100%);
  padding: 10px;
  border-radius: 10px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-right: 8px;
  }
`;

const WidgetInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const WidgetName = styled.div`
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  letter-spacing: -0.025em;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const WidgetDescription = styled.div`
  font-size: 13px;
  color: #64748B;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    -webkit-line-clamp: 1;
  }
`;

const CategoryBadge = styled.span`
  font-size: 10px;
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
`;

interface DraggableWidgetProps {
  template: WidgetTemplate;
}

function DraggableWidget({ template }: DraggableWidgetProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'widget',
    item: { type: 'widget', widgetType: template.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const IconComponent = (LucideIcons as any)[template.icon];

  return (
    <WidgetItem ref={drag as any} isDragging={isDragging}>
      <WidgetIcon>
        {IconComponent && <IconComponent size={20} />}
      </WidgetIcon>
      <WidgetInfo>
        <WidgetName>{template.name}</WidgetName>
        <WidgetDescription>{template.description}</WidgetDescription>
      </WidgetInfo>
      <CategoryBadge>{template.category}</CategoryBadge>
    </WidgetItem>
  );
}

export function WidgetLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredWidgets = WIDGET_TEMPLATES.filter(
    widget => selectedCategory === 'All' || widget.category === selectedCategory
  );

  return (
    <LibraryContainer>
      <LibraryHeader>
        <LibraryTitle>Component Library</LibraryTitle>
        <CategoryFilter
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {WIDGET_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </CategoryFilter>
      </LibraryHeader>
      
      <WidgetList>
        {filteredWidgets.map(template => (
          <DraggableWidget key={template.id} template={template} />
        ))}
      </WidgetList>
    </LibraryContainer>
  );
}
