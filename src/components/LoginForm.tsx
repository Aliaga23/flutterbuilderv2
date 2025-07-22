import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const LoginContainer = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin: 0;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const LoginTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #2D3748;
  margin-bottom: 6px;
`;

const LoginSubtitle = styled.p`
  font-size: 14px;
  color: #718096;
  margin: 0;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #4A5568;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 16px;
  color: #2D3748;
  transition: all 0.2s;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #4A5568;
    box-shadow: 0 0 0 2px rgba(74, 85, 104, 0.2);
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 12px;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 6px;
  
  &:hover {
    background: #1E88E5;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
  }
`;

const ErrorMessage = styled.p`
  color: #E53E3E;
  font-size: 13px;
  margin-top: 6px;
  margin-bottom: 12px;
  text-align: center;
`;

const SwitchText = styled.p`
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #718096;
`;

const SwitchLink = styled.button`
  background: none;
  border: none;
  color: #2196F3;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  
  &:hover {
    color: #1E88E5;
  }
`;

interface LoginFormProps {
  onLoginSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo válido');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await login({ email, password });
      
      // Navigate to diagramador page or call the onLoginSuccess callback
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginHeader>
        <LoginTitle>Iniciar Sesión</LoginTitle>
        <LoginSubtitle>Ingresa tus credenciales para acceder al diagramador</LoginSubtitle>
      </LoginHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@ejemplo.com"
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
          />
        </InputGroup>
        
        <LoginButton type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Ingresar al Diagramador'}
        </LoginButton>
      </form>
      
      <SwitchText>
        ¿No tienes cuenta?{' '}
        <SwitchLink onClick={onSwitchToRegister}>
          Registrarse
        </SwitchLink>
      </SwitchText>
    </LoginContainer>
  );
};

export default LoginForm;
