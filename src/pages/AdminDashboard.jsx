import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FaUser,
  FaCheck,
  FaTimes,
  FaBan,
  FaTrash,
  FaUserSlash,
  FaChartBar,
  FaCalendarCheck,
  FaFolderOpen,
  FaDollarSign,
  FaUserPlus,
  FaCalendarAlt,
  FaSearch,
  FaTimesCircle,
  FaEye,
  FaSync,
  FaSignOutAlt
} from 'react-icons/fa';
import { formatPrice } from '../utils/format';

const AdminDashboard = () => {
  const {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    logout,
    getUsers,
    blockUser,
    deleteUser,
    getBookings,
    updateBookingStatus,
    getStatistics
  } = useAuth();

  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'statistics';

  const [usersList, setUsersList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [stats, setStats] = useState(null);

  // Filters & UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all'); // 'all' | 'active' | 'blocked'
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all'); // 'all' | 'pending' | 'confirmed' | 'rejected'
  const [zoomedReceipt, setZoomedReceipt] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // stores item ID currently updating

  const loadData = async () => {
    setIsDataLoading(true);
    try {
      const [usersData, bookingsData, statsData] = await Promise.all([
        getUsers(),
        getBookings(),
        getStatistics()
      ]);
      
      // Sort users: newest first. Exclude current admin to prevent self-deletion
      const cleanUsers = Array.isArray(usersData)
        ? usersData.filter(u => u && u.id !== user?.id && u._id !== user?.id)
        : [];
      const sortedUsers = cleanUsers.sort((a, b) => {
        const dateB = b && b.createdAt ? new Date(b.createdAt) : new Date(0);
        const dateA = a && a.createdAt ? new Date(a.createdAt) : new Date(0);
        return dateB - dateA;
      });
      setUsersList(sortedUsers);

      // Sort bookings: newest first
      const cleanBookings = Array.isArray(bookingsData)
        ? bookingsData.filter(b => b !== null && b !== undefined)
        : [];
      const sortedBookings = cleanBookings.sort((a, b) => {
        const dateB = b && b.createdAt ? new Date(b.createdAt) : new Date(0);
        const dateA = a && a.createdAt ? new Date(a.createdAt) : new Date(0);
        return dateB - dateA;
      });
      setBookingsList(sortedBookings);
      setStats(statsData);
    } catch (error) {
      console.error('Admin data loading error:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab]);

  // User Actions handlers
  const handleBlockUser = async (targetUserId, currentStatus) => {
    setActionLoading(targetUserId);
    const newBlockedState = currentStatus !== 'blocked';
    try {
      await blockUser(targetUserId, newBlockedState);
      await loadData();
    } catch (err) {
      alert(err.message || 'Xatolik yuz berdi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (targetUserId) => {
    if (!window.confirm("Foydalanuvchini o'chirishni tasdiqlaysizmi?")) return;
    setActionLoading(targetUserId);
    try {
      await deleteUser(targetUserId);
      await loadData();
    } catch (err) {
      alert(err.message || 'Xatolik yuz berdi');
    } finally {
      setActionLoading(null);
    }
  };

  // Booking Actions handlers
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    setActionLoading(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      await loadData();
    } catch (err) {
      alert(err.message || 'Xatolik yuz berdi');
    } finally {
      setActionLoading(null);
    }
  };

  // Filtering Logic
  const filteredUsers = usersList.filter(u => {
    if (!u) return false;
    const matchSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (u.phone || '').includes(searchTerm);
    if (userStatusFilter === 'all') return matchSearch;
    return matchSearch && u.status === userStatusFilter;
  });

  const filteredBookings = bookingsList.filter(b => {
    if (!b) return false;
    const matchSearch = (b.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (b.phone || '').includes(searchTerm) || 
                        (b.serviceName || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (bookingStatusFilter === 'all') return matchSearch;
    return matchSearch && b.status === bookingStatusFilter;
  });

  return (
    <div className="w-full pb-16 text-white">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold bg-linear-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent uppercase tracking-wider">
            Boshqaruv Markazi
          </h2>
          <p className="text-gray-400 text-sm mt-1">Foydalanuvchilar, buyurtmalar va kunlik tushumlarni real vaqt rejimida boshqarish</p>
        </div>
        
        {/* Header Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isDataLoading}
            className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/80 text-white font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FaSync size={13} className={isDataLoading ? 'animate-spin' : ''} />
            {isDataLoading ? 'Yangilanmoqda...' : 'Yangilash'}
          </button>
        </div>
      </div>



      {/* Loading Overlay inside tabs */}
      {isDataLoading && !stats ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin"></div>
        </div>
      ) : (
        <div>
          {/* ================= TAB: BOOKINGS ================= */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Filters Panel */}
              <div className="flex flex-col md:flex-row gap-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 backdrop-blur-sm">
                {/* Search */}
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <FaSearch size={14} />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Mijoz ismi, telefon raqami yoki xizmat nomi..."
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  />
                </div>
                {/* Status select */}
                <div className="w-full md:w-56">
                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-white"
                  >
                    <option value="all">Barcha holatlar</option>
                    <option value="pending">Kutilmoqda (Tasdiqlanmagan)</option>
                    <option value="confirmed">Tasdiqlangan</option>
                    <option value="rejected">Rad etilgan</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table / Cards */}
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl">
                  <FaFolderOpen className="mx-auto text-4xl text-zinc-600 mb-3" />
                  <p className="text-gray-400 text-sm">Hech qanday buyurtma topilmadi.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.id || booking._id}
                      className={`relative bg-zinc-900/50 border rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm flex flex-col md:flex-row justify-between gap-6 hover:border-zinc-700 ${
                        booking.status === 'pending'
                          ? 'border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5'
                          : booking.status === 'confirmed'
                          ? 'border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5'
                          : 'border-zinc-800'
                      }`}
                    >
                      {/* Left: Client details & Service */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-xl font-bold">{booking.name}</h4>
                          <span className="text-sm text-zinc-400 font-mono">{booking.phone}</span>
                          {booking.telegram_user && (
                            <a
                              href={`https://t.me/${booking.telegram_user}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded-full hover:bg-blue-500/25 transition-colors"
                            >
                              @{booking.telegram_user}
                            </a>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/5 pt-4">
                          <div>
                            <p className="text-xs text-zinc-500 uppercase font-semibold">Xizmat</p>
                            <p className="font-bold text-white mt-0.5">{booking.serviceName}</p>
                            <p className="text-sm text-emerald-400 font-extrabold mt-0.5">
                              {formatPrice(booking.servicePrice)} so'm
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500 uppercase font-semibold">Sana va vaqt</p>
                            <p className="font-semibold text-zinc-200 mt-0.5 flex items-center gap-1.5">
                              <FaCalendarAlt className="text-emerald-500 text-xs" />
                              {booking.date}
                            </p>
                            <p className="text-sm font-bold text-zinc-300 mt-0.5">
                              ⏱ Soat {booking.time}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500 uppercase font-semibold">Holati</p>
                            <span className={`inline-block text-xs font-extrabold uppercase px-2.5 py-1 rounded-full mt-1.5 ${
                              booking.status === 'pending'
                                ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                                : booking.status === 'confirmed'
                                ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30'
                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}>
                              {booking.status === 'pending' && 'Kutilmoqda'}
                              {booking.status === 'confirmed' && 'Tasdiqlangan'}
                              {booking.status === 'rejected' && 'Rad etilgan'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Receipt Image & Actions */}
                      <div className="flex flex-col sm:flex-row md:flex-col items-center justify-between gap-4 md:border-l md:border-white/5 md:pl-6 shrink-0 min-w-[150px]">
                        {/* Receipt Thumbnail */}
                        {booking.receipt && (
                          <div className="relative group overflow-hidden rounded-xl border border-zinc-700 w-28 h-20 shrink-0 bg-zinc-950">
                            <img
                              src={booking.receipt}
                              alt="Receipt"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <button
                              onClick={() => setZoomedReceipt(booking.receipt)}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1 text-xs font-bold text-white cursor-pointer border-none"
                            >
                              <FaEye size={12} />
                              <span>Chekni ko'rish</span>
                            </button>
                          </div>
                        )}

                        {/* Actions */}
                        {booking.status === 'pending' ? (
                          <div className="flex gap-2 w-full">
                            <button
                              disabled={actionLoading === (booking.id || booking._id)}
                              onClick={() => handleUpdateBookingStatus(booking.id || booking._id, 'confirmed')}
                              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-3 rounded-xl text-xs transition-all active:scale-[0.97] flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer border-none"
                            >
                              <FaCheck size={10} /> Tasdiqlash
                            </button>
                            <button
                              disabled={actionLoading === (booking.id || booking._id)}
                              onClick={() => handleUpdateBookingStatus(booking.id || booking._id, 'rejected')}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-xl text-xs transition-all active:scale-[0.97] flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer border-none"
                            >
                              <FaTimes size={10} /> Rad etish
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={actionLoading === (booking.id || booking._id)}
                            onClick={() => handleUpdateBookingStatus(booking.id || booking._id, 'pending')}
                            className="w-full text-center text-xs text-white/40 hover:text-white hover:underline transition-colors disabled:opacity-50 bg-transparent border-none cursor-pointer"
                          >
                            Kutilmoqda holatiga qaytarish
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: USERS ================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Filters Panel */}
              <div className="flex flex-col md:flex-row gap-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                    <FaSearch size={14} />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Mijoz ismi yoki telefon raqami..."
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="w-full md:w-56">
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-white"
                  >
                    <option value="all">Barcha foydalanuvchilar</option>
                    <option value="active">Faollar</option>
                    <option value="blocked">Bloklanganlar</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl">
                  <FaUserSlash className="mx-auto text-4xl text-zinc-600 mb-3" />
                  <p className="text-gray-400 text-sm">Hech qanday mijoz topilmadi.</p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400">
                        <th className="p-4 pl-6">Foydalanuvchi</th>
                        <th className="p-4">Telefon</th>
                        <th className="p-4">Telegram</th>
                        <th className="p-4">Ro'yxatdan o'tdi</th>
                        <th className="p-4">Holat</th>
                        <th className="p-4 pr-6 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {filteredUsers.map((client) => (
                        <tr
                          key={client.id || client._id}
                          className="hover:bg-zinc-800/20 transition-colors text-sm"
                        >
                          <td className="p-4 pl-6 font-semibold flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-750 flex items-center justify-center font-bold text-xs uppercase text-zinc-300">
                              {(client.name || 'M').charAt(0)}
                            </div>
                            <span>{client.name}</span>
                          </td>
                          <td className="p-4 font-mono text-zinc-300">{client.phone}</td>
                          <td className="p-4">
                            {client.telegram ? (
                              <a
                                href={`https://t.me/${client.telegram}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 hover:underline hover:text-emerald-300"
                              >
                                @{client.telegram}
                              </a>
                            ) : (
                              <span className="text-zinc-650">-</span>
                            )}
                          </td>
                          <td className="p-4 text-zinc-400">
                            {new Date(client.createdAt).toLocaleDateString('uz-UZ')}
                          </td>
                          <td className="p-4">
                            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                              client.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                                : 'bg-red-500/10 text-red-400 border border-red-500/25'
                            }`}>
                              {client.status === 'active' ? 'Faol' : 'Bloklangan'}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Block toggle */}
                              <button
                                disabled={actionLoading === (client.id || client._id)}
                                onClick={() => handleBlockUser(client.id || client._id, client.status)}
                                className={`p-2 rounded-lg border transition-all active:scale-95 cursor-pointer ${
                                  client.status === 'active'
                                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/25'
                                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25'
                                }`}
                                title={client.status === 'active' ? 'Bloklash' : 'Blokdan chiqarish'}
                              >
                                <FaBan size={12} />
                              </button>
                              {/* Delete */}
                              <button
                                disabled={actionLoading === (client.id || client._id)}
                                onClick={() => handleDeleteUser(client.id || client._id)}
                                className="p-2 bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/25 rounded-lg transition-all active:scale-95 cursor-pointer"
                                title="O'chirish"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: STATISTICS ================= */}
          {activeTab === 'statistics' && stats && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Daily income */}
                <div className="bg-zinc-900/60 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Kunlik Daromad</p>
                    <h3 className="text-2xl font-bold text-emerald-400">{formatPrice(stats.dailyRevenue)} so'm</h3>
                    <p className="text-xxs text-zinc-500 font-medium">Oxirgi 24 soatlik tasdiqlanganlar</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaDollarSign size={20} />
                  </div>
                </div>

                {/* Weekly income */}
                <div className="bg-zinc-900/60 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Haftalik Daromad</p>
                    <h3 className="text-2xl font-bold text-white">{formatPrice(stats.weeklyRevenue)} so'm</h3>
                    <p className="text-xxs text-emerald-400/80 font-semibold">Haftalik jami tushum</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaChartBar size={20} />
                  </div>
                </div>

                {/* Monthly income */}
                <div className="bg-zinc-900/60 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Oylik Daromad</p>
                    <h3 className="text-2xl font-bold text-white">{formatPrice(stats.monthlyRevenue)} so'm</h3>
                    <p className="text-xxs text-zinc-500">Oxirgi 30 kunlik tushum</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaDollarSign size={20} />
                  </div>
                </div>

                {/* Users Count */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Jami Mijozlar</p>
                    <h3 className="text-2xl font-bold text-white">
                      {stats.totalUsers} <span className="text-sm font-normal text-zinc-400">ta faol</span>
                    </h3>
                    <p className="text-xxs text-red-400 font-semibold">{stats.blockedUsersCount} blocked/begona</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                    <FaUserPlus size={20} />
                  </div>
                </div>
              </div>

              {/* Charts Panel: SVG Trend Line Chart & Popular Services */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Revenue Chart (2/3 width) */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="text-emerald-500">📈</span>
                    Kunlik Tushum Trendlari (Oxirgi 7 kun)
                  </h4>
                  
                  {/* SVG Chart */}
                  <div className="relative h-64 w-full">
                    {/* Y-axis helper grids */}
                    <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none pr-2">
                      <div className="border-b border-white/5 w-full h-0"></div>
                      <div className="border-b border-white/5 w-full h-0"></div>
                      <div className="border-b border-white/5 w-full h-0"></div>
                      <div className="border-b border-white/5 w-full h-0"></div>
                    </div>

                    {/* SVG canvas */}
                    <svg className="w-full h-full pt-4 pb-8" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area beneath the curve */}
                      {stats.chartData && stats.chartData.length > 0 && (
                        <polygon
                          points={`
                            0,100
                            ${stats.chartData.map((d, index) => {
                              const x = (index / (stats.chartData.length - 1)) * 100;
                              const maxVal = Math.max(...stats.chartData.map(c => c.value)) || 100000;
                              const y = 100 - (d.value / maxVal) * 80;
                              return `${x},${y}`;
                            }).join(' ')}
                            100,100
                          `}
                          fill="url(#chartGradient)"
                        />
                      )}

                      {/* Line connecting the points */}
                      {stats.chartData && stats.chartData.length > 0 && (
                        <polyline
                          points={stats.chartData.map((d, index) => {
                            const x = (index / (stats.chartData.length - 1)) * 100;
                            const maxVal = Math.max(...stats.chartData.map(c => c.value)) || 100000;
                            const y = 100 - (d.value / maxVal) * 80;
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}

                      {/* Dynamic Point circles */}
                      {stats.chartData && stats.chartData.map((d, index) => {
                        const x = (index / (stats.chartData.length - 1)) * 100;
                        const maxVal = Math.max(...stats.chartData.map(c => c.value)) || 100000;
                        const y = 100 - (d.value / maxVal) * 80;
                        return (
                          <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="1.5"
                            fill="#059669"
                            stroke="#ffffff"
                            strokeWidth="0.5"
                          />
                        );
                      })}
                    </svg>

                    {/* Chart Labels under X axis */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-zinc-500 font-bold text-xxs mt-2 pointer-events-none">
                      {stats.chartData && stats.chartData.map((d, index) => (
                        <div key={index} className="text-center w-12 truncate">
                          {d.label.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sparkline analytics information */}
                  <div className="mt-4 border-t border-white/5 pt-4 flex justify-between items-center text-xs text-zinc-400">
                    <span>Maksimal kunlik: <strong className="text-white">{(stats.chartData && stats.chartData.length > 0 ? Math.max(...stats.chartData.map(c => c.value)) : 0).toLocaleString()} so'm</strong></span>
                    <span>Tasdiqlangan buyurtmalar summasi ko'rsatiladi</span>
                  </div>
                </div>

                {/* 2. Popular Services (1/3 width) */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="text-emerald-500">💈</span>
                      Eng Ommabop Xizmatlar
                    </h4>

                    {/* Popular Services List */}
                    <div className="space-y-4">
                      {stats.popularServices && stats.popularServices.map((service, index) => {
                        // Calculate percentage of total bookings
                        const totalCounts = stats.popularServices.reduce((sum, s) => sum + s.count, 0) || 1;
                        const pct = Math.round((service.count / totalCounts) * 100);

                        return (
                          <div key={service.name} className="space-y-1.5">
                            <div className="flex justify-between items-center text-sm">
                              <span className="font-semibold text-zinc-300 truncate max-w-[150px]">
                                {index + 1}. {service.name}
                              </span>
                              <span className="font-bold text-white">{service.count} ta</span>
                            </div>
                            
                            {/* Glassmorphic progress bar */}
                            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden border border-white/5">
                              <div
                                style={{ width: `${pct}%` }}
                                className="bg-linear-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-1000"
                              ></div>
                            </div>
                            
                            <div className="flex justify-between text-xxs text-zinc-500">
                              <span>Tegishli ulush: {pct}%</span>
                              <span className="text-emerald-400/80 font-bold">{(service.revenue || 0).toLocaleString()} so'm</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-4 mt-6 text-center text-xs text-zinc-500">
                    Jami ko'rsatilgan xizmatlar: <strong className="text-white">{stats.totalBookings} ta</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: PROFILE ================= */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
              {/* Profile Card */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl text-center space-y-6 relative overflow-hidden">
                {/* Glowing decorative border */}
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 to-green-500"></div>

                {/* Avatar */}
                <div className="relative w-28 h-28 mx-auto">
                  <div className="w-full h-full rounded-full bg-zinc-800 border-2 border-emerald-500/30 flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-500/5">
                    <img 
                      src="/avatar/men.png" 
                      alt="Admin Avatar" 
                      className="w-24 h-24 rounded-full object-cover border border-emerald-500/20" 
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center text-[10px]" title="Online">
                    ✓
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">{user?.name || 'Administrator'}</h3>
                  <p className="text-emerald-400 font-bold text-sm tracking-wider uppercase">Sartarosh (Administrator)</p>
                </div>

                {/* Info List */}
                <div className="border-t border-b border-white/5 py-4 my-2 text-left space-y-3 font-medium text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Telefon raqami:</span>
                    <span className="text-zinc-200 font-mono font-semibold">{user?.phone || '+998 99 999 99 99'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Telegram:</span>
                    <span className="text-emerald-400 font-semibold">@{user?.telegram || 'kiritilmagan'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Boshqaruv roli:</span>
                    <span className="text-zinc-200 font-semibold">Bosh Admin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Holati:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">Faol</span>
                  </div>
                </div>

                {/* Logout Action */}
                <button
                  onClick={logout}
                  className="w-full bg-red-500/10 border border-red-500/25 hover:bg-red-500/25 text-red-400 hover:text-red-300 font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt size={16} />
                  <span>Tizimdan chiqish</span>
                </button>
              </div>

              {/* Server Details & Guidance */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm text-xs text-zinc-500 leading-relaxed space-y-3">
                <h4 className="font-bold text-zinc-400 text-sm">Boshqaruv Tizimi Bo'yicha Yo'riqnoma:</h4>
                <p>1. <strong>Moliya & Statistika:</strong> Kunlik, haftalik va oylik tushumlarni hamda ommabop xizmatlar taqsimotini nazorat qilish.</p>
                <p>2. <strong>Buyurtmalar:</strong> Mijozlar tomonidan yuklangan to'lov cheklarini tekshirish, tasdiqlash yoki rad etish.</p>
                <p>3. <strong>Mijozlar:</strong> Ro'yxatdan o'tgan mijozlarni bloklash yoki o'chirish.</p>
                <p className="text-emerald-500/70 font-semibold border-t border-white/5 pt-3 mt-1 text-center">Tizim holati: Real vaqt rejimi (MongoDB ulanishi faol)</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Photo zoom overlay modal */}
      {zoomedReceipt && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[150] p-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setZoomedReceipt(null)}></div>
          
          <div className="relative max-w-xl w-full flex flex-col items-center z-10 animate-bounce-in">
            {/* Header info */}
            <div className="w-full flex justify-between items-center mb-3 bg-zinc-950/70 p-3 rounded-xl border border-white/5 backdrop-blur-md">
              <span className="text-sm font-semibold">To'lov chekini ko'rish</span>
              <button
                onClick={() => setZoomedReceipt(null)}
                className="text-white hover:text-emerald-400 transition-colors p-1 bg-transparent border-none cursor-pointer"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>
            {/* Large receipt picture */}
            <img
              src={zoomedReceipt}
              alt="Zoomed Receipt"
              className="max-h-[75vh] object-contain rounded-2xl border border-emerald-500/30 shadow-2xl bg-zinc-900"
            />
            
            <p className="mt-4 text-xs text-zinc-400 text-center">Yopish uchun rasm atrofidagi joyga yoki yuqoridagi yopish tugmasiga bosing</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
