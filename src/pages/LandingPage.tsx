import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Layers, 
  Code, 
  Smartphone, 
  Zap, 
  Users, 
  Shield, 
  ArrowRight,
  Star,
  Github,
  Play,
  Menu,
  X
} from 'lucide-react';
import { AuthForm } from '../components/AuthForm';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  position: relative;
  width: 100%;
`;

const Header = styled.header`
  padding: 20px 0;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 24px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 20px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const LogoIcon = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  gap: 32px;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: rgba(30, 41, 59, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 1000;
  }
`;

const NavLink = styled.a`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;



const LoginButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const HeroSection = styled.section`
  padding: 140px 20px 60px;
  text-align: center;
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 120px 20px 40px;
    min-height: auto;
  }

  @media (max-width: 480px) {
    padding: 100px 15px 30px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }

  @media (max-width: 480px) {
    padding: 0 10px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.1;
  color: white;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 16px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 48px;
  opacity: 0.9;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 32px;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const PrimaryButton = styled(Link)`
  background: #3b82f6;
  color: white;
  padding: 16px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: #2563eb;
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

const SecondaryButton = styled.a`
  background: transparent;
  color: white;
  padding: 16px 32px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const FeaturesSection = styled.section`
  padding: 100px 20px;
  background: #f8fafc;

  @media (max-width: 768px) {
    padding: 80px 20px;
  }

  @media (max-width: 480px) {
    padding: 60px 15px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 64px;
  color: #1a202c;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 48px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 48px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 32px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const FeatureCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #e2e8f0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    padding: 32px;
  }

  @media (max-width: 480px) {
    padding: 24px;
  }
`;

const FeatureIcon = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  width: fit-content;
  margin-bottom: 24px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1a202c;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
  font-size: 1rem;
`;

const StatsSection = styled.section`
  padding: 100px 20px;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  color: white;

  @media (max-width: 768px) {
    padding: 80px 20px;
  }

  @media (max-width: 480px) {
    padding: 60px 15px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 48px;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 32px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 24px;
  }
`;

const StatCard = styled.div`
  padding: 32px;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const Footer = styled.footer`
  padding: 60px 20px 40px;
  background: #1e293b;
  color: white;
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 20px 30px;
  }

  @media (max-width: 480px) {
    padding: 30px 15px 20px;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterText = styled.p`
  opacity: 0.7;
  margin-bottom: 32px;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
`;

const SocialLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const LoginDropdown = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 0;
  min-width: 420px;
  max-width: 90vw;
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 50%;
    left: 50%;
    right: auto;
    transform: translate(-50%, -50%);
    min-width: 90vw;
    max-width: 400px;
    max-height: 90vh;
    overflow-y: auto;
    
    &::before {
      display: none;
    }
  }

  @media (max-width: 480px) {
    min-width: 95vw;
    max-width: 95vw;
    margin: 0 2.5vw;
  }
`;

const DropdownOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

export function LandingPage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsMobileMenuOpen(false);
    navigate('/dashboard');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setShowLoginModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Cerrar menú móvil al hacer scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);
  
  return (
    <LandingContainer>
      <Header>
        <Nav>
          <Logo>
            <LogoIcon>
              <Layers size={28} />
            </LogoIcon>
            Flutter Designer Studio
          </Logo>
          
          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
          
          <NavLinks isOpen={isMobileMenuOpen}>
            <NavLink href="#features" onClick={closeMobileMenu}>
              Características
            </NavLink>
            <NavLink href="#demo" onClick={closeMobileMenu}>
              Demo
            </NavLink>
            <NavLink href="#pricing" onClick={closeMobileMenu}>
              Precios
            </NavLink>
            <NavLink href="#contact" onClick={closeMobileMenu}>
              Contacto
            </NavLink>
            <LoginButton onClick={handleLoginClick}>
              Iniciar Sesión <ArrowRight size={16} />
            </LoginButton>
            
            {showLoginModal && (
              <>
                <DropdownOverlay onClick={() => setShowLoginModal(false)} />
                <LoginDropdown>
                  <AuthForm onAuthSuccess={handleLoginSuccess} />
                </LoginDropdown>
              </>
            )}
          </NavLinks>
        </Nav>
      </Header>

      <HeroSection>
        <Container>
          <HeroTitle>
            Diseña Apps Flutter
            <br />
            Visualmente
          </HeroTitle>
          <HeroSubtitle>
            La plataforma más avanzada para crear interfaces de usuario Flutter 
            de manera visual, rápida y profesional. Sin código, máxima flexibilidad.
          </HeroSubtitle>
          <HeroButtons>
            <PrimaryButton to="/diagramador">
              <Play size={20} />
              Probar Gratis
            </PrimaryButton>
            <SecondaryButton href="#demo">
              <Github size={20} />
              Ver Demo
            </SecondaryButton>
          </HeroButtons>
        </Container>
      </HeroSection>

      <FeaturesSection id="features">
        <Container>
          <SectionTitle>Características Principales</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <Code size={32} />
              </FeatureIcon>
              <FeatureTitle>Generación de Código</FeatureTitle>
              <FeatureDescription>
                Genera código Flutter limpio y optimizado automáticamente. 
                Exporta proyectos listos para producción con mejores prácticas.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Smartphone size={32} />
              </FeatureIcon>
              <FeatureTitle>Diseño Responsivo</FeatureTitle>
              <FeatureDescription>
                Crea interfaces que se adaptan perfectamente a cualquier dispositivo. 
                Preview en tiempo real para móviles, tablets y desktop.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Zap size={32} />
              </FeatureIcon>
              <FeatureTitle>Desarrollo Rápido</FeatureTitle>
              <FeatureDescription>
                Reduce el tiempo de desarrollo hasta en un 80%. 
                Prototipa y construye aplicaciones completas en minutos.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Users size={32} />
              </FeatureIcon>
              <FeatureTitle>Colaboración en Equipo</FeatureTitle>
              <FeatureDescription>
                Trabaja en equipo de manera sincronizada. 
                Comparte proyectos y colabora en tiempo real con tu equipo.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Shield size={32} />
              </FeatureIcon>
              <FeatureTitle>Calidad Enterprise</FeatureTitle>
              <FeatureDescription>
                Código seguro y escalable siguiendo las mejores prácticas de Flutter. 
                Ideal para proyectos empresariales de gran escala.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Star size={32} />
              </FeatureIcon>
              <FeatureTitle>Componentes Premium</FeatureTitle>
              <FeatureDescription>
                Librería extensa de componentes prediseñados y personalizables. 
                Desde widgets básicos hasta componentes complejos.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      <StatsSection>
        <Container>
          <SectionTitle style={{ color: 'white', marginBottom: '80px' }}>
            Números que Hablan
          </SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>50K+</StatNumber>
              <StatLabel>Desarrolladores Activos</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>80%</StatNumber>
              <StatLabel>Reducción en Tiempo</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>500+</StatNumber>
              <StatLabel>Empresas Confían</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>99.9%</StatNumber>
              <StatLabel>Uptime Garantizado</StatLabel>
            </StatCard>
          </StatsGrid>
        </Container>
      </StatsSection>

      <Footer>
        <FooterContent>
          <FooterText>
            © 2025 Flutter Designer Studio. Todos los derechos reservados.
            Hecho con ❤️ para la comunidad Flutter.
          </FooterText>
          <SocialLinks>
            <SocialLink href="#"><Github size={24} /></SocialLink>
          </SocialLinks>
        </FooterContent>
      </Footer>
    </LandingContainer>
  );
}
