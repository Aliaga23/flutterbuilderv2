class CollaborationService {
  private ws: WebSocket | null = null;
  private projectId: string | null = null;
  private userId: string | null = null;
  private callbacks: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(projectId: string, userId: string, token: string) {
    // Evitar múltiples conexiones al mismo proyecto
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.projectId === projectId) {
      console.log('Already connected to this project');
      return;
    }

    // Cerrar conexión anterior si existe
    if (this.ws) {
      this.ws.close();
    }

    this.projectId = projectId;
    this.userId = userId;

    const wsUrl = `wss://flutterbuilderbackend-production-9bf6.up.railway.app/collaboration/${projectId}/ws`;

    this.ws = new WebSocket(wsUrl, [`jwt.${token}`]);

    this.ws.onopen = () => {
      console.log('Connected to collaboration server');
      this.reconnectAttempts = 0;
      this.emit('connected', true);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code);
      this.emit('connected', false);
      
      // Intentar reconexión si no fue intencional
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect(projectId, userId, token);
        }, this.reconnectDelay * this.reconnectAttempts);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000); // Normal closure
      this.ws = null;
    }
    this.projectId = null;
    this.userId = null;
    // Limpiar callbacks para evitar listeners duplicados
    this.callbacks.clear();
  }

  // Métodos para enviar eventos de colaboración
  sendWidgetAdded(widget: any, pageId: string) {
    this.sendMessage({
      type: 'widget_added',
      data: { widget, pageId },
      userId: this.userId,
      timestamp: Date.now()
    });
  }

  sendWidgetUpdated(widgetId: string, properties?: any, size?: any) {
    this.sendMessage({
      type: 'widget_updated',
      data: { widgetId, properties, size },
      userId: this.userId,
      timestamp: Date.now()
    });
  }

  sendWidgetDeleted(widgetId: string) {
    this.sendMessage({
      type: 'widget_deleted',
      data: { widgetId },
      userId: this.userId,
      timestamp: Date.now()
    });
  }

  sendWidgetMoved(widgetId: string, position: { x: number; y: number }) {
    this.sendMessage({
      type: 'widget_moved',
      data: { widgetId, position },
      userId: this.userId,
      timestamp: Date.now()
    });
  }

  sendCursorMove(position: { x: number; y: number }, userInfo?: any) {
    this.sendMessage({
      type: 'cursor_moved',
      data: { 
        position,
        user: userInfo // Incluir información del usuario
      },
      userId: this.userId,
      timestamp: Date.now()
    });
  }

  sendUserJoined(userInfo: any) {
    this.sendMessage({
      type: 'user_joined',
      data: userInfo,
      userId: this.userId,
      timestamp: Date.now()
    });
  }

  // Métodos para páginas
  sendPageAdded(page: any) {
    this.sendMessage({
      type: 'page_added',
      data: { page },
      userId: this.userId,
      timestamp: Date.now()
    });
  }

  sendPageUpdated(pageId: string, name: string, route: string) {
    this.sendMessage({
      type: 'page_updated',
      data: { pageId, name, route },
      userId: this.userId,
      timestamp: Date.now()
    });
  }

  sendPageDeleted(pageId: string) {
    this.sendMessage({
      type: 'page_deleted',
      data: { pageId },
      userId: this.userId,
      timestamp: Date.now()
    });
  }

  // Solicitar lista de usuarios conectados
  requestConnectedUsers() {
    this.sendMessage({
      type: 'get_connected_users',
      data: {},
      userId: this.userId,
      timestamp: Date.now()
    });
  }

  private sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private handleMessage(data: any) {
    // No procesar nuestros propios mensajes
    if (data.userId === this.userId) {
      return;
    }

    switch (data.type) {
      case 'widget_added':
        this.emit('widget_added', data);
        break;
      case 'widget_updated':
        this.emit('widget_updated', data);
        break;
      case 'widget_deleted':
        this.emit('widget_deleted', data);
        break;
      case 'widget_moved':
        this.emit('widget_moved', data);
        break;
      case 'cursor_moved':
        this.emit('cursor_moved', data);
        break;
      case 'user_joined':
        this.emit('user_joined', data);
        break;
      case 'user_left':
        this.emit('user_left', data);
        break;
      case 'page_added':
        this.emit('page_added', data);
        break;
      case 'page_updated':
        this.emit('page_updated', data);
        break;
      case 'page_deleted':
        this.emit('page_deleted', data);
        break;
      case 'connected_users':
        this.emit('connected_users', data);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  // Sistema de eventos
  on(event: string, callback: Function) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const collaborationService = new CollaborationService();
