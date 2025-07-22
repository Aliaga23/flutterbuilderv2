import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const RegisterContainer = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin: 0;
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const RegisterTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #2D3748;
  margin-bottom: 6px;
`;

const RegisterSubtitle = styled.p`
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

const RegisterButton = styled.button`
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

const ColorPreview = styled.div<{ color: string }>`
  width: 100%;
  height: 40px;
  background: ${props => props.color};
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

// Function to generate random colors
const generateRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D5A6BD',
    '#AED6F1', '#A9DFBF', '#F9E79F', '#D7BDE2', '#A3E4D7'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onRegisterSuccess, 
  onSwitchToLogin 
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userColor] = useState(generateRandomColor());
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    // Username validation
    if (username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo válido');
      return;
    }
    
    // Password validation
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // For demo purposes, accept the registration
    // In a real app, you would call an API here
    setError('');
    
    // Store user data (in a real app, this would be handled by your backend)
    const userData = {
      username,
      email,
      password,
      color: userColor
    };
    
    console.log('Registered user:', userData);
    
    // Navigate to diagramador page or call the onRegisterSuccess callback
    if (onRegisterSuccess) {
      onRegisterSuccess();
    } else {
      navigate('/');
    }
  };

  return (
    <RegisterContainer>
      <RegisterHeader>
        <RegisterTitle>Crear Cuenta</RegisterTitle>
        <RegisterSubtitle>Únete a la comunidad de desarrolladores Flutter</RegisterSubtitle>
      </RegisterHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="username">Nombre de usuario</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="tu_usuario"
          />
        </InputGroup>
        
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
            placeholder="Mínimo 6 caracteres"
          />
        </InputGroup>
        
        <InputGroup>
          <Label>Tu color único</Label>
          <ColorPreview color={userColor}>
            {userColor} - Color asignado automáticamente
          </ColorPreview>
        </InputGroup>
        
        <RegisterButton type="submit">
          Crear Cuenta
        </RegisterButton>
      </form>
      
      <SwitchText>
        ¿Ya tienes cuenta?{' '}
        <SwitchLink onClick={onSwitchToLogin}>
          Iniciar Sesión
        </SwitchLink>
      </SwitchText>
    </RegisterContainer>
  );
};

export default RegisterForm;
