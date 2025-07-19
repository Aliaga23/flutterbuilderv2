import React, { useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';

const ViewerContainer = styled.div<{ isExpanded: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-top: 1px solid #E1E5E9;
  box-shadow: 
    0 -4px 6px -1px rgba(0, 0, 0, 0.1),
    0 -2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: ${props => props.isExpanded ? 'min(420px, 42vh)' : '60px'};
  max-height: 50vh;
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    height: ${props => props.isExpanded ? 'min(320px, 38vh)' : '55px'};
  }

  @media (max-width: 480px) {
    height: ${props => props.isExpanded ? 'min(280px, 35vh)' : '50px'};
  }
`;

const ViewerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
  border-bottom: 1px solid #E1E5E9;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%);
  }

  @media (max-width: 768px) {
    padding: 14px 20px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
  }
`;

const ViewerTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', system-ui, sans-serif;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 14px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    gap: 6px;
  }
`;

const ViewerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #E5E7EB;
  background: #FFFFFF;
  color: #374151;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;

  &:hover {
    border-color: #3B82F6;
    color: #3B82F6;
    background: #F8FAFC;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 11px;
  }
`;

const ToggleButton = styled.button<{ isExpanded: boolean }>`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 6px;
  color: #64748B;
  transform: rotate(${props => props.isExpanded ? '180deg' : '0deg'});
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const JsonContent = styled.div<{ isExpanded: boolean }>`
  height: ${props => props.isExpanded ? 'calc(100% - 50px)' : '0'};
  overflow: hidden;
`;

const JsonEditor = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  background: #fafafa;
  color: #333;
  resize: none;
  outline: none;

  &:focus {
    background: #ffffff;
  }
`;

const StatusIndicator = styled.div<{ status: 'valid' | 'invalid' | 'empty' }>`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'valid':
        return 'background: #e8f5e8; color: #2e7d32;';
      case 'invalid':
        return 'background: #ffebee; color: #c62828;';
      case 'empty':
        return 'background: #f5f5f5; color: #666;';
      default:
        return '';
    }
  }}
`;

const CopyNotification = styled.div<{ show: boolean }>`
  position: absolute;
  top: 60px;
  right: 16px;
  background: #4caf50;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

export function JsonViewer() {
  const { generateJSON, getCurrentPage } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  
  const currentPage = getCurrentPage();
  const json = generateJSON();
  
  const getJsonStatus = () => {
    if (!currentPage || currentPage.widgets.length === 0) return 'empty';
    try {
      JSON.parse(json);
      return 'valid';
    } catch {
      return 'invalid';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flutter-project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return json;
    }
  };

  const widgetCount = currentPage?.widgets.length || 0;
  const status = getJsonStatus();

  return (
    <ViewerContainer isExpanded={isExpanded}>
      <ViewerHeader onClick={() => setIsExpanded(!isExpanded)}>
        <ViewerTitle>
          ≡ Flutter JSON Export
          <StatusIndicator status={status}>
            {status === 'valid' && `${widgetCount} widgets`}
            {status === 'invalid' && 'Invalid JSON'}
            {status === 'empty' && 'No widgets'}
          </StatusIndicator>
        </ViewerTitle>
        
        <ViewerActions>
          {isExpanded && (
            <>
              <ActionButton onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}>
                ▤ Copy
              </ActionButton>
              <ActionButton onClick={(e) => { e.stopPropagation(); downloadJson(); }}>
                ↓ Download
              </ActionButton>
            </>
          )}
          <ToggleButton isExpanded={isExpanded}>
            ▼
          </ToggleButton>
        </ViewerActions>
      </ViewerHeader>
      
      <JsonContent isExpanded={isExpanded}>
        <JsonEditor
          value={formatJson()}
          readOnly
          placeholder="JSON will appear here as you build your Flutter app..."
        />
      </JsonContent>

      <CopyNotification show={showCopyNotification}>
        ✓ Copied to clipboard!
      </CopyNotification>
    </ViewerContainer>
  );
}
