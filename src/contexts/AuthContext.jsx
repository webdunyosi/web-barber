import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import {
  loginApi,
  registerApi,
  getCurrentUserApi,
  getUsersApi,
  blockUserApi,
  deleteUserApi,
  getBookingsApi,
  updateBookingStatusApi,
  getStatisticsApi
} from '../utils/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('barber_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user details when token changes or app loads
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await getCurrentUserApi(token);
          setUser(res.user);
        } catch (err) {
          console.error('Auth check error:', err);
          // Token expired or invalid
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (phone, password) => {
    setLoading(true);
    try {
      const res = await loginApi(phone, password);
      localStorage.setItem('barber_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await registerApi(userData);
      localStorage.setItem('barber_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('barber_token');
    setToken(null);
    setUser(null);
  };

  // Admin Actions
  const getUsers = async () => {
    if (!token) throw new Error('Unauthenticated');
    return await getUsersApi(token);
  };

  const blockUser = async (userId, isBlocked) => {
    if (!token) throw new Error('Unauthenticated');
    const res = await blockUserApi(token, userId, isBlocked);
    return res;
  };

  const deleteUser = async (userId) => {
    if (!token) throw new Error('Unauthenticated');
    const res = await deleteUserApi(token, userId);
    return res;
  };

  const getBookings = async () => {
    if (!token) throw new Error('Unauthenticated');
    return await getBookingsApi(token);
  };

  const updateBookingStatus = async (bookingId, status) => {
    if (!token) throw new Error('Unauthenticated');
    const res = await updateBookingStatusApi(token, bookingId, status);
    return res;
  };

  const getStatistics = async () => {
    if (!token) throw new Error('Unauthenticated');
    return await getStatisticsApi(token);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    getUsers,
    blockUser,
    deleteUser,
    getBookings,
    updateBookingStatus,
    getStatistics
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
