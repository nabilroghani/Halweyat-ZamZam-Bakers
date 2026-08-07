const API_BASE_URL = 'http://localhost:5000/api';

export const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('zamzam_auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
};

// API Services
export const ProductService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/products?${query}`);
  },
  getById: (id) => fetchAPI(`/products/${id}`),
  create: (data) => fetchAPI('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleStock: (id) => fetchAPI(`/products/${id}/toggle-stock`, { method: 'PATCH' }),
  delete: (id) => fetchAPI(`/products/${id}`, { method: 'DELETE' })
};

export const CategoryService = {
  getAll: () => fetchAPI('/categories'),
  create: (data) => fetchAPI('/categories', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/categories/${id}`, { method: 'DELETE' })
};

export const OrderService = {
  create: (orderData) => fetchAPI('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/orders?${query}`);
  },
  getMyOrders: () => fetchAPI('/orders/my-orders'),
  track: (queryStr) => fetchAPI(`/orders/track/${queryStr}`),
  updateStatus: (id, status, cancelReason = '') => fetchAPI(`/orders/${id}/status`, { 
    method: 'PATCH', 
    body: JSON.stringify({ status, cancelReason }) 
  })
};

export const AuthService = {
  login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  verifyOtp: (otpData) => fetchAPI('/auth/verify-otp', { method: 'POST', body: JSON.stringify(otpData) }),
  resendOtp: (otpData) => fetchAPI('/auth/resend-otp', { method: 'POST', body: JSON.stringify(otpData) }),
  forgotPassword: (data) => fetchAPI('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data) => fetchAPI('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  googleLogin: (payload) => fetchAPI('/auth/google', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => fetchAPI('/auth/me'),
  verifyToken: () => fetchAPI('/auth/verify-token'),
  getAllUsers: () => fetchAPI('/auth/users'),
  createStaff: (staffData) => fetchAPI('/auth/create-staff', { method: 'POST', body: JSON.stringify(staffData) }),
  updateProfile: (profileData) => fetchAPI('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  getFavorites: () => fetchAPI('/auth/favorites'),
  toggleFavorite: (productId) => fetchAPI('/auth/favorites/toggle', { method: 'POST', body: JSON.stringify({ productId }) })
};

export const ContactService = {
  submit: (formData) => fetchAPI('/contact', { method: 'POST', body: JSON.stringify(formData) }),
  getAll: () => fetchAPI('/contact')
};

export const UserService = {
  ...AuthService,
  getAll: () => fetchAPI('/auth/users')
};

export const BannerService = {
  getAll: (all = false) => fetchAPI(`/banners${all ? '?all=true' : ''}`),
  create: (data) => fetchAPI('/banners', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchAPI(`/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggle: (id) => fetchAPI(`/banners/${id}/toggle`, { method: 'PATCH' }),
  delete: (id) => fetchAPI(`/banners/${id}`, { method: 'DELETE' })
};

