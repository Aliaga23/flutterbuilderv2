import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { CollaborationSidebar } from '../components/CollaborationSidebar';
import { UserCursors } from '../components/UserCursors';
import { getProject, updateProject, isAuthenticated, getProfile } from '../services/authService';
import { useCollaboration } from '../hooks/useCollaboration';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #F8FAFC;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  color: #0F172A;
  font-feature-settings: 'cv11', 'ss01';
  position: relative;
  
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
  const [, setUserProfile] = useState<any>(null);
  const [collaborationSidebarOpen, setCollaborationSidebarOpen] = useState(false);
  const [grantingAccess, setGrantingAccess] = useState(false);
  const [autoSaveEnabled] = useState(true);
  const [, setLastAutoSave] = useState<Date | null>(null);
  
  // Collaboration hook
  const {
    isConnected,
    connectedUsers,
    userCursors,
    enableCollaboration,
    sendCursorMove
    
  } = useCollaboration(id);
  
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

    // Load user profile and project
    const loadData = async () => {
      let profile = null;
      try {
        setLoading(true);
        
        console.log('Loading data for project:', id);
        
        // Load user profile
        profile = await getProfile();
        console.log('User profile loaded:', profile);
        setUserProfile(profile);
        
        // Load project
        console.log('Attempting to load project...');
        const projectData = await getProject(id);
        console.log('Project data loaded:', projectData);
        setProject(projectData);
        
        // Load the project data into the context
        if (projectData.data && Object.keys(projectData.data).length > 0) {
          loadFromJSONRef.current(projectData.data);
        }
        
        // Automatically enable collaboration after successful project load
        const token = localStorage.getItem('access_token');
        if (token && profile) {
          console.log('Enabling collaboration automatically...');
          await enableCollaboration(profile.id, token, profile);
        }
        
        setError('');
      } catch (error) {
        console.error('Error loading project data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar el proyecto';
        
        // If it's a 403 or "Not authorized" error, try to grant access by connecting to WebSocket first
        if (errorMessage.includes('403') || errorMessage.includes('Not authorized') || errorMessage.includes('Forbidden')) {
          console.log('Access denied, attempting to grant access via collaboration...');
          setGrantingAccess(true);
          
          // Try to grant access by connecting to the collaboration WebSocket
          try {
            const token = localStorage.getItem('access_token');
            if (token && profile) {
              // Connect to WebSocket to trigger access granting
              await enableCollaboration(profile.id, token, profile);
              
              // Wait a moment for the backend to process the access grant
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Try to load the project again
              console.log('Retrying project load after access grant...');
              const projectData = await getProject(id);
              console.log('Project loaded successfully after retry:', projectData);
              setProject(projectData);
              
              // Load the project data into the context
              if (projectData.data && Object.keys(projectData.data).length > 0) {
                loadFromJSONRef.current(projectData.data);
              }
              
              setError('');
            } else {
              setError('Acceso denegado. Necesitas estar autenticado para acceder a este proyecto colaborativo.');
            }
          } catch (retryError) {
            console.error('Failed to grant access via collaboration:', retryError);
            setError('No tienes acceso a este proyecto. Si recibiste una invitación, contacta al propietario del proyecto.');
          } finally {
            setGrantingAccess(false);
          }
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate, enableCollaboration]);

  // Auto-save function (silent save without UI feedback)
  const autoSaveProject = useCallback(async () => {
    if (!project || !autoSaveEnabled || saving) return;

    try {
      // Get current widget data from the context
      const currentProjectData = JSON.parse(generateJSON());
      
      await updateProject(project.id, {
        name: project.name,
        data: currentProjectData
      });
      
      setLastAutoSave(new Date());
      console.log('Auto-guardado exitoso:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error en auto-guardado:', error);
      // Don't show error to user for auto-save failures
    }
  }, [project, autoSaveEnabled, saving, generateJSON]);

  // Auto-save every 6 seconds
  useEffect(() => {
    if (!project || !autoSaveEnabled) return;

    const autoSaveInterval = setInterval(() => {
      autoSaveProject();
    }, 6000); // 6 segundos

    return () => clearInterval(autoSaveInterval);
  }, [project, autoSaveEnabled, autoSaveProject]);

  // Handle mouse movement for collaboration
  const handleMouseMove = (event: React.MouseEvent) => {
    if (isConnected) {
      sendCursorMove({ x: event.clientX, y: event.clientY });
    }
  };

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
        {grantingAccess ? 'Obteniendo acceso al proyecto...' : 'Cargando proyecto...'}
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
    <AppContainer onMouseMove={handleMouseMove}>
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
        
        <Canvas sendCursorMove={sendCursorMove} />
        
        <JsonViewer />
      </MainContent>
      
      <PropertiesPanel />
      
      {/* Collaboration Components */}
      <CollaborationSidebar
        isOpen={collaborationSidebarOpen}
        onToggle={() => setCollaborationSidebarOpen(!collaborationSidebarOpen)}
        isConnected={isConnected}
        connectedUsers={connectedUsers}
        projectId={id || ''}
      />
      
      <UserCursors cursors={userCursors} />
      
      <JsonImporter 
        isOpen={showImporter} 
        onClose={() => setShowImporter(false)} 
      />
    </AppContainer>
  );
}
