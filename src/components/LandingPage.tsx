import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import AuthForm from './AuthForm';
import UserProfile from './UserProfile';
import { isAuthenticated } from '../services/authService';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 20px;
  color: #2D3748;
  
  svg {
    margin-right: 12px;
    color: #2196F3;
  }
`;

const AuthButton = styled.button`
  padding: 10px 20px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #1E88E5;
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 16px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  max-width: 1000px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  padding: 0 20px;
  margin-right: 40px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 30px;
    text-align: center;
  }
`;

const RightSection = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: #2D3748;
  margin-bottom: 16px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #4A5568;
  margin-bottom: 24px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 0 32px 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  color: #4A5568;

  svg {
    margin-right: 12px;
    color: #2196F3;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Footer = styled.footer`
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  text-align: center;
  font-size: 14px;
  color: #718096;
`;

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    setUserAuthenticated(isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setUserAuthenticated(true);
    setShowAuthForm(false);
    navigate('/');
  };

  const handleLogout = () => {
    setUserAuthenticated(false);
    setShowAuthForm(false);
  };

  const handleAuthClick = () => {
    if (userAuthenticated) {
      navigate('/');
    } else {
      setShowAuthForm(!showAuthForm);
    }
  };

  return (
    <PageContainer>
      <Header>
        <Logo>
          <LucideIcons.Layers size={24} />
          Flutter Builder
        </Logo>
        {userAuthenticated ? (
          <UserProfile onLogout={handleLogout} />
        ) : (
          <AuthButton onClick={handleAuthClick}>
            Iniciar Sesión
          </AuthButton>
        )}
      </Header>

      <MainContent>
        <ContentContainer>
          <LeftSection>
            <Title>Crea interfaces de Flutter sin escribir código</Title>
            <Subtitle>
              Arrastra y suelta componentes para diseñar tu aplicación Flutter de manera rápida e intuitiva.
            </Subtitle>
            
            <FeatureList>
              <FeatureItem>
                <LucideIcons.MousePointerClick size={20} />
                Interfaz de arrastrar y soltar
              </FeatureItem>
              <FeatureItem>
                <LucideIcons.FileCode size={20} />
                Exportación de código Flutter listo para usar
              </FeatureItem>
              <FeatureItem>
                <LucideIcons.Smartphone size={20} />
                Vista previa para múltiples dispositivos
              </FeatureItem>
              <FeatureItem>
                <LucideIcons.Palette size={20} />
                Personalización avanzada de widgets
              </FeatureItem>
            </FeatureList>
          </LeftSection>
          
          <RightSection>
            {!userAuthenticated && showAuthForm && (
              <AuthForm onAuthSuccess={handleLoginSuccess} />
            )}
            {!userAuthenticated && !showAuthForm && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '400px',
                color: '#718096',
                textAlign: 'center'
              }}>
                <LucideIcons.Layers size={64} style={{ marginBottom: '16px', color: '#2196F3' }} />
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#2D3748' }}>
                  ¡Comienza a crear!
                </h3>
                <p style={{ fontSize: '14px', maxWidth: '300px' }}>
                  Inicia sesión para acceder al diagramador y comenzar a construir tu aplicación Flutter.
                </p>
              </div>
            )}
            {userAuthenticated && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '400px',
                color: '#718096',
                textAlign: 'center'
              }}>
                <LucideIcons.CheckCircle size={64} style={{ marginBottom: '16px', color: '#48BB78' }} />
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#2D3748' }}>
                  ¡Listo para crear!
                </h3>
                <p style={{ fontSize: '14px', maxWidth: '300px', marginBottom: '20px' }}>
                  Ya estás autenticado. Haz clic en el botón de arriba para ir al diagramador.
                </p>
                <AuthButton onClick={() => navigate('/')}>
                  Ir al Diagramador
                </AuthButton>
              </div>
            )}
          </RightSection>
        </ContentContainer>
      </MainContent>

      <Footer>
        © {new Date().getFullYear()} Flutter Builder. Todos los derechos reservados.
      </Footer>
    </PageContainer>
  );
};

export default LandingPage;
