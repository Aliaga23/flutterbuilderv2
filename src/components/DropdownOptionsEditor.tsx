import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E1E5E9;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  color: #1E293B;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748B;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #F1F5F9;
    color: #1E293B;
  }
`;

const OptionsList = styled.div`
  border: 1px solid #E1E5E9;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #E1E5E9;
  background: #FFFFFF;
  
  &:nth-child(even) {
    background: #F9FAFB;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const OptionInput = styled.input`
  flex: 1;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 1px #3B82F6;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const ActionButton = styled.button<{ variant?: string; disabled?: boolean }>`
  padding: 8px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover:not(:disabled) {
    background: #F9FAFB;
    border-color: #9CA3AF;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.variant === 'primary' && `
    background: #3B82F6;
    color: white;
    border-color: #3B82F6;
    
    &:hover:not(:disabled) {
      background: #2563EB;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background: #EF4444;
    color: white;
    border-color: #EF4444;
    
    &:hover:not(:disabled) {
      background: #DC2626;
    }
  `}
`;

const RemoveButton = styled(ActionButton)`
  padding: 4px 8px;
  margin-left: 8px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #E1E5E9;
`;

const NoOptionsMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #6B7280;
`;

interface DropdownOptionsEditorProps {
  isOpen: boolean;
  onClose: () => void;
  options: string[];
  onSave: (options: string[]) => void;
}

export function DropdownOptionsEditor({ 
  isOpen, 
  onClose, 
  options, 
  onSave 
}: DropdownOptionsEditorProps) {
  const [editableOptions, setEditableOptions] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setEditableOptions([...options]);
    }
  }, [isOpen, options]);

  const addOption = () => {
    setEditableOptions([...editableOptions, `Option ${editableOptions.length + 1}`]);
  };

  const removeOption = (index: number) => {
    setEditableOptions(editableOptions.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...editableOptions];
    newOptions[index] = value;
    setEditableOptions(newOptions);
  };

  const moveOptionUp = (index: number) => {
    if (index === 0) return;
    const newOptions = [...editableOptions];
    const temp = newOptions[index];
    newOptions[index] = newOptions[index - 1];
    newOptions[index - 1] = temp;
    setEditableOptions(newOptions);
  };

  const moveOptionDown = (index: number) => {
    if (index === editableOptions.length - 1) return;
    const newOptions = [...editableOptions];
    const temp = newOptions[index];
    newOptions[index] = newOptions[index + 1];
    newOptions[index + 1] = temp;
    setEditableOptions(newOptions);
  };

  const handleSave = () => {
    onSave(editableOptions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Dropdown Options</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ActionButtons>
          <ActionButton onClick={addOption} variant="primary">
            + Add Option
          </ActionButton>
        </ActionButtons>

        <OptionsList>
          {editableOptions.length === 0 ? (
            <NoOptionsMessage>
              No options yet. Click "Add Option" to add your first option.
            </NoOptionsMessage>
          ) : (
            editableOptions.map((option, index) => (
              <OptionItem key={index}>
                <span style={{ marginRight: '12px', color: '#64748B', width: '30px' }}>
                  #{index + 1}
                </span>
                <OptionInput
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder="Option text"
                />
                <div style={{ display: 'flex', marginLeft: '8px' }}>
                  <RemoveButton 
                    onClick={() => moveOptionUp(index)}
                    disabled={index === 0}
                    title="Move Up"
                    style={{ opacity: index === 0 ? 0.5 : 1 }}
                  >
                    ↑
                  </RemoveButton>
                  <RemoveButton 
                    onClick={() => moveOptionDown(index)}
                    disabled={index === editableOptions.length - 1}
                    title="Move Down"
                    style={{ opacity: index === editableOptions.length - 1 ? 0.5 : 1 }}
                  >
                    ↓
                  </RemoveButton>
                  <RemoveButton 
                    onClick={() => removeOption(index)}
                    variant="danger"
                    title="Remove"
                  >
                    ×
                  </RemoveButton>
                </div>
              </OptionItem>
            ))
          )}
        </OptionsList>

        <ModalFooter>
          <ActionButton onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton onClick={handleSave} variant="primary">
            Save Options
          </ActionButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}
