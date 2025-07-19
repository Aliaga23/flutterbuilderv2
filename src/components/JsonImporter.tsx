import React, { useState } from 'react';
import styled from 'styled-components';
import { Upload, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ImporterContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ImporterModal = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }
`;

const FileUploadArea = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? '#2196f3' : '#ddd'};
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  background: ${props => props.isDragOver ? '#f0f8ff' : '#fafafa'};
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2196f3;
    background: #f0f8ff;
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: #666;
  margin-bottom: 16px;
`;

const UploadText = styled.div`
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
`;

const UploadSubtext = styled.div`
  font-size: 14px;
  color: #666;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.2s ease;

  ${props => props.variant === 'primary' ? `
    background: #2196f3;
    color: white;
    border-color: #2196f3;

    &:hover {
      background: #1976d2;
      border-color: #1976d2;
    }

    &:disabled {
      background: #ccc;
      border-color: #ccc;
      cursor: not-allowed;
    }
  ` : `
    background: white;
    color: #666;
    border-color: #ddd;

    &:hover {
      background: #f5f5f5;
    }
  `}
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
`;

interface JsonImporterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JsonImporter({ isOpen, onClose }: JsonImporterProps) {
  const { dispatch } = useApp();
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonText(content);
      setError('');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file => 
      file.type === 'application/json' || file.name.endsWith('.json')
    );
    
    if (jsonFile) {
      handleFileUpload(jsonFile);
    } else {
      setError('Please upload a valid JSON file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const validateAndImport = () => {
    try {
      const projectData = JSON.parse(jsonText);
      
      // Basic validation
      if (!projectData.pages || !Array.isArray(projectData.pages)) {
        throw new Error('Invalid project format: pages array is required');
      }

      // Import the project
      dispatch({
        type: 'UPDATE_PROJECT',
        payload: projectData
      });

      onClose();
      setJsonText('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <ImporterContainer>
      <ImporterModal>
        <ModalHeader>
          <ModalTitle>Import Project</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <FileUploadArea
          isDragOver={isDragOver}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('json-file-input')?.click()}
        >
          <UploadIcon><Upload size={48} /></UploadIcon>
          <UploadText>Drop JSON file here or click to browse</UploadText>
          <UploadSubtext>Supports .json files</UploadSubtext>
        </FileUploadArea>

        <input
          id="json-file-input"
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />

        <TextArea
          placeholder="Or paste your JSON content here..."
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setError('');
          }}
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={validateAndImport}
            disabled={!jsonText.trim()}
          >
            Import Project
          </Button>
        </ButtonGroup>
      </ImporterModal>
    </ImporterContainer>
  );
}
