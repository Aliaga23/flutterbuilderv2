import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Trash2, Copy, Edit3 } from 'lucide-react';

const ContextMenu = styled.div<{ x: number; y: number; visible: boolean }>`
  position: fixed;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  min-width: 150px;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'scale(1)' : 'scale(0.95)'};
  transition: all 0.1s ease;
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: white;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }

  &:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  &:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  &.danger {
    color: #f44336;

    &:hover {
      background: #ffebee;
    }
  }
`;

const Overlay = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1999;
  display: ${props => props.visible ? 'block' : 'none'};
`;

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onCopy?: () => void;
}

export function WidgetContextMenu({ 
  x, 
  y, 
  visible, 
  onClose, 
  onDelete, 
  onEdit,
  onCopy 
}: ContextMenuProps) {
  const [adjustedPosition, setAdjustedPosition] = useState({ x, y });

  useEffect(() => {
    if (visible) {
      // Adjust position to keep menu within viewport
      const menuWidth = 150;
      const menuHeight = 120;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      if (x + menuWidth > viewportWidth) {
        adjustedX = x - menuWidth;
      }

      if (y + menuHeight > viewportHeight) {
        adjustedY = y - menuHeight;
      }

      setAdjustedPosition({ x: adjustedX, y: adjustedY });
    }
  }, [x, y, visible]);

  if (!visible) return null;

  return (
    <>
      <Overlay visible={visible} onClick={onClose} />
      <ContextMenu x={adjustedPosition.x} y={adjustedPosition.y} visible={visible}>
        <MenuItem onClick={onEdit}>
          <Edit3 size={16} />
          Edit Properties
        </MenuItem>
        {onCopy && (
          <MenuItem onClick={onCopy}>
            <Copy size={16} />
            Duplicate
          </MenuItem>
        )}
        <MenuItem className="danger" onClick={onDelete}>
          <Trash2 size={16} />
          Delete Widget
        </MenuItem>
      </ContextMenu>
    </>
  );
}
