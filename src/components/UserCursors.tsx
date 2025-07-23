import React from 'react';
import styled from 'styled-components';
import { MousePointer2 } from 'lucide-react';

interface UserCursor {
  x: number;
  y: number;
  color: string;
  username: string;
}

interface UserCursorsProps {
  cursors: Map<string, UserCursor>;
}

const CursorContainer = styled.div<{ x: number; y: number; color: string }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  pointer-events: none;
  z-index: 999;
  transform: translate(-2px, -2px);
  transition: all 0.1s ease-out;
`;

const CursorIcon = styled.div<{ color: string }>`
  color: ${props => props.color};
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const CursorLabel = styled.div<{ color: string }>`
  background: ${props => props.color};
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  margin-top: 8px;
  margin-left: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 8px;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid ${props => props.color};
  }
`;

export const UserCursors: React.FC<UserCursorsProps> = ({ cursors }) => {
  return (
    <>
      {Array.from(cursors.entries()).map(([userId, cursor]) => (
        <CursorContainer
          key={userId}
          x={cursor.x}
          y={cursor.y}
          color={cursor.color}
        >
          <CursorIcon color={cursor.color}>
            <MousePointer2 size={16} />
          </CursorIcon>
          <CursorLabel color={cursor.color}>
            {cursor.username}
          </CursorLabel>
        </CursorContainer>
      ))}
    </>
  );
};
