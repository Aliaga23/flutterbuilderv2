const API_BASE_URL = 'https://flutterbuilderbackend-production-9bf6.up.railway.app';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  color: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
  color: string;
  id: string;
  created_at: string;
}

export interface UserProfile {
  username: string;
  email: string;
  color: string;
  id: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  data: any;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  data: any;
}

export interface Project {
  id: string;
  name: string;
  data: any;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  data: any;
}

// Simple auth functions
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al iniciar sesión');
  }

  const data: LoginResponse = await response.json();
  localStorage.setItem('access_token', data.access_token);
  return data;
};

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al crear la cuenta');
  }

  return response.json();
};

export const getProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('access_token');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al obtener el perfil');
  }

  return response.json();
};

export const logout = (): void => {
  localStorage.removeItem('access_token');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

// Projects functions
export const createProject = async (projectData: CreateProjectRequest): Promise<Project> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/projects/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al crear el proyecto');
  }

  return response.json();
};

export const getProjects = async (): Promise<Project[]> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/projects/`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('access_token');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al obtener los proyectos');
  }

  return response.json();
};

export const getProject = async (projectId: string): Promise<Project> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('access_token');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al obtener el proyecto');
  }

  return response.json();
};

export const updateProject = async (projectId: string, projectData: CreateProjectRequest): Promise<Project> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al actualizar el proyecto');
  }

  return response.json();
};

export const generateJSONFromImage = async (imageFile: File): Promise<any> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_BASE_URL}/generate-json-from-image`, {
    method: 'POST',
    headers: {
      'accept': 'application/json'
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al generar JSON desde la imagen');
  }

  return response.json();
};

export const generateFlutterApp = async (projectData: any): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/generate-flutter-app`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify(projectData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al generar la aplicación Flutter');
  }

  // Return the blob for download
  return response.blob();
};

export const generateJSONFromPrompt = async (prompt: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/generate-json-from-prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al generar JSON desde el prompt');
  }

  return response.json();
};

export const generateFunctionalAppWithAI = async (projectData: any, description: string): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/generate-functional-app-from-json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({
      project: projectData,
      description: description
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al generar la aplicación funcional con IA');
  }

  // Return the blob for download
  return response.blob();
};

export const generateJSONFromAudio = async (audioFile: File): Promise<any> => {
  const formData = new FormData();
  formData.append('audio', audioFile);

  const response = await fetch(`${API_BASE_URL}/generate-json-from-audio`, {
    method: 'POST',
    headers: {
      'accept': 'application/json'
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al generar JSON desde el audio');
  }

  return response.json();
};
