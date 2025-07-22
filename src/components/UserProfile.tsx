import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getProfile, logout, UserProfile } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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
  color: #2D3748;
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: #718096;
`;

const LogoutButton = styled.button`
  padding: 6px 12px;
  background: #E53E3E;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #C53030;
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const LoadingText = styled.span`
  font-size: 14px;
  color: #718096;
`;

interface UserProfileComponentProps {
  onLogout?: () => void;
}

export const UserProfileComponent: React.FC<UserProfileComponentProps> = ({ onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
        // If there's an error getting the profile, logout
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    logout();
    setProfile(null);
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  if (loading) {
    return <LoadingText>Cargando...</LoadingText>;
  }

  if (!profile) {
    return null;
  }

  const initials = profile.username.substring(0, 2).toUpperCase();

  return (
    <ProfileContainer>
      <UserAvatar color={profile.color}>
        {initials}
      </UserAvatar>
      <UserInfo>
        <UserName>{profile.username}</UserName>
        <UserEmail>{profile.email}</UserEmail>
      </UserInfo>
      <LogoutButton onClick={handleLogout}>
        Cerrar Sesión
      </LogoutButton>
    </ProfileContainer>
  );
};

export default UserProfileComponent;
