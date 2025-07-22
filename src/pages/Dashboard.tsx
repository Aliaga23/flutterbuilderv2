import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { 
  getProjects, 
  createProject, 
  isAuthenticated, 
  getProfile, 
  logout,
  Project, 
  UserProfile 
} from '../services/authService';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #F8F9FA;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  background: #FFFFFF;
  border-bottom: 1px solid #E9ECEF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 22px;
  color: #1A202C;
  
  svg {
    margin-right: 12px;
    color: #0066CC;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap:16px;
`;

const UserAvatar = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1A202C;
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: #6B7280;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: #FFFFFF;
  color: #374151;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #F9FAFB;
    border-color: #9CA3AF;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const DashboardTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1A202C;
  margin-bottom: 8px;
  text-align: left;
`;

const DashboardSubtitle = styled.p`
  font-size: 16px;
  color: #6B7280;
  text-align: left;
  margin-bottom: 32px;
  font-weight: 400;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

const ProjectCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 0;
  transition: all 0.2s ease;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  
  &:hover {
    border-color: #0066CC;
    box-shadow: 0 8px 25px rgba(0, 102, 204, 0.12);
    transform: translateY(-2px);
  }
`;

const ProjectCardHeader = styled.div`
  background: linear-gradient(135deg, #0066CC 0%, #004499 100%);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
`;

const ProjectCardBody = styled.div`
  padding: 24px;
`;

const FlutterIcon = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: white;
  }
`;

const NewProjectCard = styled.div`
  background: #FAFAFA;
  border: 2px dashed #D1D5DB;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 24px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #0066CC;
    background: #F0F7FF;
    transform: translateY(-2px);
  }
`;

const ProjectName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
  flex: 1;
`;

const ProjectDate = styled.p`
  font-size: 13px;
  color: #6B7280;
  margin-bottom: 20px;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ProjectStats = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6B7280;
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &.primary {
    background: #0066CC;
    color: white;
    
    &:hover {
      background: #0052A3;
    }
  }
  
  &.secondary {
    background: #F9FAFB;
    color: #374151;
    border: 1px solid #E5E7EB;
    
    &:hover {
      background: #F3F4F6;
      border-color: #D1D5DB;
    }
  }
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, #0066CC 0%, #004499 100%);
  color: white;
  border: none;
  border-radius: 12px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4);
  }
`;

const CreateText = styled.p`
  font-size: 16px;
  color: #374151;
  text-align: center;
  margin: 0;
  font-weight: 600;
`;

const CreateSubtext = styled.p`
  font-size: 13px;
  color: #6B7280;
  text-align: center;
  margin: 8px 0 0 0;
  font-weight: 400;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #6B7280;
  font-size: 16px;
`;

const ErrorContainer = styled.div`
  background: #FEF2F2;
  color: #DC2626;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;
  border: 1px solid #FECACA;
`;

// Modal styles
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
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1A202C;
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 16px;
  margin-bottom: 16px;
  box-sizing: border-box;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #0066CC;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [creating, setCreating] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }

    loadProjects();
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const profile = await getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const userProjects = await getProjects();
      setProjects(userProjects);
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setError('El nombre del proyecto es requerido');
      return;
    }

    try {
      setCreating(true);
      setError('');
      
      const newProject = await createProject({
        name: newProjectName.trim(),
        data: {} // Empty project data
      });

      setProjects([...projects, newProject]);
      setShowCreateModal(false);
      setNewProjectName('');
      
      // Navigate to the new project
      navigate(`/diagramador/${newProject.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear el proyecto');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/diagramador/${projectId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DashboardContainer>
      <Header>
        <Logo>
          <LucideIcons.Layers size={24} />
          Flutter Builder
        </Logo>
        {userProfile && (
          <UserSection>
            <UserAvatar color={userProfile.color}>
              {userProfile.username.substring(0, 2).toUpperCase()}
            </UserAvatar>
            <UserInfo>
              <UserName>{userProfile.username}</UserName>
              <UserEmail>{userProfile.email}</UserEmail>
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              Cerrar Sesión
            </LogoutButton>
          </UserSection>
        )}
      </Header>

      <MainContent>
        <DashboardTitle>
          Proyectos
        </DashboardTitle>
        <DashboardSubtitle>
          Administra y organiza tus proyectos de aplicaciones Flutter
        </DashboardSubtitle>

        {error && <ErrorContainer>{error}</ErrorContainer>}

        {loading ? (
          <LoadingContainer>
            <LucideIcons.Loader2 size={24} style={{ marginRight: '8px' }} />
            Cargando proyectos...
          </LoadingContainer>
        ) : (
          <ProjectsGrid>
            <NewProjectCard onClick={() => setShowCreateModal(true)}>
              <CreateButton>
                <LucideIcons.Smartphone size={24} />
              </CreateButton>
              <CreateText>Nuevo Proyecto Flutter</CreateText>
              <CreateSubtext>Crea una aplicación móvil desde cero</CreateSubtext>
            </NewProjectCard>

            {projects.map((project) => (
              <ProjectCard key={project.id}>
                <ProjectCardHeader>
                  <FlutterIcon>
                    <LucideIcons.Smartphone size={20} />
                  </FlutterIcon>
                  <ProjectName>{project.name}</ProjectName>
                </ProjectCardHeader>
                <ProjectCardBody>
                  <ProjectDate>
                    <LucideIcons.Calendar size={14} />
                    {formatDate(project.created_at)}
                  </ProjectDate>
                  <ProjectStats>
                    <StatItem>
                      <LucideIcons.Layers size={14} />
                      Widgets: 0
                    </StatItem>
                    <StatItem>
                      <LucideIcons.Monitor size={14} />
                      Páginas: 1
                    </StatItem>
                  </ProjectStats>
                  <ProjectActions>
                    <ActionButton 
                      className="primary" 
                      onClick={() => handleOpenProject(project.id)}
                    >
                      <LucideIcons.Edit size={16} />
                      Abrir
                    </ActionButton>
                    <ActionButton className="secondary">
                      <LucideIcons.MoreHorizontal size={16} />
                    </ActionButton>
                  </ProjectActions>
                </ProjectCardBody>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        )}
      </MainContent>

      {/* Create Project Modal */}
      {showCreateModal && (
        <ModalOverlay onClick={() => setShowCreateModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Nuevo Proyecto</ModalTitle>
            <Input
              type="text"
              placeholder="Ingrese el nombre del proyecto"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              autoFocus
            />
            <ModalActions>
              <ActionButton 
                className="secondary" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </ActionButton>
              <ActionButton 
                className="primary" 
                onClick={handleCreateProject}
                disabled={creating}
              >
                {creating ? 'Creando...' : 'Crear'}
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
