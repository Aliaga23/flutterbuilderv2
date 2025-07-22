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
  max-width: 800px;
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

const TableContainer = styled.div`
  border: 1px solid #E1E5E9;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #F8FAFC;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #F9FAFB;
  }
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #E1E5E9;
  border-right: 1px solid #E1E5E9;
  
  &:last-child {
    border-right: none;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #E1E5E9;
  border-right: 1px solid #E1E5E9;
  
  &:last-child {
    border-right: none;
  }
`;

const CellInput = styled.input`
  width: 100%;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  padding: 6px 8px;
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

const ActionButton = styled.button`
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
  
  &:hover {
    background: #F9FAFB;
    border-color: #9CA3AF;
  }
  
  &.primary {
    background: #3B82F6;
    color: white;
    border-color: #3B82F6;
    
    &:hover {
      background: #2563EB;
    }
  }
  
  &.danger {
    background: #EF4444;
    color: white;
    border-color: #EF4444;
    
    &:hover {
      background: #DC2626;
    }
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #E1E5E9;
`;

interface TableEditorProps {
  isOpen: boolean;
  onClose: () => void;
  columns: string[];
  rows: string[][];
  onSave: (columns: string[], rows: string[][]) => void;
}

export function TableEditor({ isOpen, onClose, columns, rows, onSave }: TableEditorProps) {
  const [editableColumns, setEditableColumns] = useState<string[]>([]);
  const [editableRows, setEditableRows] = useState<string[][]>([]);

  useEffect(() => {
    if (isOpen) {
      setEditableColumns([...columns]);
      setEditableRows(rows.map(row => [...row]));
    }
  }, [isOpen, columns, rows]);

  const addColumn = () => {
    setEditableColumns([...editableColumns, `Column ${editableColumns.length + 1}`]);
    setEditableRows(editableRows.map(row => [...row, '']));
  };

  const removeColumn = (index: number) => {
    if (editableColumns.length <= 1) return;
    setEditableColumns(editableColumns.filter((_, i) => i !== index));
    setEditableRows(editableRows.map(row => row.filter((_, i) => i !== index)));
  };

  const addRow = () => {
    setEditableRows([...editableRows, new Array(editableColumns.length).fill('')]);
  };

  const removeRow = (index: number) => {
    if (editableRows.length <= 1) return;
    setEditableRows(editableRows.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, value: string) => {
    const newColumns = [...editableColumns];
    newColumns[index] = value;
    setEditableColumns(newColumns);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...editableRows];
    newRows[rowIndex][colIndex] = value;
    setEditableRows(newRows);
  };

  const handleSave = () => {
    onSave(editableColumns, editableRows);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Table Editor</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ActionButtons>
          <ActionButton onClick={addColumn} className="primary">
            + Add Column
          </ActionButton>
          <ActionButton onClick={addRow} className="primary">
            + Add Row
          </ActionButton>
        </ActionButtons>

        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                {editableColumns.map((column, index) => (
                  <TableHeaderCell key={index}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CellInput
                        value={column}
                        onChange={(e) => updateColumn(index, e.target.value)}
                        placeholder="Column name"
                      />
                      {editableColumns.length > 1 && (
                        <ActionButton 
                          onClick={() => removeColumn(index)}
                          style={{ padding: '4px 6px', fontSize: '12px' }}
                          className="danger"
                        >
                          ×
                        </ActionButton>
                      )}
                    </div>
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {editableRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <TableCell key={colIndex}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CellInput
                          value={cell}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          placeholder="Cell content"
                        />
                        {colIndex === 0 && editableRows.length > 1 && (
                          <ActionButton 
                            onClick={() => removeRow(rowIndex)}
                            style={{ padding: '4px 6px', fontSize: '12px' }}
                            className="danger"
                          >
                            ×
                          </ActionButton>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <ModalFooter>
          <ActionButton onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton onClick={handleSave} className="primary">
            Save Table
          </ActionButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}
