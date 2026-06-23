import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import {
  loginApi,
  registerApi,
  getCurrentUserApi,
  getUsersApi,
  blockUserApi,
  deleteUserApi,
  editUserApi,
  getBookingsApi,
  updateBookingStatusApi,
  deleteBookingApi,
  getStatisticsApi,
  getMyBookingsApi,
  updateProfileApi,
  saveOfflineIncomeApi,
  getOfflineIncomeApi,
  getServicesApi,
  addServiceApi,
  updateServiceApi,
  deleteServiceApi
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
          setUser(res.user || res);
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

  const editUser = async (userId, userData) => {
    if (!token) throw new Error('Unauthenticated');
    const res = await editUserApi(token, userId, userData);
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

  const deleteBooking = async (bookingId) => {
    if (!token) throw new Error('Unauthenticated');
    const res = await deleteBookingApi(token, bookingId);
    return res;
  };

  const getStatistics = async () => {
    if (!token) throw new Error('Unauthenticated');
    return await getStatisticsApi(token);
  };

  const getMyBookings = async () => {
    if (!token) throw new Error('Unauthenticated');
    return await getMyBookingsApi(token);
  };

  const updateProfile = async (userData) => {
    if (!token) throw new Error('Unauthenticated');
    setLoading(true);
    try {
      const res = await updateProfileApi(token, userData);
      const updatedUser = res.user || res;
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveOfflineIncome = async (date, amount) => {
    if (!token) throw new Error('Unauthenticated');
    return await saveOfflineIncomeApi(token, date, amount);
  };

  const getOfflineIncome = async (date) => {
    if (!token) throw new Error('Unauthenticated');
    return await getOfflineIncomeApi(token, date);
  };

  const getServices = async () => {
    return await getServicesApi();
  };

  const addService = async (serviceData, file) => {
    if (!token) throw new Error('Unauthenticated');
    return await addServiceApi(token, serviceData, file);
  };

  const updateService = async (serviceId, serviceData, file) => {
    if (!token) throw new Error('Unauthenticated');
    return await updateServiceApi(token, serviceId, serviceData, file);
  };

  const deleteService = async (serviceId) => {
    if (!token) throw new Error('Unauthenticated');
    return await deleteServiceApi(token, serviceId);
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
    editUser,
    getBookings,
    updateBookingStatus,
    deleteBooking,
    getStatistics,
    getMyBookings,
    updateProfile,
    saveOfflineIncome,
    getOfflineIncome,
    getServices,
    addService,
    updateService,
    deleteService
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
