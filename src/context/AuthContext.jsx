import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('unisphere_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getProfile();
          setUser(res.data);
        } catch (err) {
          console.error('Error fetching user profile:', err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      const { user: userData, token: userToken } = res.data;
      localStorage.setItem('unisphere_token', userToken);
      localStorage.setItem('unisphere_user', JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (err) {
      throw err.response?.data?.message || 'Login failed. Please check your credentials.';
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role, department, interests) => {
    setLoading(true);
    try {
      const res = await authAPI.register({ name, email, password, role, department, interests });
      const { user: userData, token: userToken } = res.data;
      localStorage.setItem('unisphere_token', userToken);
      localStorage.setItem('unisphere_user', JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (err) {
      throw err.response?.data?.message || 'Registration failed. Please try again.';
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authAPI.updateProfile(profileData);
      setUser(res.data);
      localStorage.setItem('unisphere_user', JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Profile update failed.';
    }
  };

  const logout = () => {
    localStorage.removeItem('unisphere_token');
    localStorage.removeItem('unisphere_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
