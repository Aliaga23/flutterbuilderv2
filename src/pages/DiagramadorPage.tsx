import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { Layers, Upload, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { AppProvider, useApp } from '../context/AppContext';
import { WidgetLibrary } from '../components/WidgetLibrary';
import { Canvas } from '../components/Canvas';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { DeviceSelector } from '../components/DeviceSelector';
import { PageManager } from '../components/PageManager';
import { JsonViewer } from '../components/JsonViewer';
import { JsonImporter } from '../components/JsonImporter';
import { AIGenerator } from '../components/AIGenerator';
import { getProject, updateProject, isAuthenticated } from '../services/authService';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #F8FAFC;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  color: #0F172A;
  font-feature-settings: 'cv11', 'ss01';
  
  * {
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #F8FAFC;

  @media (max-width: 768px) {
    flex: 1;
    overflow: hidden;
  }
`;

const TopBar = styled.div`
  display: flex;
  background: #FFFFFF;
  border-bottom: 1px solid #E1E5E9;
  backdrop-filter: blur(20px);
  z-index: 10;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Header = styled.div`
  padding: 24px 40px;
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 20px 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    min-height: 70px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ImportButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  letter-spacing: 0.025em;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.24);
    transform: translateY(-1px);
    box-shadow: 
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
  }
`;

const SaveButton = styled(ImportButton)`
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.3);
  
  &:hover:not(:disabled) {
    background: rgba(34, 197, 94, 0.3);
    border-color: rgba(34, 197, 94, 0.4);
  }
`;

const BackButton = styled(ImportButton)`
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
  
  &:hover {
    background: rgba(239, 68, 68, 0.3);
    border-color: rgba(239, 68, 68, 0.4);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
  color: white;
  font-size: 18px;
  gap: 12px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
  color: white;
  text-align: center;
  padding: 24px;
`;

const ErrorMessage = styled.div`
  font-size: 18px;
  margin-bottom: 24px;
  max-width: 500px;
`;

const AppTitle = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.025em;
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const AppSubtitle = styled.div`
  font-size: 14px;
  opacity: 0.75;
  font-weight: 400;
  margin-top: 4px;
  letter-spacing: 0.025em;
  color: #CBD5E1;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const AppIcon = styled.div`
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
  padding: 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  svg {
    color: white;
  }
`;

export function DiagramadorPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppProvider>
        <DiagramadorContent />
      </AppProvider>
    </DndProvider>
  );
}

function DiagramadorContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { generateJSON, loadFromJSON } = useApp();
  const [showImporter, setShowImporter] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Use ref to avoid adding loadFromJSON to dependencies
  const loadFromJSONRef = useRef(loadFromJSON);
  loadFromJSONRef.current = loadFromJSON;

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }

    if (!id) {
      setError('ID del proyecto no proporcionado');
      setLoading(false);
      return;
    }

    // Define loadProject inside useEffect to avoid dependency issues
    const loadProject = async () => {
      try {
        setLoading(true);
        const projectData = await getProject(id);
        setProject(projectData);
        
        // Load the project data into the context
        if (projectData.data && Object.keys(projectData.data).length > 0) {
          loadFromJSONRef.current(projectData.data);
        }
        
        setError('');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error al cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, navigate]);

 

  const handleSaveProject = async () => {
    if (!project) return;

    try {
      setSaving(true);
      
      // Get current widget data from the context
      const currentProjectData = JSON.parse(generateJSON());
      
      await updateProject(project.id, {
        name: project.name,
        data: currentProjectData
      });
      
      setError('');
      // Show success message or notification
      console.log('Proyecto guardado exitosamente');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al guardar el proyecto');
    } finally {
      setSaving(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Loader2 size={24} />
        Cargando proyecto...
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <BackButton onClick={handleBackToDashboard}>
          <ArrowLeft size={18} />
          Volver al Dashboard
        </BackButton>
      </ErrorContainer>
    );
  }

  if (!project) {
    return (
      <ErrorContainer>
        <ErrorMessage>Proyecto no encontrado</ErrorMessage>
        <BackButton onClick={handleBackToDashboard}>
          <ArrowLeft size={18} />
          Volver al Dashboard
        </BackButton>
      </ErrorContainer>
    );
  }

  return (
    <AppContainer>
      <WidgetLibrary />
      
      <MainContent>
        <Header>
          <HeaderLeft>
            <AppIcon><Layers size={32} /></AppIcon>
            <div>
              <AppTitle>{project.name}</AppTitle>
              <AppSubtitle>Proyecto Flutter - Última modificación: {new Date(project.updated_at).toLocaleDateString('es-ES')}</AppSubtitle>
            </div>
          </HeaderLeft>
          
          <HeaderRight>
            <BackButton onClick={handleBackToDashboard}>
              <ArrowLeft size={18} />
              Dashboard
            </BackButton>
            <SaveButton onClick={handleSaveProject} disabled={saving}>
              {saving ? <Loader2 size={18} /> : <Save size={18} />}
              {saving ? 'Guardando...' : 'Guardar'}
            </SaveButton>
            <ImportButton onClick={() => setShowImporter(true)}>
              <Upload size={18} />
              Import Project
            </ImportButton>
            <AIGenerator />
          </HeaderRight>
        </Header>
        
        <TopBar>
          <PageManager />
        </TopBar>
        
        <DeviceSelector />
        
        <Canvas />
        
        <JsonViewer />
      </MainContent>
      
      <PropertiesPanel />
      
      <JsonImporter 
        isOpen={showImporter} 
        onClose={() => setShowImporter(false)} 
      />
    </AppContainer>
  );
}
