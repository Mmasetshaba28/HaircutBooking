import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      const userData = { email: data.email, role: data.role };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, role: data.role };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password) => {
    try {
      const data = await authAPI.register(email, password);
      
      // After successful registration, automatically log the user in
      return await login(email, password);
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register, // Add register function
    logout,
    isAdmin: user?.role === 'Admin',
    isCustomer: user?.role === 'Customer'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};