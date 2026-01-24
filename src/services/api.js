import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Profile
export const getProfile = () => api.get('/profile');
export const updateProfile = (data, token) => api.put('/profile', data, {
  headers: { Authorization: `Bearer ${token}` }
});

// Projects
export const getProjects = (featured) => api.get(`/projects${featured ? '?featured=true' : ''}`);
export const getProjectBySlug = (slug) => api.get(`/projects/slug/${slug}`);
export const createProject = (data, token) => api.post('/projects', data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const updateProject = (id, data, token) => api.put(`/projects/${id}`, data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const deleteProject = (id, token) => api.delete(`/projects/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Skills
export const getSkills = () => api.get('/skills');
export const createSkill = (data, token) => api.post('/skills', data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const updateSkill = (id, data, token) => api.put(`/skills/${id}`, data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const deleteSkill = (id, token) => api.delete(`/skills/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Blogs
export const getBlogs = (params) => api.get('/blogs', { params });
export const getBlogBySlug = (slug) => api.get(`/blogs/slug/${slug}`);
export const incrementBlogViews = (id) => api.patch(`/blogs/views/${id}`);
export const createBlog = (data, token) => api.post('/blogs', data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const updateBlog = (id, data, token) => api.put(`/blogs/${id}`, data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const deleteBlog = (id, token) => api.delete(`/blogs/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Education
export const getEducation = () => api.get('/education');
export const createEducation = (data, token) => api.post('/education', data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const updateEducation = (id, data, token) => api.put(`/education/${id}`, data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const deleteEducation = (id, token) => api.delete(`/education/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Experience
export const getExperience = () => api.get('/experience');
export const createExperience = (data, token) => api.post('/experience', data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const updateExperience = (id, data, token) => api.put(`/experience/${id}`, data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const deleteExperience = (id, token) => api.delete(`/experience/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Certifications
export const getCertifications = () => api.get('/certifications');
export const createCertification = (data, token) => api.post('/certifications', data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const updateCertification = (id, data, token) => api.put(`/certifications/${id}`, data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const deleteCertification = (id, token) => api.delete(`/certifications/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Services
export const getServices = () => api.get('/services');
export const getServiceById = (id) => api.get(`/services/${id}`);
export const createService = (data, token) => api.post('/services', data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const updateService = (id, data, token) => api.put(`/services/${id}`, data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const deleteService = (id, token) => api.delete(`/services/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Auth & Messages
export const login = (credentials) => api.post('/auth/login', credentials);
export const sendMessage = (messageData) => api.post('/messages', messageData);
export const getMessages = (token) => api.get('/messages', {
  headers: { Authorization: `Bearer ${token}` }
});
export const updateMessageStatus = (id, status, token) => api.put(`/messages/${id}`, { status }, {
  headers: { Authorization: `Bearer ${token}` }
});
export const deleteMessage = (id, token) => api.delete(`/messages/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Admin Stats
export const getAdminStats = (token) => api.get('/admin/stats', {
  headers: { Authorization: `Bearer ${token}` }
});

// Upload
export const uploadFile = (formData, token) => api.post('/upload', formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});

export default api;
