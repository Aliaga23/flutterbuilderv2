import { useState, useEffect, useCallback } from 'react';
import { collaborationService } from '../services/collaborationService';
import { useApp } from '../context/AppContext';
import type { AppAction } from '../context/AppContext';

export interface CollaborativeUser {
  id: string;
  username: string;
  email: string;
  color: string;
  cursor?: { x: number; y: number };
  isActive: boolean;
}

export function useCollaboration(projectId?: string) {
  const { dispatch } = useApp();
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<CollaborativeUser[]>([]);
  const [userCursors, setUserCursors] = useState<Map<string, { x: number; y: number; color: string; username: string }>>(new Map());
  const [currentUserInfo, setCurrentUserInfo] = useState<any>(null);
  
  // Limpiar usuarios inactivos cada 30 segundos
  useEffect(() => {
    const cleanup = setInterval(() => {
      setConnectedUsers(prev => {
        // Mantener solo usuarios que tienen cursores activos o es el usuario actual
        return prev.filter(user => 
          user.id === currentUserInfo?.id || userCursors.has(user.id)
        );
      });
    }, 30000); // 30 segundos

    return () => clearInterval(cleanup);
  }, [currentUserInfo, userCursors]);
  
  // Usar useEffect para configurar listeners solo una vez
  useEffect(() => {
    if (!projectId) return;

    // Función auxiliar para crear dispatch que verifica duplicados
    const createSafeDispatch = (action: AppAction) => {
      dispatch(action);
    };

    // Configurar listeners solo una vez cuando cambia el projectId
    const setupListeners = () => {
      // Manejar eventos de widgets
      collaborationService.on('widget_added', (data: any) => {
        createSafeDispatch({
          type: 'ADD_WIDGET',
          payload: { widget: data.data.widget, pageId: data.data.pageId }
        });
      });

      collaborationService.on('widget_updated', (data: any) => {
        createSafeDispatch({
          type: 'UPDATE_WIDGET',
          payload: {
            widgetId: data.data.widgetId,
            properties: data.data.properties,
            size: data.data.size
          }
        });
      });

      collaborationService.on('widget_deleted', (data: any) => {
        createSafeDispatch({
          type: 'DELETE_WIDGET',
          payload: data.data.widgetId
        });
      });

      collaborationService.on('widget_moved', (data: any) => {
        console.log('Widget moved event received:', data); // Debug
        createSafeDispatch({
          type: 'MOVE_WIDGET',
          payload: {
            widgetId: data.data.widgetId,
            position: data.data.position
          }
        });
      });

      // Manejar cursores
      collaborationService.on('cursor_moved', (data: any) => {
        console.log('Cursor moved event:', data); // Debug
        setUserCursors(prev => {
          const newCursors = new Map(prev);
          if (data.data && data.data.user) {
            newCursors.set(data.userId, {
              x: data.data.position.x,
              y: data.data.position.y,
              color: data.data.user.color,
              username: data.data.user.username
            });

            // También agregar/actualizar en usuarios conectados
            setConnectedUsers(prevUsers => {
              const exists = prevUsers.find(u => u.id === data.userId);
              if (!exists) {
                const newUser = {
                  id: data.userId,
                  username: data.data.user.username,
                  email: data.data.user.email || '',
                  color: data.data.user.color,
                  isActive: true
                };
                console.log('Adding user from cursor:', newUser); // Debug
                return [...prevUsers, newUser];
              }
              return prevUsers;
            });
          }
          return newCursors;
        });
      });

      // Manejar usuarios - simplificado
      collaborationService.on('user_joined', (data: any) => {
        console.log('User joined event:', data); // Debug
        // Los usuarios se agregarán cuando muevan el cursor
      });

      collaborationService.on('user_left', (data: any) => {
        console.log('User left event:', data); // Debug
        setConnectedUsers(prev => {
          const filtered = prev.filter(u => u.id !== data.userId && u.id !== data.data?.id);
          console.log('Users after leave:', filtered); // Debug
          return filtered;
        });
        setUserCursors(prev => {
          const newCursors = new Map(prev);
          newCursors.delete(data.userId);
          if (data.data?.id) {
            newCursors.delete(data.data.id);
          }
          return newCursors;
        });
      });

      collaborationService.on('connected', (connected: boolean) => {
        console.log('Connection status changed:', connected); // Debug
        setIsConnected(connected);
      });

      // Manejar eventos de páginas
      collaborationService.on('page_added', (data: any) => {
        console.log('Page added event:', data); // Debug
        createSafeDispatch({
          type: 'ADD_PAGE',
          payload: data.data.page
        });
      });

      collaborationService.on('page_updated', (data: any) => {
        console.log('Page updated event:', data); // Debug
        createSafeDispatch({
          type: 'UPDATE_PAGE',
          payload: {
            pageId: data.data.pageId,
            name: data.data.name,
            route: data.data.route
          }
        });
      });

      collaborationService.on('page_deleted', (data: any) => {
        console.log('Page deleted event:', data); // Debug
        createSafeDispatch({
          type: 'DELETE_PAGE',
          payload: data.data.pageId
        });
      });
    };

    setupListeners();

    return () => {
      collaborationService.disconnect();
    };
  }, [projectId, dispatch]); // Removemos connectedUsers de las dependencias

  const enableCollaboration = useCallback(async (userId: string, token: string, userInfo: any) => {
    if (!projectId) return;

    // Guardar información del usuario
    setCurrentUserInfo(userInfo);

    // Agregar el usuario actual a la lista de conectados
    const currentUser = {
      id: userId,
      username: userInfo.username,
      email: userInfo.email,
      color: userInfo.color || '#' + Math.floor(Math.random()*16777215).toString(16),
      isActive: true
    };
    
    setConnectedUsers(prev => {
      const exists = prev.find(u => u.id === userId);
      if (!exists) {
        console.log('Adding current user to connected list:', currentUser); // Debug
        return [...prev, currentUser];
      }
      return prev;
    });

    // Solo conectar, los listeners ya están configurados
    if (collaborationService.isConnected()) {
      return;
    }

    try {
      collaborationService.connect(projectId, userId, token);
      
      // Enviar información del usuario cuando se conecte
      if (collaborationService.isConnected()) {
        collaborationService.sendUserJoined({
          id: userId,
          username: userInfo.username,
          email: userInfo.email,
          color: currentUser.color
        });
      }
    } catch (error) {
      console.error('Error enabling collaboration:', error);
    }
  }, [projectId]);

  const disableCollaboration = useCallback(() => {
    collaborationService.disconnect();
    setIsConnected(false);
    setConnectedUsers([]);
    setUserCursors(new Map());
    setCurrentUserInfo(null);
  }, []);

  const sendCursorMove = useCallback((position: { x: number; y: number }) => {
    if (isConnected && currentUserInfo) {
      collaborationService.sendCursorMove(position, currentUserInfo);
    }
  }, [isConnected, currentUserInfo]);

  return {
    isConnected,
    connectedUsers,
    userCursors,
    enableCollaboration,
    disableCollaboration,
    sendCursorMove,
    collaborationService
  };
}
