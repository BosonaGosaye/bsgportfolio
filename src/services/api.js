import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Simple persistent cache for GET requests
const CACHE_KEY_PREFIX = 'api_cache_';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for persistence

const getCached = async (url, params = {}) => {
  const cacheKey = CACHE_KEY_PREFIX + JSON.stringify({ url, params });
  
  // Try to get from localStorage first
  const cachedItem = localStorage.getItem(cacheKey);
  if (cachedItem) {
    const { data, timestamp } = JSON.parse(cachedItem);
    if (Date.now() - timestamp < CACHE_DURATION) {
      // Still valid, return it but you could also fetch in background to refresh (Stale-While-Revalidate)
      return data;
    }
  }

  // Fetch from API
  const response = await api.get(url, { params });
  
  // Save to localStorage
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      data: response,
      timestamp: Date.now()
    }));
  } catch (e) {
    // If localStorage is full, clear old cache items
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_KEY_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
  
  return response;
};

// Function to clear all cache
const clearCache = () => {
  Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_KEY_PREFIX))
    .forEach(key => localStorage.removeItem(key));
};

// Profile
export const getProfile = () => getCached('/profile');
export const updateProfile = (data, token) => {
  clearCache(); // Invalidate cache on update
  return api.put('/profile', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Projects
export const getProjects = (featured) => getCached('/projects', featured ? { featured: true } : {});
export const getProjectBySlug = (slug) => getCached(`/projects/slug/${slug}`);
export const createProject = (data, token) => {
  clearCache();
  return api.post('/projects', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const updateProject = (id, data, token) => {
  clearCache();
  return api.put(`/projects/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const deleteProject = (id, token) => {
  clearCache();
  return api.delete(`/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Skills
export const getSkills = () => getCached('/skills');
export const createSkill = (data, token) => {
  clearCache();
  return api.post('/skills', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const updateSkill = (id, data, token) => {
  clearCache();
  return api.put(`/skills/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const deleteSkill = (id, token) => {
  clearCache();
  return api.delete(`/skills/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Blogs
export const getBlogs = (params) => getCached('/blogs', params);
export const getBlogBySlug = (slug) => getCached(`/blogs/slug/${slug}`);
export const incrementBlogViews = (id) => api.patch(`/blogs/views/${id}`);
export const createBlog = (data, token) => {
  clearCache();
  return api.post('/blogs', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const updateBlog = (id, data, token) => {
  clearCache();
  return api.put(`/blogs/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const deleteBlog = (id, token) => {
  clearCache();
  return api.delete(`/blogs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Education
export const getEducation = () => getCached('/education');
export const createEducation = (data, token) => {
  clearCache();
  return api.post('/education', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const updateEducation = (id, data, token) => {
  clearCache();
  return api.put(`/education/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const deleteEducation = (id, token) => {
  clearCache();
  return api.delete(`/education/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Experience
export const getExperience = () => getCached('/experience');
export const createExperience = (data, token) => {
  clearCache();
  return api.post('/experience', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const updateExperience = (id, data, token) => {
  clearCache();
  return api.put(`/experience/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const deleteExperience = (id, token) => {
  clearCache();
  return api.delete(`/experience/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Certifications
export const getCertifications = () => getCached('/certifications');
export const createCertification = (data, token) => {
  clearCache();
  return api.post('/certifications', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const updateCertification = (id, data, token) => {
  clearCache();
  return api.put(`/certifications/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const deleteCertification = (id, token) => {
  clearCache();
  return api.delete(`/certifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Services
export const getServices = () => getCached('/services');
export const getServiceById = (id) => getCached(`/services/${id}`);
export const createService = (data, token) => {
  clearCache();
  return api.post('/services', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const updateService = (id, data, token) => {
  clearCache();
  return api.put(`/services/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
export const deleteService = (id, token) => {
  clearCache();
  return api.delete(`/services/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Auth & Messages
export const login = (credentials) => api.post('/auth/login', credentials);
export const sendMessage = (messageData) => api.post('/messages', messageData);
export const getMessages = (token) => api.get('/messages', {
  headers: { Authorization: `Bearer ${token}` }
});
export const updateMessageStatus = (id, status, token) => {
  return api.put(`/messages/${id}`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
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
