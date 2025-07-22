import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { FlutterProject, FlutterWidget, Page, Position } from '../types';
import { WIDGET_TEMPLATES } from '../constants/widgets';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  project: FlutterProject;
  selectedWidget: FlutterWidget | null;
  isDragging: boolean;
  dragPosition: { x: number; y: number } | null;
}

type AppAction =
  | { type: 'ADD_WIDGET'; payload: { widget: FlutterWidget; pageId: string } }
  | { type: 'UPDATE_WIDGET'; payload: { widgetId: string; properties?: Record<string, any>; size?: { width: number; height: number } } }
  | { type: 'DELETE_WIDGET'; payload: string }
  | { type: 'MOVE_WIDGET'; payload: { widgetId: string; position: Position } }
  | { type: 'SELECT_WIDGET'; payload: FlutterWidget | null }
  | { type: 'ADD_PAGE'; payload: Page }
  | { type: 'UPDATE_PAGE'; payload: { pageId: string; name: string; route: string } }
  | { type: 'DELETE_PAGE'; payload: string }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'SET_DEVICE'; payload: string }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'SET_DRAG_POSITION'; payload: { x: number; y: number } | null }
  | { type: 'UPDATE_PROJECT'; payload: Partial<FlutterProject> }
  | { type: 'LOAD_PROJECT'; payload: FlutterProject };

const initialProject: FlutterProject = {
  name: 'Flutter App',
  description: 'A new Flutter app built visually',
  currentPageId: 'page-1',
  selectedDeviceId: 'iphone_14',
  pages: [
    {
      id: 'page-1',
      name: 'Home',
      route: '/',
      widgets: []
    }
  ],
  theme: {
    primaryColor: '#2196F3',
    accentColor: '#FF4081',
    backgroundColor: '#FFFFFF'
  }
};

