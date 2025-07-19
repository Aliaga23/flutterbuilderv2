import React, { useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { Page } from '../types';
import { v4 as uuidv4 } from 'uuid';

const ManagerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background: #FFFFFF;
  border-bottom: 1px solid #E1E5E9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const PageTabs = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const PageTab = styled.button<{ isActive: boolean }>`
  padding: 10px 20px;
  border: 1px solid ${props => props.isActive ? '#3B82F6' : '#E5E7EB'};
  background: ${props => props.isActive ? '#3B82F6' : '#FFFFFF'};
  color: ${props => props.isActive ? '#FFFFFF' : '#374151'};
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  letter-spacing: -0.025em;

  &:hover {
    border-color: #3B82F6;
    ${props => !props.isActive && `
      background: #F8FAFC;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `}
  }
`;

const CloseButton = styled.span`
  font-size: 14px;
  opacity: 0.7;
  margin-left: 6px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const AddPageButton = styled.button`
  padding: 10px 16px;
  border: 1px solid #3B82F6;
  background: #FFFFFF;
  color: #3B82F6;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;

  &:hover {
    background: #3B82F6;
    color: #FFFFFF;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const PageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #64748B;
  margin-left: auto;
  font-weight: 500;
`;

const WidgetCount = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
`;

const Modal = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button<{ primary?: boolean }>`
  padding: 10px 20px;
  border: 1px solid ${props => props.primary ? '#2196f3' : '#ddd'};
  background: ${props => props.primary ? '#2196f3' : '#ffffff'};
  color: ${props => props.primary ? '#ffffff' : '#333'};
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    ${props => props.primary 
      ? 'background: #1976d2;' 
      : 'background: #f5f5f5;'
    }
  }
`;

const RouteDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #F0F7FF 0%, #E6F3FF 100%);
  border: 1px solid #B3D9FF;
  border-radius: 8px;
  font-size: 12px;
  color: #1565C0;
  font-weight: 500;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
`;

const AutoRouteLabel = styled.span`
  background: #2196F3;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RoutePreview = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  color: #64748B;
`;

const RoutePreviewLabel = styled.div`
  font-size: 11px;
  color: #94A3B8;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const RoutePreviewText = styled.div`
  color: #1E293B;
  font-weight: 500;
`;

export function PageManager() {
  const { state, dispatch, getCurrentPage } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const currentPage = getCurrentPage();

  // Generate preview route based on page name
  const previewRoute = newPageName.trim() 
    ? `/${newPageName.trim().toLowerCase().replace(/\s+/g, '-')}`
    : '/new-page';

  const addPage = () => {
    if (!newPageName.trim()) return;

    const newPage: Page = {
      id: uuidv4(),
      name: newPageName.trim(),
      route: previewRoute, // Use the generated preview route
      widgets: []
    };

    dispatch({ type: 'ADD_PAGE', payload: newPage });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: newPage.id });
    setShowModal(false);
    setNewPageName('');
  };

  const deletePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (state.project.pages.length > 1) {
      dispatch({ type: 'DELETE_PAGE', payload: pageId });
    }
  };

  const switchPage = (pageId: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageId });
  };

  return (
    <>
      <ManagerContainer>
        <PageTabs>
          {state.project.pages.map(page => (
            <PageTab
              key={page.id}
              isActive={page.id === state.project.currentPageId}
              onClick={() => switchPage(page.id)}
            >
              ▢ {page.name}
              {state.project.pages.length > 1 && (
                <CloseButton onClick={(e) => deletePage(page.id, e)}>
                  ✕
                </CloseButton>
              )}
            </PageTab>
          ))}
        </PageTabs>

        <AddPageButton onClick={() => setShowModal(true)}>
          + Add Page
        </AddPageButton>

        <PageInfo>
          {currentPage && (
            <>
              <RouteDisplay>
                <AutoRouteLabel>AUTO</AutoRouteLabel>
                <span>{currentPage.route}</span>
              </RouteDisplay>
              <WidgetCount>
                {currentPage.widgets.length} widgets
              </WidgetCount>
            </>
          )}
        </PageInfo>
      </ManagerContainer>

      <Modal show={showModal}>
        <ModalContent>
          <ModalTitle>Add New Page</ModalTitle>
          <ModalInput
            type="text"
            placeholder="Enter page name..."
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPage()}
            autoFocus
          />
          <RoutePreview>
            <RoutePreviewLabel>Auto-generated route:</RoutePreviewLabel>
            <RoutePreviewText>{previewRoute}</RoutePreviewText>
          </RoutePreview>
          <ModalButtons>
            <ModalButton onClick={() => setShowModal(false)}>
              Cancel
            </ModalButton>
            <ModalButton primary onClick={addPage}>
              Add Page
            </ModalButton>
          </ModalButtons>
        </ModalContent>
      </Modal>
    </>
  );
}
