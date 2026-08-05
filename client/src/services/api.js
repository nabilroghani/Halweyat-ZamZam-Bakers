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
  updateStatus: (id, status) => fetchAPI(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
};

export const AuthService = {
  login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => fetchAPI('/auth/me'),
  getAllUsers: () => fetchAPI('/auth/users'),
  createStaff: (staffData) => fetchAPI('/auth/create-staff', { method: 'POST', body: JSON.stringify(staffData) })
};

export const ContactService = {
  submit: (formData) => fetchAPI('/contact', { method: 'POST', body: JSON.stringify(formData) }),
  getAll: () => fetchAPI('/contact')
};

export const UserService = {
  ...AuthService,
  getAll: () => fetchAPI('/auth/users')
};
