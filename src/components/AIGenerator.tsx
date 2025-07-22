import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Sparkles, Image, Mic, MicOff, Upload, X, Send } from 'lucide-react';
import { generateJSONFromImage, generateJSONFromPrompt, generateJSONFromAudio } from '../services/authService';
import { useApp } from '../context/AppContext';

const AIButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 12px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
  }
`;

const AIModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
`;

const AIModalContent = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);

  @media (max-width: 768px) {
    width: 95vw;
    max-height: 90vh;
  }
`;

const AIModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  color: white;
  border-radius: 12px 12px 0 0;
`;

const AIModalTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const AIModalBody = styled.div`
  padding: 24px;
`;

const InputSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TextAreaInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #8B5CF6;
  }

  &::placeholder {
    color: #9CA3AF;
  }
`;

const FileInputWrapper = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 2px dashed #D1D5DB;
  border-radius: 8px;
  background: #F9FAFB;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    border-color: #8B5CF6;
    background: #F3F4F6;
    color: #8B5CF6;
  }
`;

const RecordButton = styled.button<{ isRecording: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid ${props => props.isRecording ? '#EF4444' : '#D1D5DB'};
  border-radius: 8px;
  background: ${props => props.isRecording ? '#FEE2E2' : '#F9FAFB'};
  color: ${props => props.isRecording ? '#EF4444' : '#6B7280'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  width: 100%;

  &:hover {
    border-color: ${props => props.isRecording ? '#DC2626' : '#8B5CF6'};
    background: ${props => props.isRecording ? '#FECACA' : '#F3F4F6'};
    color: ${props => props.isRecording ? '#DC2626' : '#8B5CF6'};
  }
`;

const PreviewArea = styled.div`
  margin-top: 15px;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 150px;
  border-radius: 6px;
  object-fit: cover;
`;

const AudioPreview = styled.audio`
  width: 100%;
  margin-top: 8px;
`;

const FileInfo = styled.div`
  font-size: 12px;
  color: #6B7280;
  margin-top: 8px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #EF4444;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  &:hover {
    background: #DC2626;
  }
`;

const GenerateButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const StatusMessage = styled.div<{ type: 'success' | 'error' | 'loading' }>`
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 15px;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return 'background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0;';
      case 'error':
        return 'background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA;';
      case 'loading':
        return 'background: #DBEAFE; color: #1E40AF; border: 1px solid #BFDBFE;';
      default:
        return '';
    }
  }}
`;

export function AIGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'loading'; text: string } | null>(null);
  
  const { loadFromJSON } = useApp(); // Get loadFromJSON from context
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Error accessing microphone' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeAudio = () => {
    setAudioBlob(null);
  };

  const generateWithAI = async () => {
    if (!prompt.trim() && !image && !audioBlob) {
      setStatusMessage({ type: 'error', text: 'Please provide at least one input (text, image, or audio)' });
      return;
    }

    setIsGenerating(true);
    setStatusMessage({ type: 'loading', text: 'Generating UI with AI...' });

    try {
      let generatedJSON = null;

      // If there's an image, use the image-to-JSON API
      if (image) {
        setStatusMessage({ type: 'loading', text: 'Analyzing image and generating UI...' });
        generatedJSON = await generateJSONFromImage(image);
      } 
      // If there's a text prompt, use the prompt-to-JSON API
      else if (prompt.trim()) {
        setStatusMessage({ type: 'loading', text: 'Generating UI from description...' });
        generatedJSON = await generateJSONFromPrompt(prompt.trim());
      }
      // If there's audio, use the audio-to-JSON API
      else if (audioBlob) {
        setStatusMessage({ type: 'loading', text: 'Analyzing audio and generating UI...' });
        
        // Convert blob to file for the API
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        generatedJSON = await generateJSONFromAudio(audioFile);
      }

      // Load the generated JSON into the app context
      if (generatedJSON) {
        loadFromJSON(generatedJSON);
        setStatusMessage({ type: 'success', text: 'UI generated successfully! Check the canvas.' });
        
        // Clear inputs after successful generation
        setPrompt('');
        setImage(null);
        setAudioBlob(null);
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
        
        // Close modal after a short delay
        setTimeout(() => {
          setIsOpen(false);
          setStatusMessage(null);
        }, 2000);
      }

    } catch (error) {
      console.error('Error generating UI:', error);
      setStatusMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to generate UI. Please try again.' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <AIButton onClick={() => setIsOpen(true)}>
        <Sparkles size={18} />
        AI Generator
      </AIButton>

      <AIModal isOpen={isOpen} onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
        <AIModalContent>
          <AIModalHeader>
            <AIModalTitle>
              <Sparkles size={20} />
              AI Generator
            </AIModalTitle>
            <CloseButton onClick={() => setIsOpen(false)}>
              <X size={20} />
            </CloseButton>
          </AIModalHeader>
          
          <AIModalBody>
            <InputSection>
              <SectionTitle>
                <Sparkles size={16} />
                Describe your UI
              </SectionTitle>
              <TextAreaInput
                placeholder="Describe the UI you want to create... e.g., 'Create a login screen with email and password fields, and a blue login button'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </InputSection>

            <InputSection>
              <SectionTitle>
                <Image size={16} />
                Upload Reference Image
              </SectionTitle>
              <FileInputWrapper>
                <FileInput
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="image-upload-modal"
                />
                <FileButton htmlFor="image-upload-modal">
                  <Upload size={16} />
                  Choose Image
                </FileButton>
                {image && (
                  <PreviewArea style={{ position: 'relative' }}>
                    <RemoveButton onClick={removeImage}>
                      <X size={12} />
                    </RemoveButton>
                    <ImagePreview src={URL.createObjectURL(image)} alt="Preview" />
                    <FileInfo>{image.name} ({(image.size / 1024).toFixed(1)} KB)</FileInfo>
                  </PreviewArea>
                )}
              </FileInputWrapper>
            </InputSection>

            <InputSection>
              <SectionTitle>
                <Mic size={16} />
                Voice Description
              </SectionTitle>
              <RecordButton
                isRecording={isRecording}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </RecordButton>
              {audioBlob && (
                <PreviewArea style={{ position: 'relative' }}>
                  <RemoveButton onClick={removeAudio}>
                    <X size={12} />
                  </RemoveButton>
                  <AudioPreview controls>
                    <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
                  </AudioPreview>
                  <FileInfo>Audio recording ({(audioBlob.size / 1024).toFixed(1)} KB)</FileInfo>
                </PreviewArea>
              )}
            </InputSection>

            <GenerateButton
              onClick={generateWithAI}
              disabled={isGenerating || (!prompt.trim() && !image && !audioBlob)}
            >
              <Send size={16} />
              {isGenerating ? 'Generating...' : 'Generate UI'}
            </GenerateButton>

            {statusMessage && (
              <StatusMessage type={statusMessage.type}>
                {statusMessage.text}
              </StatusMessage>
            )}
          </AIModalBody>
        </AIModalContent>
      </AIModal>
    </>
  );
}
