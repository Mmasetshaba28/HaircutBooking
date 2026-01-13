import axios from 'axios';

const API_BASE_URL = 'http://localhost:5274/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// ✅ Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const servicesAPI = {
  getAll: () => {
    return api.get('/services')
      .then(response => response.data)
      .catch(error => {
        console.error('Failed to fetch services:', error);
        throw error;
      });
  },

  getById: (id) => {
    return api.get(`/services/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Failed to fetch service ${id}:`, error);
        throw error;
      });
  }
};

export const appointmentsAPI = {
  // ✅ For admin - gets all appointments
  getAll: () => {
    return api.get('/appointments')
      .then(response => response.data)
      .catch(error => {
        console.error('Failed to fetch appointments:', error);
        throw error;
      });
  },

  // ✅ For customers - gets only their appointments
  getMyAppointments: () => {
    return api.get('/appointments/my-appointments')
      .then(response => response.data)
      .catch(error => {
        console.error('Failed to fetch user appointments:', error);
        throw error;
      });
  },

  getById: (id) => {
    return api.get(`/appointments/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Failed to fetch appointment ${id}:`, error);
        throw error;
      });
  },

  create: (appointmentData) => {
    return api.post('/appointments', appointmentData)
      .then(response => response.data)
      .catch(error => {
        console.error('Failed to create appointment:', error);
        throw error;
      });
  },

  confirm: (id) => {
    return api.put(`/appointments/${id}/confirm`)
      .then(response => response.data)
      .catch(error => {
        console.error('Failed to confirm appointment:', error);
        throw error;
      });
  },

  complete: (id) => {
    return api.put(`/appointments/${id}/complete`)
      .then(response => response.data)
      .catch(error => {
        console.error('Failed to complete appointment:', error);
        throw error;
      });
  },

  cancel: (id) => {
    return api.put(`/appointments/${id}/cancel`)
      .then(response => response.data)
      .catch(error => {
        console.error('Failed to cancel appointment:', error);
        throw error;
      });
  },

  // ✅ Add delete method
  delete: (id) => {
    return api.delete(`/appointments/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Failed to delete appointment:', error);
        throw error;
      });
  },

  getAvailableSlots: (date, serviceId) => {
    return api.get('/appointments/available-slots', {
      params: {
        date: date.toISOString(),
        serviceId: serviceId
      }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Failed to fetch available slots:', error);
      throw error;
    });
  }
};

// ✅ Add auth API
export const authAPI = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password })
      .then(response => response.data)
      .catch(error => {
        console.error('Login failed:', error);
        throw error;
      });
  },

  register: (email, password) => {
    return api.post('/auth/register', { email, password })
      .then(response => response.data)
      .catch(error => {
        console.error('Registration failed:', error);
        throw error;
      });
  }
};

export default api;