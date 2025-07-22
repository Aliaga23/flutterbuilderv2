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

const ItemsList = styled.div`
  border: 1px solid #E1E5E9;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const ItemRow = styled.div`
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

const ItemInput = styled.input`
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

const CheckboxContainer = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
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

const NoItemsMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #6B7280;
`;

interface ChecklistItemsEditorProps {
  isOpen: boolean;
  onClose: () => void;
  items: string[];
  checkedItems: number[];
  onSave: (items: string[], checkedItems: number[]) => void;
}

export function ChecklistItemsEditor({ 
  isOpen, 
  onClose, 
  items, 
  checkedItems,
  onSave 
}: ChecklistItemsEditorProps) {
  const [editableItems, setEditableItems] = useState<string[]>([]);
  const [editableCheckedItems, setEditableCheckedItems] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      setEditableItems([...items]);
      setEditableCheckedItems([...checkedItems]);
    }
  }, [isOpen, items, checkedItems]);

  const addItem = () => {
    setEditableItems([...editableItems, `Item ${editableItems.length + 1}`]);
  };

  const removeItem = (index: number) => {
    // Remove the item
    const newItems = editableItems.filter((_, i) => i !== index);
    setEditableItems(newItems);
    
    // Update checked items (remove and adjust indices)
    const newCheckedItems = editableCheckedItems
      .filter(itemIndex => itemIndex !== index)
      .map(itemIndex => itemIndex > index ? itemIndex - 1 : itemIndex);
    
    setEditableCheckedItems(newCheckedItems);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...editableItems];
    newItems[index] = value;
    setEditableItems(newItems);
  };

  const toggleItemChecked = (index: number) => {
    let newCheckedItems = [...editableCheckedItems];
    
    if (newCheckedItems.includes(index)) {
      // Uncheck
      newCheckedItems = newCheckedItems.filter(i => i !== index);
    } else {
      // Check
      newCheckedItems.push(index);
    }
    
    setEditableCheckedItems(newCheckedItems);
  };

  const moveItemUp = (index: number) => {
    if (index === 0) return;
    
    // Move item up
    const newItems = [...editableItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setEditableItems(newItems);
    
    // Adjust checked items
    const newCheckedItems = editableCheckedItems.map(itemIndex => {
      if (itemIndex === index) return index - 1;
      if (itemIndex === index - 1) return index;
      return itemIndex;
    });
    
    setEditableCheckedItems(newCheckedItems);
  };

  const moveItemDown = (index: number) => {
    if (index === editableItems.length - 1) return;
    
    // Move item down
    const newItems = [...editableItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setEditableItems(newItems);
    
    // Adjust checked items
    const newCheckedItems = editableCheckedItems.map(itemIndex => {
      if (itemIndex === index) return index + 1;
      if (itemIndex === index + 1) return index;
      return itemIndex;
    });
    
    setEditableCheckedItems(newCheckedItems);
  };

  const handleSave = () => {
    onSave(editableItems, editableCheckedItems);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Checklist Items</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ActionButtons>
          <ActionButton onClick={addItem} variant="primary">
            + Add Item
          </ActionButton>
        </ActionButtons>

        <ItemsList>
          {editableItems.length === 0 ? (
            <NoItemsMessage>
              No items yet. Click "Add Item" to add your first item.
            </NoItemsMessage>
          ) : (
            editableItems.map((item, index) => (
              <ItemRow key={index}>
                <CheckboxContainer>
                  <input 
                    type="checkbox" 
                    checked={editableCheckedItems.includes(index)}
                    onChange={() => toggleItemChecked(index)}
                    style={{ width: '18px', height: '18px' }}
                  />
                </CheckboxContainer>
                <span style={{ marginRight: '12px', color: '#64748B', width: '30px' }}>
                  #{index + 1}
                </span>
                <ItemInput
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder="Item text"
                />
                <div style={{ display: 'flex', marginLeft: '8px' }}>
                  <RemoveButton 
                    onClick={() => moveItemUp(index)}
                    disabled={index === 0}
                    title="Move Up"
                    style={{ opacity: index === 0 ? 0.5 : 1 }}
                  >
                    ↑
                  </RemoveButton>
                  <RemoveButton 
                    onClick={() => moveItemDown(index)}
                    disabled={index === editableItems.length - 1}
                    title="Move Down"
                    style={{ opacity: index === editableItems.length - 1 ? 0.5 : 1 }}
                  >
                    ↓
                  </RemoveButton>
                  <RemoveButton 
                    onClick={() => removeItem(index)}
                    variant="danger"
                    title="Remove"
                  >
                    ×
                  </RemoveButton>
                </div>
              </ItemRow>
            ))
          )}
        </ItemsList>

        <ModalFooter>
          <ActionButton onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton onClick={handleSave} variant="primary">
            Save Items
          </ActionButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}
