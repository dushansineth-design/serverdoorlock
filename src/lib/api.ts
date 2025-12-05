

const API_BASE_URL = import.meta.env.VITE_API_URL || '';


let authToken: string | null = localStorage.getItem('accessToken');

//
export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export const getAuthToken = () => authToken;

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<{ data?: T; error?: string }> => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An error occurred' };
  }
};


// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      return { data: { accessToken: 'demo-token-' + Date.now() } };
    }
    return apiRequest<{ accessToken: string }>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  refresh: () => apiRequest<{ accessToken: string }>('/api/auth/refresh', { method: 'POST' }),
};

// Users API
export const usersApi = {
  getAll: () => apiRequest<any[]>('/api/users'),
  create: (data: any) => apiRequest('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest(`/api/users/${id}`, { method: 'DELETE' }),
};


// Doors API
export const doorsApi = {
  getAll: () => apiRequest<any[]>('/api/doors'),
  
  create: (data: any) =>
    apiRequest('/api/doors', {
      method: 'POST',
      body: JSON.stringify({ 
        name: data.name, 
        location: data.location, 
        deviceIP: data.deviceIP 
      }),
    }),


  update: (id: string, data: any) =>
    apiRequest(`/api/doors/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: data.name,
        location: data.location,
        deviceIP: data.deviceIP,
      }),
    }),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/api/doors/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) => apiRequest(`/api/doors/${id}`, { method: 'DELETE' }),
};



// Keys API
export const keysApi = {
  getAll: () => apiRequest<any[]>('/api/keys'),
  create: (data: any) => apiRequest('/api/keys', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/api/keys/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/api/keys/${id}`, { method: 'DELETE' }),
};


//  Permissions API
export const permissionsApi = {
  getKeyPermissions: (keyId: string) => apiRequest<any[]>(`/api/permissions/${keyId}`),

  setKeyPermissions: (keyId: string, doors: number[], role = "operator") =>
    apiRequest('/api/permissions', {
      method: 'POST',
      body: JSON.stringify({
        keyId: keyId,   
        doors: doors,   
        role: role      
      }),
    }),
};




// Device API
export const deviceApi = {
  sendCommand: async (payload: { door_id: string; command: 'lock' | 'unlock' }) => {
    return apiRequest('/admin/door/command', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// Logs API
export const logsApi = {
  getAll: () => apiRequest<any[]>('/api/logs'),
};





// // API configuration and helper functions
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

// interface ApiResponse<T> {
//   data?: T;
//   error?: string;
// }

// // Store token in memory for this session
// let authToken: string | null = localStorage.getItem('accessToken');

// export const setAuthToken = (token: string | null) => {
//   authToken = token;
//   if (token) {
//     localStorage.setItem('accessToken', token);
//   } else {
//     localStorage.removeItem('accessToken');
//   }
// };

// export const getAuthToken = () => authToken;

// const apiRequest = async <T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<ApiResponse<T>> => {
//   try {
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//       ...(authToken && { Authorization: `Bearer ${authToken}` }),
//       ...options.headers,
//     };

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       ...options,
//       headers,
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return { data };
//   } catch (error) {
//     return { error: error instanceof Error ? error.message : 'An error occurred' };
//   }
// };

// // Auth API
// export const authApi = {
//   login: async (username: string, password: string) => {
//     // Demo mode - bypass API
//     if (username === 'admin' && password === 'admin123') {
//       return { 
//         data: { 
//           accessToken: 'demo-token-' + Date.now() 
//         } 
//       };
//     }
    
//     return apiRequest<{ accessToken: string }>('/api/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ username, password }),
//     });
//   },
  
//   refresh: () =>
//     apiRequest<{ accessToken: string }>('/api/auth/refresh', {
//       method: 'POST',
//     }),
// };



// // Users API
// export const usersApi = {
//   getAll: () => apiRequest<any[]>('/api/users'), // fetch all users
//   create: (userData: any) =>
//     apiRequest('/api/users', {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     }),
//   delete: (id: number) =>
//     apiRequest(`/api/users/${id}`, {
//       method: 'DELETE',
//     }),
// };


// // Doors API
// export const doorsApi = {
//   getAll: () => apiRequest<any[]>('/api/doors'),
//   create: (doorData: any) =>
//     apiRequest('/api/doors', {
//       method: 'POST',
//       body: JSON.stringify(doorData),
//     }),
//   update: (id: string, doorData: any) =>
//     apiRequest(`/api/doors/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(doorData),
//     }),
//   delete: (id: string) =>
//     apiRequest(`/api/doors/${id}`, {
//       method: 'DELETE',
//     }),
// };

// // Keys API
// export const keysApi = {
//   getAll: () => apiRequest<any[]>('/api/keys'),
//   create: (keyData: any) =>
//     apiRequest('/api/keys', {
//       method: 'POST',
//       body: JSON.stringify(keyData),
//     }),
//   update: (id: string, keyData: any) =>
//     apiRequest(`/api/keys/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(keyData),
//     }),
//   delete: (id: string) =>
//     apiRequest(`/api/keys/${id}`, {
//       method: 'DELETE',
//     }),
// };

// // Permissions API
// export const permissionsApi = {
//   getKeyPermissions: (keyId: string) =>
//     apiRequest<any[]>(`/api/keys/${keyId}/permissions`),
  
//   setKeyPermissions: (keyId: string, doorIds: number[], grantedBy: string) =>
//     apiRequest(`/api/keys/${keyId}/permissions`, {
//       method: 'POST',
//       body: JSON.stringify({ doorIds, grantedBy }),
//     }),
  
//   deletePermission: (keyId: string, doorId: string) =>
//     apiRequest(`/api/keys/${keyId}/permissions/${doorId}`, {
//       method: 'DELETE',
//     }),
// };

// // Device API
// export const deviceApi = {
//   sendCommand: (deviceId: string, command: 'lock' | 'unlock' | 'refreshPermission') =>
//     apiRequest(`/api/device/${deviceId}/command`, {
//       method: 'POST',
//       body: JSON.stringify({ cmd: command }),
//     }),
// };


//

