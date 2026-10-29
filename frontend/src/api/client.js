const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (
    typeof window !== 'undefined' &&
    window.location.hostname &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return `http://${window.location.hostname}:5050/api`;
  }
  return (envUrl || 'http://localhost:5050/api').replace(/\/$/, '');
};

/**
 * Universal API request wrapper using standard browser fetch.
 * Automatically injects the JWT Bearer token into Authorization headers.
 * Catches 401 Unauthorized responses and purges expired sessions.
 */
async function request(endpoint, options = {}) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = localStorage.getItem('edtech_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  // Handle unauthorized responses (token expired, tampered, or missing)
  if (response.status === 401) {
    localStorage.removeItem('edtech_token');
    localStorage.removeItem('edtech_admin');
    
    // Redirect to login only if in browser environment and not already on /login
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login?expired=true';
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Public inquiry submission
  submitInquiry: (payload) =>
    request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Admin authentication
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Fetch admin profile
  getProfile: () =>
    request('/auth/me', {
      method: 'GET',
    }),

  // Admin inquiries query with multi-filter, search, and pagination
  getInquiries: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.user_type && params.user_type !== 'All') query.append('user_type', params.user_type);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    return request(`/inquiries${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  // Update inquiry status
  updateInquiryStatus: (id, status) =>
    request(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Server health check
  getHealth: () =>
    request('/health', {
      method: 'GET',
    }),
};

