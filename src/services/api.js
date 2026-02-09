import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Response interceptor for handling 401s and other global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 Unauthorized (and it's not the login request itself)
    if (error.response && error.response.status === 401 && !error.config.url.includes('/auth/login')) {
      console.warn('Session expired or invalid token. Redirecting to login...');
      localStorage.removeItem('userInfo');

      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Simple persistent cache for GET requests
const CACHE_KEY_PREFIX = 'api_cache_';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for persistence

const getCached = async (url, params = {}, options = {}) => {
  const { forceRefresh = false, persist = true } = options;
  const cacheKey = CACHE_KEY_PREFIX + JSON.stringify({ url, params });

  // Try to get from localStorage first for persistence
  const cachedItem = localStorage.getItem(cacheKey);
  let cachedData = null;

  if (cachedItem) {
    const { data, timestamp } = JSON.parse(cachedItem);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    if (!isExpired && !forceRefresh) {
      return data;
    }
    // If expired or forceRefresh, we'll still return cachedData for SWR if available
    cachedData = data;
  }

  // Fetch function to be used for background refresh or initial fetch
  const fetchData = async () => {
    try {
      const response = await api.get(url, { params });
      if (persist) {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: response,
          timestamp: Date.now()
        }));
      }
      return response;
    } catch (error) {
      console.error(`API Error for ${url}:`, error);
      throw error;
    }
  };

  // SWR Pattern: If we have cached data, return it immediately and fetch in background
  if (cachedData && !forceRefresh) {
    fetchData().catch(err => console.error("SWR Background Refresh Failed", err));
    return cachedData;
  }

  return fetchData();
};

// Function to clear all cache
const clearCache = () => {
  Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_KEY_PREFIX))
    .forEach(key => localStorage.removeItem(key));
};

// Consolidated Home Data
export const getHomeData = (forceRefresh = false) => getCached('/home', {}, { forceRefresh });


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