const initialState: AppState = {
  project: initialProject,
  selectedWidget: null,
  isDragging: false,
  dragPosition: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_WIDGET': {
      const { widget, pageId } = action.payload;
      return {
        ...state,
        project: {
          ...state.project,
          pages: state.project.pages.map(page =>
            page.id === pageId
              ? { ...page, widgets: [...page.widgets, widget] }
              : page
          )
        }
      };
    }

    case 'UPDATE_WIDGET': {
      const { widgetId, properties, size } = action.payload;
      return {
        ...state,
        project: {
          ...state.project,
          pages: state.project.pages.map(page => ({
            ...page,
            widgets: page.widgets.map(widget =>
              widget.id === widgetId
                ? { 
                    ...widget, 
                    ...(properties && { properties: { ...widget.properties, ...properties } }),
                    ...(size && { size: { ...widget.size, ...size } })
                  }
                : widget
            )
          }))
        },
        selectedWidget: state.selectedWidget?.id === widgetId
          ? { 
              ...state.selectedWidget, 
              ...(properties && { properties: { ...state.selectedWidget.properties, ...properties } }),
              ...(size && { size: { ...state.selectedWidget.size, ...size } })
            }
          : state.selectedWidget
      };
    }

    case 'DELETE_WIDGET': {
      const widgetId = action.payload;
      return {
        ...state,
        project: {
          ...state.project,
          pages: state.project.pages.map(page => ({
            ...page,
            widgets: page.widgets.filter(widget => widget.id !== widgetId)
          }))
        },
        selectedWidget: state.selectedWidget?.id === widgetId ? null : state.selectedWidget
      };
    }

    case 'MOVE_WIDGET': {
      const { widgetId, position } = action.payload;
      return {
        ...state,
        project: {
          ...state.project,
          pages: state.project.pages.map(page => ({
            ...page,
            widgets: page.widgets.map(widget =>
              widget.id === widgetId
                ? { ...widget, position }
                : widget
            )
          }))
        }
      };
    }

    case 'SELECT_WIDGET':
      return {
        ...state,
        selectedWidget: action.payload
      };

    case 'ADD_PAGE': {
      const newPage = action.payload;
      // Auto-generate route if not provided
      const route = newPage.route || `/${newPage.name.toLowerCase().replace(/\s+/g, '-')}`;
      const pageWithRoute = { ...newPage, route };
      
      // Update all BottomNavigationBar widgets in all pages to include the new page
      const updatedPages = state.project.pages.map(page => ({
        ...page,
        widgets: page.widgets.map(widget => {
          if (widget.type === 'bottomnavbar') {
            const currentItems = widget.properties.items || [];
            const currentIcons = widget.properties.icons || [];
            const currentRoutes = widget.properties.routes || [];
            
            // Check if the new page is already in the items (avoid duplicates)
            if (!currentItems.includes(newPage.name)) {
              return {
                ...widget,
                properties: {
                  ...widget.properties,
                  items: [...currentItems, newPage.name],
                  icons: [...currentIcons, 'Home'], // Default icon for new page
                  routes: [...currentRoutes, route]
                }
              };
            }
          }
          return widget;
        })
      }));
      
      return {
        ...state,
        project: {
          ...state.project,
          pages: [...updatedPages, pageWithRoute]
        }
      };
    }

    case 'UPDATE_PAGE': {
      const { pageId, name, route } = action.payload;
      return {
        ...state,
        project: {
          ...state.project,
          pages: state.project.pages.map(page =>
            page.id === pageId
              ? { ...page, name, route }
              : page
          )
        }
      };
    }

    case 'DELETE_PAGE': {
      const pageId = action.payload;
      const pageToDelete = state.project.pages.find(page => page.id === pageId);
      const remainingPages = state.project.pages.filter(page => page.id !== pageId);
      const currentPageId = state.project.currentPageId === pageId
        ? remainingPages[0]?.id || ''
        : state.project.currentPageId;
      
      // Update all BottomNavigationBar widgets to remove the deleted page
      const updatedPages = remainingPages.map(page => ({
        ...page,
        widgets: page.widgets.map(widget => {
          if (widget.type === 'bottomnavbar' && pageToDelete) {
            const currentItems = widget.properties.items || [];
            const currentIcons = widget.properties.icons || [];
            const currentRoutes = widget.properties.routes || [];
            
            // Find the index of the deleted page
            const pageIndex = currentItems.indexOf(pageToDelete.name);
            if (pageIndex !== -1) {
              // Remove the page from all arrays
              const newItems = [...currentItems];
              const newIcons = [...currentIcons];
              const newRoutes = [...currentRoutes];
              
              newItems.splice(pageIndex, 1);
              newIcons.splice(pageIndex, 1);
              newRoutes.splice(pageIndex, 1);
              
              return {
                ...widget,
                properties: {
                  ...widget.properties,
                  items: newItems,
                  icons: newIcons,
                  routes: newRoutes,
                  selectedIndex: Math.max(0, Math.min(widget.properties.selectedIndex || 0, newItems.length - 1))
                }
              };
            }
          }
          return widget;
        })
      }));
      
      return {
        ...state,
        project: {
          ...state.project,
          pages: updatedPages,
          currentPageId
        }
      };
    }

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        project: {
          ...state.project,
          currentPageId: action.payload
        }
      };

    case 'SET_DEVICE':
      return {
        ...state,
        project: {
          ...state.project,
          selectedDeviceId: action.payload
        }
      };

    case 'SET_DRAGGING':
      return {
        ...state,
        isDragging: action.payload
      };

    case 'SET_DRAG_POSITION':
      return {
        ...state,
        dragPosition: action.payload
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        project: {
          ...state.project,
          ...action.payload
        }
      };

    case 'LOAD_PROJECT':
      return {
        ...state,
        project: {
          ...action.payload,
          selectedDeviceId: state.project.selectedDeviceId // Preserve current device selection
        },
        selectedWidget: null // Clear selection when loading new project
      };

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addWidget: (widgetType: string, position: Position, pageId: string) => void;
  getCurrentPage: () => Page | undefined;
  generateJSON: () => string;
  loadFromJSON: (jsonData: any) => void;
  forceUpdateBottomNavBars: () => void;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const forceUpdateBottomNavBars = useCallback(() => {
    // Get current state at the time of execution
    const currentState = state;
    const allPages = currentState.project.pages;
    const pageNames = allPages.map(page => page.name);
    const pageRoutes = allPages.map(page => page.route);
    
    allPages.forEach(page => {
      page.widgets.forEach(widget => {
        if (widget.type === 'bottomnavbar') {
          dispatch({
            type: 'UPDATE_WIDGET',
            payload: {
              widgetId: widget.id,
              properties: {
                items: pageNames,
                routes: pageRoutes,
                icons: pageNames.map(() => 'Home'), // Usar Home para todos
                selectedIndex: 0
              }
            }
          });
        }
      });
    });
  }, [state]);

  // Extract complex expression to variables for ESLint
  const pagesLength = state.project.pages.length;
  const pageNamesString = state.project.pages.map(p => p.name).join(',');

  // Automatically sync BottomNavigationBars when pages change, but prevent infinite loops
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      forceUpdateBottomNavBars();
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [pagesLength, pageNamesString, forceUpdateBottomNavBars]);

  const addWidget = (widgetType: string, position: Position, pageId: string) => {
    const template = WIDGET_TEMPLATES.find(t => t.id === widgetType);
    let properties = { ...template?.defaultProperties || {} };

    // Si es BottomNavigationBar, sincronizar con todas las páginas existentes
    if (widgetType === 'bottomnavbar') {
      const allPages = state.project.pages;
      properties.items = allPages.map(page => page.name);
      properties.routes = allPages.map(page => page.route);
      properties.icons = allPages.map(() => 'Home'); // Usar icono por defecto más apropiado
      properties.selectedIndex = 0;
    }

    const widget: FlutterWidget = {
      id: uuidv4(),
      type: widgetType,
      name: template?.name || widgetType,
      position,
      size: { 
        width: template?.defaultProperties.width || 100, 
        height: template?.defaultProperties.height || 100 
      },
      properties
    };

    dispatch({ type: 'ADD_WIDGET', payload: { widget, pageId } });
  };

  const getCurrentPage = () => {
    return state.project.pages.find(page => page.id === state.project.currentPageId);
  };

  const generateJSON = () => {
    // Generate JSON without device information
    const exportData = {
      name: state.project.name,
      description: state.project.description,
      currentPageId: state.project.currentPageId,
      pages: state.project.pages,
      theme: state.project.theme
    };
    return JSON.stringify(exportData, null, 2);
  };

  const loadFromJSON = (jsonData: any) => {
    try {
      // Validate and load project data
      const projectData: FlutterProject = {
        name: jsonData.name || 'Untitled Project',
        description: jsonData.description || 'A Flutter app built visually',
        currentPageId: jsonData.currentPageId || (jsonData.pages?.[0]?.id || 'page-1'),
        selectedDeviceId: state.project.selectedDeviceId, // Keep current device
        pages: jsonData.pages || [
          {
            id: 'page-1',
            name: 'Home',
            route: '/',
            widgets: []
          }
        ],
        theme: {
          primaryColor: jsonData.theme?.primaryColor || '#2196F3',
          accentColor: jsonData.theme?.accentColor || '#FF4081',
          backgroundColor: jsonData.theme?.backgroundColor || '#FFFFFF'
        }
      };

      dispatch({ type: 'LOAD_PROJECT', payload: projectData });
    } catch (error) {
      console.error('Error loading project from JSON:', error);
      // Could show an error message to the user here
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      addWidget,
      getCurrentPage,
      generateJSON,
      loadFromJSON,
      forceUpdateBottomNavBars
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
