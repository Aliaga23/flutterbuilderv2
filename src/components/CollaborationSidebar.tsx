import React, { useState } from 'react';
import styled from 'styled-components';
import { Users, Share2, Copy,  Check } from 'lucide-react';
import { CollaborativeUser } from '../hooks/useCollaboration';

interface CollaborationSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isConnected: boolean;
  connectedUsers: CollaborativeUser[];
  projectId: string;
}

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: ${props => props.isOpen ? '320px' : '0'};
  background: #FFFFFF;
  border-left: 1px solid #E1E5E9;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  z-index: 1000;
  box-shadow: ${props => props.isOpen ? '-4px 0 12px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const SidebarHeader = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid #E1E5E9;
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
  color: white;
`;

const SidebarTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const ConnectionStatus = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.isConnected ? '#10B981' : '#6B7280'};
`;

const StatusDot = styled.div<{ isConnected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.isConnected ? '#10B981' : '#6B7280'};
`;

const SidebarContent = styled.div`
  padding: 20px;
  height: calc(100vh - 100px);
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InviteSection = styled.div`
  background: #F8FAFC;
  border: 1px solid #E1E5E9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
`;

const InviteUrl = styled.div`
  background: white;
  border: 1px solid #E1E5E9;
  border-radius: 8px;
  padding: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 12px;
  word-break: break-all;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.variant === 'primary' ? '#3B82F6' : '#E1E5E9'};
  background: ${props => props.variant === 'primary' ? '#3B82F6' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#374151'};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#2563EB' : '#F9FAFB'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F8FAFC;
  border: 1px solid #E1E5E9;
  border-radius: 8px;
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
  font-weight: 600;
  font-size: 14px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #111827;
  font-size: 14px;
`;

const UserEmail = styled.div`
  color: #6B7280;
  font-size: 12px;
`;

const ToggleButton = styled.button<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  right: ${props => props.isOpen ? '320px' : '0'};
  transform: translateY(-50%);
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px 0 0 8px;
  padding: 12px 8px;
  cursor: pointer;
  z-index: 1001;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    background: #2563EB;
    transform: translateY(-50%) translateX(-2px);
  }

  svg {
    writing-mode: initial;
    text-orientation: initial;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #6B7280;
`;

const EmptyStateIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #9CA3AF;
`;

export const CollaborationSidebar: React.FC<CollaborationSidebarProps> = ({
  isOpen,
  onToggle,
  isConnected,
  connectedUsers,
  projectId
}) => {
  const [copied, setCopied] = useState(false);

  // Debug: log usuarios conectados
  React.useEffect(() => {
    console.log('CollaborationSidebar - Connected users:', connectedUsers);
    console.log('CollaborationSidebar - Is connected:', isConnected);
  }, [connectedUsers, isConnected]);

  const inviteUrl = `${window.location.origin}/diagramador/${projectId}`;

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const shareInviteLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Únete a colaborar en mi proyecto Flutter',
          text: 'Te invito a colaborar en tiempo real en mi proyecto de Flutter Builder',
          url: inviteUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyInviteLink();
    }
  };

  return (
    <>
      <ToggleButton isOpen={isOpen} onClick={onToggle}>
        <Users size={16} />
        {!isOpen && <span>COLABORAR</span>}
      </ToggleButton>

      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <SidebarTitle>
            <Users size={20} />
            Colaboradores
          </SidebarTitle>
          <ConnectionStatus isConnected={isConnected}>
            <StatusDot isConnected={isConnected} />
            {isConnected ? 'Conectado' : 'Desconectado'}
          </ConnectionStatus>
        </SidebarHeader>

        <SidebarContent>
          <Section>
            <SectionTitle>Invitar Colaboradores</SectionTitle>
            <InviteSection>
              <InviteUrl>{inviteUrl}</InviteUrl>
              <ButtonGroup>
                <Button onClick={copyInviteLink}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </Button>
                <Button variant="primary" onClick={shareInviteLink}>
                  <Share2 size={14} />
                  Compartir
                </Button>
              </ButtonGroup>
            </InviteSection>
          </Section>

          <Section>
            <SectionTitle>
              Usuarios Conectados ({connectedUsers.length})
            </SectionTitle>
            
            {connectedUsers.length > 0 ? (
              <UsersList>
                {connectedUsers.map(user => (
                  <UserItem key={user.id}>
                    <UserAvatar color={user.color}>
                      {user.username.charAt(0).toUpperCase()}
                    </UserAvatar>
                    <UserInfo>
                      <UserName>{user.username}</UserName>
                      <UserEmail>{user.email}</UserEmail>
                    </UserInfo>
                  </UserItem>
                ))}
              </UsersList>
            ) : (
              <EmptyState>
                <EmptyStateIcon>
                  <Users size={24} />
                </EmptyStateIcon>
                <div>No hay colaboradores conectados</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  Comparte el enlace del diagramador para invitar colaboradores
                </div>
              </EmptyState>
            )}
          </Section>
        </SidebarContent>
      </SidebarContainer>
    </>
  );
};
