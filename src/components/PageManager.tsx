import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { Page } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { collaborationService } from '../services/collaborationService';

const ManagerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background: #FFFFFF;
  border-bottom: 1px solid #E1E5E9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const PageDropdownContainer = styled.div`
  position: relative;
  flex: 1;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 200px;
  padding: 8px 12px;
  border: 1px solid #E1E5E9;
  background: #FFFFFF;
  color: #374151;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const DropdownArrow = styled.span<{ isOpen: boolean }>`
  transition: transform 0.2s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  color: #6B7280;
  font-size: 12px;
  margin-left: 8px;
  flex-shrink: 0;
`;

const DropdownMenu = styled.div<{ show: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  background: #FFFFFF;
  border: 1px solid #E1E5E9;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  display: ${props => props.show ? 'block' : 'none'};
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

const DropdownItem = styled.div<{ isActive?: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  background: ${props => props.isActive ? '#F8FAFC' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  border-left: ${props => props.isActive ? '3px solid #3B82F6' : '3px solid transparent'};
  min-height: 36px;

  &:hover {
    background: #F8FAFC;
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

const PageItemContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const PageName = styled.span`
  font-weight: 500;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const PageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-left: 8px;

  ${DropdownItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  padding: 4px;
  border: none;
  background: transparent;
  color: #6B7280;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  &:hover {
    background: #E5E7EB;
    color: #374151;
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    background: #FEE2E2;
    color: #DC2626;
  }
`;

const AddPageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #3B82F6;
  background: #3B82F6;
  color: #FFFFFF;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background: #2563EB;
    border-color: #2563EB;
  }
`;

const PageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
`;

const WidgetCount = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 12px;
`;

const RouteDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #F0F7FF 0%, #E6F3FF 100%);
  border: 1px solid #B3D9FF;
  border-radius: 6px;
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

const EditInput = styled.input`
  background: #FFFFFF;
  border: 1px solid #3B82F6;
  font-size: 14px;
  color: #374151;
  font-family: inherit;
  width: 120px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

export function PageManager() {
  const { state, dispatch, getCurrentPage } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentPage = getCurrentPage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setEditingPageId(null);
        setEditingName('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate preview route based on page name
  const previewRoute = newPageName.trim() 
    ? `/${newPageName.trim().toLowerCase().replace(/\s+/g, '-')}`
    : '/new-page';

  const addPage = () => {
    if (!newPageName.trim()) return;

    const newPage: Page = {
      id: uuidv4(),
      name: newPageName.trim(),
      route: previewRoute,
      widgets: []
    };

    dispatch({ type: 'ADD_PAGE', payload: newPage });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: newPage.id });
    
    // Enviar evento de colaboración
    if (collaborationService.isConnected()) {
      collaborationService.sendPageAdded(newPage);
    }
    
    setShowModal(false);
    setNewPageName('');
  };

  const deletePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (state.project.pages.length > 1) {
      dispatch({ type: 'DELETE_PAGE', payload: pageId });
      
      // Enviar evento de colaboración
      if (collaborationService.isConnected()) {
        collaborationService.sendPageDeleted(pageId);
      }
    }
  };

  const switchPage = (pageId: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageId });
    setShowDropdown(false);
  };

  const startEditing = (page: Page, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPageId(page.id);
    setEditingName(page.name);
  };

  const saveEdit = (pageId: string) => {
    if (editingName.trim()) {
      // Generate a new route based on the edited name
      const newRoute = `/${editingName.trim().toLowerCase().replace(/\s+/g, '-')}`;
      
      dispatch({ 
        type: 'UPDATE_PAGE', 
        payload: { 
          pageId, 
          name: editingName.trim(),
          route: newRoute
        } 
      });
      
      // Enviar evento de colaboración
      if (collaborationService.isConnected()) {
        collaborationService.sendPageUpdated(pageId, editingName.trim(), newRoute);
      }
    }
    setEditingPageId(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingPageId(null);
    setEditingName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, pageId: string) => {
    if (e.key === 'Enter') {
      saveEdit(pageId);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <>
      <ManagerContainer>
        <PageDropdownContainer ref={dropdownRef}>
          <DropdownButton onClick={() => setShowDropdown(!showDropdown)}>
            <span>{currentPage?.name || 'Select Page'}</span>
            <DropdownArrow isOpen={showDropdown}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </DropdownArrow>
          </DropdownButton>
          
          <DropdownMenu show={showDropdown}>
            {state.project.pages.map(page => (
              <DropdownItem 
                key={page.id} 
                isActive={page.id === state.project.currentPageId}
                onClick={() => switchPage(page.id)}
              >
                <PageItemContent>
                  {editingPageId === page.id ? (
                    <EditInput
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, page.id)}
                      onBlur={() => saveEdit(page.id)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <PageName>{page.name}</PageName>
                  )}
                </PageItemContent>
                
                <PageActions>
                  {editingPageId !== page.id && (
                    <ActionButton onClick={(e) => startEditing(page, e)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </ActionButton>
                  )}
                  {state.project.pages.length > 1 && (
                    <DeleteButton onClick={(e) => deletePage(page.id, e)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </DeleteButton>
                  )}
                </PageActions>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </PageDropdownContainer>

        <AddPageButton onClick={() => setShowModal(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          New Page
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
