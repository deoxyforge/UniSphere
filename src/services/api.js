import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('unisphere_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration/unauthorized calls globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('unisphere_token');
      localStorage.removeItem('unisphere_user');
      if (window.location.pathname !== '/' && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data)
};

export const eventAPI = {
  getAll: (params) => API.get('/events', { params }),
  getById: (id) => API.get(`/events/${id}`),
  getRelated: (id) => API.get(`/events/${id}/related`),
  create: (formData) => API.post('/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => API.put(`/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/events/${id}`),
  register: (id) => API.post(`/events/${id}/register`),
  cancelRegistration: (regId) => API.delete(`/events/registrations/${regId}`),
  getUserRegistrations: () => API.get('/events/registrations/user'),
  getRecommendations: () => API.get('/events/recommendations/user'),
  getEventRegistrants: (eventId) => API.get(`/events/${eventId}/registrations`),
  approve: (id) => API.put(`/events/${id}/approve`),
  reject: (id) => API.put(`/events/${id}/reject`)
};

export const clubAPI = {
  getAll: () => API.get('/clubs'),
  getById: (id) => API.get(`/clubs/${id}`),
  create: (formData) => API.post('/clubs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => API.put(`/clubs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/clubs/${id}`),
  join: (clubId) => API.post('/clubs/join', { clubId }),
  leave: (clubId) => API.post('/clubs/leave', { clubId })
};

export const attendanceAPI = {
  mark: (data) => API.post('/attendance', data),
  getReport: (eventId) => API.get(`/attendance/event/${eventId}`),
  getHistory: () => API.get('/attendance/student')
};

export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  markRead: () => API.put('/notifications/read')
};

export default API;
