import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from stored token
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const res = await authService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        return res.user;
      } else {
        localStorage.removeItem('token');
        setUser(null);
        return null;
      }
    } catch (err) {
      console.warn('Auth token verification failed:', err.message);
      localStorage.removeItem('token');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Login handler
  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.token) {
      localStorage.setItem('token', res.token);
      setUser(res.user);
    }
    return res;
  };

  // Register handler
  const register = async (data) => {
    const res = await authService.register(data);
    if (res.token) {
      localStorage.setItem('token', res.token);
      setUser(res.user);
    }
    return res;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update profile handler
  const updateUser = async (updateData) => {
    const res = await authService.updateProfile(updateData);
    if (res.success && res.data) {
      setUser((prev) => ({ ...prev, ...res.data }));
    }
    return res;
  };

  // Delete account handler
  const deleteAccount = async () => {
    const res = await authService.deleteAccount();
    localStorage.removeItem('token');
    setUser(null);
    return res;
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
