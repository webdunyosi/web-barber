import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  FaUser,
  FaUsers,
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
  FaEyeSlash,
  FaSync,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBell,
  FaPhone,
  FaPaperPlane,
  FaUserShield,
  FaEdit,
  FaSave,
  FaSpinner,
  FaChevronDown,
  FaChevronRight,
  FaArrowLeft,
  FaYoutube,
  FaPlay,
  FaBookOpen,
  FaChartLine,
  FaCut,
  FaWallet,
  FaCog,
  FaBolt,
  FaBullhorn,
  FaHistory,
  FaDownload,
  FaImage,
  FaComment,
  FaClock,
  FaMoneyBillWave,
  FaCreditCard,
  FaPaperclip,
  FaLink,
  FaGift,
  FaCheckCircle,
  FaPlus,
  FaCoins,
  FaLock,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { formatPrice } from '../utils/format';
import { getNotificationsApi, createNotificationApi, deleteNotificationApi, updateNotificationApi, createUserApi, getBlockedSchedulesApi, saveBlockedScheduleApi, deleteBlockedScheduleApi } from '../utils/api';
import ConfirmModal from '../components/common/ConfirmModal';
import EditUserModal from '../components/common/EditUserModal';

// ================= SKELETON LOADERS =================

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-3 flex-1 pr-4">
            <div className="h-3 w-1/2 bg-zinc-800 rounded"></div>
            <div className="h-7 w-3/4 bg-zinc-800 rounded"></div>
            <div className="h-2.5 w-2/3 bg-zinc-800 rounded"></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-zinc-800/80 shrink-0"></div>
        </div>
      ))}
    </div>

    {/* Quick Actions & Recent Pending Bookings */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Pending Bookings */}
      <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-6 space-y-4">
        <div className="h-5 w-1/3 bg-zinc-800 rounded"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-zinc-950/20 border border-zinc-800/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                  <div className="h-3.5 w-20 bg-zinc-800 rounded"></div>
                </div>
                <div className="h-3.5 w-1/2 bg-zinc-800 rounded"></div>
                <div className="h-3 w-1/3 bg-zinc-800 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-zinc-800 rounded-lg"></div>
                <div className="h-8 w-20 bg-zinc-800 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Stats Summary */}
      <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-6 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="h-5 w-1/2 bg-zinc-800 rounded"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                <div className="h-3.5 w-1/3 bg-zinc-800 rounded"></div>
                <div className="h-3.5 w-12 bg-zinc-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-10 w-full bg-zinc-800 rounded-xl"></div>
      </div>
    </div>
  </div>
);

const BookingsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Filters Panel */}
    <div className="flex flex-col md:flex-row gap-4 bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-4">
      <div className="flex-1 h-11 bg-zinc-800/50 rounded-xl"></div>
      <div className="w-full md:w-56 h-11 bg-zinc-800/50 rounded-xl"></div>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-6 w-32 bg-zinc-800 rounded"></div>
              <div className="h-5 w-24 bg-zinc-800 rounded"></div>
              <div className="h-5 w-16 bg-zinc-800 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/5 pt-4">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-zinc-800 rounded"></div>
                <div className="h-4 w-28 bg-zinc-800 rounded"></div>
                <div className="h-3.5 w-20 bg-zinc-800 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-zinc-800 rounded"></div>
                <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                <div className="h-3.5 w-16 bg-zinc-800 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-12 bg-zinc-800 rounded"></div>
                <div className="h-6 w-20 bg-zinc-800 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col items-center justify-between gap-4 md:border-l md:border-white/5 md:pl-6 shrink-0 min-w-[150px]">
            <div className="w-28 h-20 bg-zinc-800 rounded-xl"></div>
            <div className="w-full h-8 bg-zinc-800 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UsersSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Filters Panel */}
    <div className="flex flex-col md:flex-row gap-4 bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-4">
      <div className="flex-1 h-11 bg-zinc-800/50 rounded-xl"></div>
      <div className="w-full md:w-56 h-11 bg-zinc-800/50 rounded-xl"></div>
    </div>

    {/* Table */}
    <div className="overflow-x-auto bg-zinc-900/30 border border-zinc-800/40 rounded-2xl">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <th className="p-4 pl-6">Foydalanuvchi</th>
            <th className="p-4">Telefon</th>
            <th className="p-4">Telegram</th>
            <th className="p-4">Ro'yxatdan o'tdi</th>
            <th className="p-4">Holat</th>
            <th className="p-4 pr-6 text-right">Amallar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-850">
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="text-sm">
              <td className="p-4 pl-6 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0"></div>
                <div className="h-4 w-28 bg-zinc-800 rounded"></div>
              </td>
              <td className="p-4">
                <div className="h-4 w-24 bg-zinc-800 rounded"></div>
              </td>
              <td className="p-4">
                <div className="h-4 w-20 bg-zinc-800 rounded"></div>
              </td>
              <td className="p-4">
                <div className="h-4 w-16 bg-zinc-800 rounded"></div>
              </td>
              <td className="p-4">
                <div className="h-5 w-14 bg-zinc-800 rounded-full"></div>
              </td>
              <td className="p-4 pr-6 text-right">
                <div className="flex justify-end gap-2">
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg"></div>
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StatisticsSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart */}
      <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-6 space-y-6">
        <div className="h-5 w-1/3 bg-zinc-800 rounded"></div>
        <div className="h-64 bg-zinc-800/40 rounded-xl relative"></div>
        <div className="flex justify-between pt-4 border-t border-white/5">
          <div className="h-4 w-1/3 bg-zinc-800 rounded"></div>
          <div className="h-4 w-1/4 bg-zinc-800 rounded"></div>
        </div>
      </div>

      {/* Popular services */}
      <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-6 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="h-5 w-1/2 bg-zinc-800 rounded"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-1/3 bg-zinc-800 rounded"></div>
                  <div className="h-4 w-10 bg-zinc-800 rounded"></div>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full"></div>
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-zinc-800 rounded"></div>
                  <div className="h-3 w-12 bg-zinc-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-4 w-2/3 bg-zinc-800 rounded mx-auto"></div>
      </div>
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="max-w-xl mx-auto space-y-6 animate-pulse">
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-6 md:p-8 flex flex-col items-center space-y-6">
      <div className="w-28 h-28 rounded-full bg-zinc-800"></div>
      <div className="space-y-2 text-center w-full flex flex-col items-center">
        <div className="h-6 w-40 bg-zinc-800 rounded"></div>
        <div className="h-4 w-32 bg-zinc-800 rounded"></div>
      </div>
      <div className="border-t border-b border-white/5 py-4 w-full space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-24 bg-zinc-800 rounded"></div>
            <div className="h-4 w-32 bg-zinc-800 rounded"></div>
          </div>
        ))}
      </div>
      <div className="h-12 w-full bg-zinc-805 rounded-xl"></div>
    </div>
    <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-2xl p-6 space-y-3">
      <div className="h-4 w-1/3 bg-zinc-800 rounded"></div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-zinc-800 rounded"></div>
        <div className="h-3 w-5/6 bg-zinc-800 rounded"></div>
        <div className="h-3 w-4/5 bg-zinc-800 rounded"></div>
      </div>
    </div>
  </div>
);

const tutorialsList = [
  {
    id: 'tut1',
    youtubeId: '6HPVo-X5qg0',
    title: "Botga kirish",
    description: "Botga kirish va dasturni ochishning 3 xil usuli bo'yicha yo'riqnoma.",
    duration: "01:00"
  }
];

const formatSubscriptionExpiry = (expiryDateStr) => {
  if (!expiryDateStr) return { dateFormatted: "Kiritilmagan", badgeText: "", expired: true, daysLeft: 0 };
  
  const expiryDate = new Date(expiryDateStr);
  const now = new Date();
  
  // Set times to midnight to calculate pure day difference
  const date1 = Date.UTC(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate());
  const date2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const daysDiff = Math.ceil((date1 - date2) / (1000 * 3600 * 24));
  
  const day = expiryDate.getDate();
  const monthIndex = expiryDate.getMonth();
  const year = expiryDate.getFullYear();
  
  const monthsUz = [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
  ];
  
  const monthName = monthsUz[monthIndex];
  const dateFormatted = `${day}-${monthName} ${year}-yil`;
  
  let badgeText = "";
  let expired = false;
  
  if (daysDiff > 0) {
    badgeText = `${daysDiff} kun qoldi`;
    expired = false;
  } else if (daysDiff === 0) {
    badgeText = `Bugun tugaydi`;
    expired = false;
  } else {
    badgeText = `Muddati o'tgan (${Math.abs(daysDiff)} kun avval)`;
    expired = true;
  }
  
  return { dateFormatted, badgeText, expired, daysLeft: daysDiff };
};

const handleDownloadImage = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'check.jpg');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Rasm yuklab olishda xatolik:", error);
    window.open(imageUrl, '_blank');
  }
};

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
    editUser,
    getBookings,
    updateBookingStatus,
    deleteBooking,
    getStatistics,
    saveOfflineIncome,
    updateProfile,
    token,
    getServices,
    addService,
    updateService,
    deleteService,
    getMySubscription
  } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const isSubscriptionExpired = user?.role === 'admin' && (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) < new Date());
  const activeTab = isSubscriptionExpired ? 'subscription' : (searchParams.get('tab') || 'dashboard');

  const [mySubscription, setMySubscription] = useState({ subscriptionExpiresAt: null, payments: [] });
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user?.role === 'admin' && token) {
        setSubscriptionLoading(true);
        try {
          const data = await getMySubscription();
          setMySubscription(data);
        } catch (error) {
          console.error("Subscription yuklashda xatolik:", error);
        } finally {
          setSubscriptionLoading(false);
        }
      }
    };
    fetchSubscription();
  }, [user, token]);

  const [usersList, setUsersList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [stats, setStats] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // Filters & UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all'); // 'all' | 'active' | 'blocked'
  const [bookingStatusFilter, setBookingStatusFilter] = useState('pending'); // 'all' | 'pending' | 'confirmed' | 'rejected'
  const [zoomedReceipt, setZoomedReceipt] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null); // { url: '', title: '' }
  const [editingNotificationId, setEditingNotificationId] = useState(null);
  const [previewNotification, setPreviewNotification] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  // Services States
  const [servicesList, setServicesList] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null); // null means "Add Mode"
  const [serviceForm, setServiceForm] = useState({
    name: '',
    name_en: '',
    price: '',
    duration: '',
    image_url: '/styles/1.png',
  });
  const [serviceImageFile, setServiceImageFile] = useState(null);
  const [serviceSaving, setServiceSaving] = useState(false);
  const [serviceError, setServiceError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // stores item ID currently updating
  const [successActions, setSuccessActions] = useState({}); // stores item ID and status after successful update
  const [servicesTimeframe, setServicesTimeframe] = useState('all'); // 'day' | 'week' | 'month' | 'all'
  const [hoveredPoint, setHoveredPoint] = useState(null); // { index, x, y, value, date, onlineValue, offlineValue }

  // Offline Kassa (Cash Register) States
  const [kassaDate, setKassaDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [kassaAmount, setKassaAmount] = useState('');
  const [kassaSaving, setKassaSaving] = useState(false);

  // Notifications States
  const [notificationsList, setNotificationsList] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationSubmitting, setNotificationSubmitting] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    description: '',
    content: '',
    type: 'system',
    linkType: 'none',
    linkUrl: '',
    imageUrl: ''
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    type: 'warning',
    onConfirm: () => {},
  });

  const triggerConfirm = ({ title, message, confirmText, cancelText, type, onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedTelegram, setEditedTelegram] = useState('');
  const [editedSlug, setEditedSlug] = useState('');
  const [editedPassword, setEditedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Barber Info Form States
  const [editedShopName, setEditedShopName] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedAvatar, setEditedAvatar] = useState('');
  const [editedInstagram, setEditedInstagram] = useState('');
  const [editedFacebook, setEditedFacebook] = useState('');
  const [editedYoutube, setEditedYoutube] = useState('');
  const [editedExperienceStartYear, setEditedExperienceStartYear] = useState('');
  const [editedExperienceYears, setEditedExperienceYears] = useState('');
  const [isBarberInfoSaving, setIsBarberInfoSaving] = useState(false);

  // User Editing modal states
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // Kassa Entry modal state
  const [isKassaModalOpen, setIsKassaModalOpen] = useState(false);

  // Blocked Schedules States
  const [blockedSchedules, setBlockedSchedules] = useState([]);
  const [isSchedulesLoading, setIsSchedulesLoading] = useState(false);
  const [selectedBlockDate, setSelectedBlockDate] = useState('');
  const [blockAllDay, setBlockAllDay] = useState(true);
  const [selectedBlockTimes, setSelectedBlockTimes] = useState([]);
  const [blockReason, setBlockReason] = useState('');
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  // Blocked Schedules Custom Calendar States & Refs
  const [isBlockCalendarOpen, setIsBlockCalendarOpen] = useState(false);
  const [blockCalendarViewDate, setBlockCalendarViewDate] = useState(new Date());
  const blockCalendarRef = useRef(null);

  const handleEditUserSave = async (userId, updatedUserData) => {
    try {
      let savedUser = null;
      if (userId) {
        savedUser = await editUser(userId, updatedUserData);
        // Immediately update usersList state so dashboard reflects changes instantly
        setUsersList(prev => prev.map(u =>
          (u.id === userId || u._id === userId)
            ? { ...u, ...updatedUserData }
            : u
        ));
        // Also update bookingsList so dashboard pending bookings show updated user info
        setBookingsList(prev => prev.map(b => {
          if (b.userId && (b.userId._id === userId || b.userId.id === userId)) {
            return { ...b, userId: { ...b.userId, ...updatedUserData } };
          }
          return b;
        }));
      } else {
        await createUserApi(token, updatedUserData);
      }
      // Silently refresh all data in background (no skeleton)
      await loadData(false);
    } catch (err) {
      toast.error(err.message || 'Xatolik yuz berdi');
      throw err;
    }
  };


  const parseBookingDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-based month
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(0);
  };

  const getFilteredServicesStats = () => {
    if (!bookingsList || bookingsList.length === 0) return [];

    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const filteredBookings = bookingsList.filter(b => {
      if (!b) return false;
      const bDate = b.createdAt ? new Date(b.createdAt) : parseBookingDate(b.date);
      const diffMs = now - bDate;

      if (servicesTimeframe === 'day') {
        // Today only (calendar day)
        return bDate.toDateString() === now.toDateString();
      } else if (servicesTimeframe === 'week') {
        // Last 7 days
        return diffMs <= 7 * oneDayMs && diffMs >= 0;
      } else if (servicesTimeframe === 'month') {
        // Last 30 days
        return diffMs <= 30 * oneDayMs && diffMs >= 0;
      }
      return true; // 'all'
    });

    const serviceCounts = {};
    filteredBookings.forEach(b => {
      if (!b.serviceName) return;
      if (!serviceCounts[b.serviceName]) {
        serviceCounts[b.serviceName] = { name: b.serviceName, count: 0, revenue: 0, price: b.servicePrice || 0 };
      }
      serviceCounts[b.serviceName].count += 1;
      if (b.status === 'confirmed') {
        serviceCounts[b.serviceName].revenue += (b.servicePrice || 0);
      }
    });

    return Object.values(serviceCounts).sort((a, b) => b.count - a.count);
  };

  useEffect(() => {
    if (user) {
      setEditedName(user.name || '');
      setEditedPhone(user.phone || '');
      setEditedTelegram(user.telegram || '');
      setEditedSlug(user.slug || '');
      setEditedPassword('');
      setShowPassword(false);
    }
  }, [user, isEditingProfile]);

  const handleSaveAdminProfile = async (e) => {
    e.preventDefault();
    const finalName = editedName.trim() || user?.name || '';
    const finalTelegram = editedTelegram.trim() || user?.telegram || '';
    const finalPhone = editedPhone.trim() || user?.phone || '';
    const finalSlug = editedSlug.trim() || user?.slug || '';
    
    setIsProfileUpdating(true);
    setProfileError('');
    setProfileSuccess('');
    
    try {
      const updateData = {
        name: finalName,
        phone: finalPhone,
        telegram: finalTelegram,
        slug: finalSlug
      };
      if (editedPassword.trim()) {
        updateData.password = editedPassword;
      }
      await updateProfile(updateData);
      setProfileSuccess('Profil muvaffaqiyatli yangilandi!');
      setIsEditingProfile(false);
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (error) {
      console.error('Profilni yangilashda xato:', error);
      setProfileError(error.response?.data?.error || error.message || 'Serverda xatolik yuz berdi');
    } finally {
      setIsProfileUpdating(false);
    }
  };

  useEffect(() => {
    if (user) {
      setEditedShopName(user.shopName || '');
      setEditedTitle(user.title || 'Professional Barber');
      setEditedDescription(user.description || '');
      setEditedAvatar(user.avatar || '/avatar/men.png');
      setEditedInstagram(user.instagram || '');
      setEditedFacebook(user.facebook || '');
      setEditedYoutube(user.youtube || '');
      setEditedExperienceStartYear(user.experienceStartYear || 2011);
      setEditedExperienceYears(user.experienceYears || 15);
    }
  }, [user]);

  const handleSaveBarberInfo = async (e) => {
    e.preventDefault();
    setIsBarberInfoSaving(true);
    try {
      const updateData = {
        name: user.name, // Keep existing name
        shopName: editedShopName,
        description: editedDescription,
        avatar: editedAvatar,
        telegram: editedTelegram,
        instagram: editedInstagram,
        facebook: editedFacebook,
        youtube: editedYoutube,
        experienceStartYear: Number(editedExperienceStartYear),
        experienceYears: Number(editedExperienceYears)
      };
      await updateProfile(updateData);
      toast.success("Sartarosh ma'lumotlari muvaffaqiyatli saqlandi!");
      setSearchParams({ tab: 'profile' });
    } catch (error) {
      console.error("Sartarosh ma'lumotlarini saqlashda xato:", error);
      toast.error(error.response?.data?.error || error.message || 'Xatolik yuz berdi');
    } finally {
      setIsBarberInfoSaving(false);
    }
  };

  // Custom Calendar States & Refs for Kassa Form
  const [isKassaCalendarOpen, setIsKassaCalendarOpen] = useState(false);
  const [kassaViewDate, setKassaViewDate] = useState(new Date());
  const kassaCalendarRef = useRef(null);

  // Custom Dropdown States & Refs for Users Filter
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef(null);

  // Custom Dropdown States & Refs for Bookings Filter
  const [isBookingStatusDropdownOpen, setIsBookingStatusDropdownOpen] = useState(false);
  const bookingStatusDropdownRef = useRef(null);

  // Custom Dropdown States & Refs for Timeframe Filter
  const [isTimeframeDropdownOpen, setIsTimeframeDropdownOpen] = useState(false);
  const timeframeDropdownRef = useRef(null);

  // Custom Dropdown States & Refs for Notifications Create
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef(null);
  const [isLinkTypeDropdownOpen, setIsLinkTypeDropdownOpen] = useState(false);
  const linkTypeDropdownRef = useRef(null);

  // Accordion state for client bookings expansion
  const [expandedClients, setExpandedClients] = useState({});

  const kassaMonths = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  const kassaDaysOfWeek = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

  const parseToDate = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    return new Date();
  };

  useEffect(() => {
    if (kassaDate) {
      setKassaViewDate(parseToDate(kassaDate));
    }
  }, [kassaDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (kassaCalendarRef.current && !kassaCalendarRef.current.contains(event.target)) {
        setIsKassaCalendarOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
      if (bookingStatusDropdownRef.current && !bookingStatusDropdownRef.current.contains(event.target)) {
        setIsBookingStatusDropdownOpen(false);
      }
      if (timeframeDropdownRef.current && !timeframeDropdownRef.current.contains(event.target)) {
        setIsTimeframeDropdownOpen(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsTypeDropdownOpen(false);
      }
      if (linkTypeDropdownRef.current && !linkTypeDropdownRef.current.contains(event.target)) {
        setIsLinkTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide bottom navigation bar and disable body scrolling when any modal or fullscreen preview is active
  useEffect(() => {
    const isAnyModalActive = !!(
      isServiceModalOpen ||
      isKassaModalOpen ||
      isEditUserModalOpen ||
      confirmModal.isOpen ||
      zoomedReceipt ||
      zoomedImage
    );
    if (isAnyModalActive) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isServiceModalOpen, isKassaModalOpen, isEditUserModalOpen, confirmModal.isOpen, zoomedReceipt, zoomedImage]);

  const getKassaCalendarDays = () => {
    const year = kassaViewDate.getFullYear();
    const month = kassaViewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let firstDayIndex = new Date(year, month, 1).getDay() - 1;
    if (firstDayIndex === -1) firstDayIndex = 6; // Sunday = index 6

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handleKassaPrevMonth = () => {
    setKassaViewDate(new Date(kassaViewDate.getFullYear(), kassaViewDate.getMonth() - 1, 1));
  };

  const handleKassaNextMonth = () => {
    setKassaViewDate(new Date(kassaViewDate.getFullYear(), kassaViewDate.getMonth() + 1, 1));
  };

  const handleKassaDateSelect = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    setKassaDate(`${yyyy}-${mm}-${dd}`);
    setIsKassaCalendarOpen(false);
  };

  const formatSelectedKassaDateUz = () => {
    if (!kassaDate) return "Sanani tanlang";
    const parts = kassaDate.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return `${day}-${kassaMonths[monthIndex]} ${year}-yil`;
    }
    return kassaDate;
  };

  // Helper to convert "YYYY-MM-DD" to "DD.MM.YYYY"
  const formatToDbDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
  };

  const formatBookingDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const monthsUz = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
      const monthIdx = parseInt(parts[1], 10) - 1;
      return `${parts[0]}-${monthsUz[monthIdx]}`;
    }
    return dateStr;
  };



  const handleSaveOfflineIncome = async (e) => {
    e.preventDefault();
    if (!kassaDate || kassaAmount === '') return;
    setKassaSaving(true);
    try {
      const dbDate = formatToDbDate(kassaDate);
      await saveOfflineIncome(dbDate, Number(kassaAmount));
      toast.success("Kassa muvaffaqiyatli saqlandi! 🎉");
      setKassaAmount('');
      setIsKassaModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Xatolik yuz berdi');
    } finally {
      setKassaSaving(false);
    }
  };

  const loadNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const data = await getNotificationsApi();
      setNotificationsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Bildirishnomalarni yuklashda xatolik:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    const titleTrimmed = (newNotification.title || '').trim();
    const descriptionTrimmed = (newNotification.description || '').trim();
    const contentTrimmed = (newNotification.content || '').trim();
    const linkUrlTrimmed = (newNotification.linkUrl || '').trim();
    const imageUrlTrimmed = (newNotification.imageUrl || '').trim();

    if (!titleTrimmed || !descriptionTrimmed) {
      toast.error("Sarlavha va Qisqa matn kiritilishi majburiy!");
      return;
    }
    setNotificationSubmitting(true);
    try {
      const payload = {
        ...newNotification,
        title: titleTrimmed,
        description: descriptionTrimmed,
        content: contentTrimmed,
        linkUrl: linkUrlTrimmed,
        imageUrl: imageUrlTrimmed
      };

      if (editingNotificationId) {
        await updateNotificationApi(token, editingNotificationId, payload);
        toast.success("Bildirishnoma muvaffaqiyatli tahrirlandi! 📝");
        setEditingNotificationId(null);
      } else {
        await createNotificationApi(token, payload);
        toast.success("Bildirishnoma muvaffaqiyatli yuborildi! 📢");
      }

      setNewNotification({
        title: '',
        description: '',
        content: '',
        type: 'system',
        linkType: 'none',
        linkUrl: '',
        imageUrl: ''
      });
      await loadNotifications();
    } catch (err) {
      toast.error(err.message || "Xatolik yuz berdi");
    } finally {
      setNotificationSubmitting(false);
    }
  };

  const handleStartEditNotification = (notif) => {
    setEditingNotificationId(notif._id || notif.id);
    setNewNotification({
      title: notif.title || '',
      description: notif.description || '',
      content: notif.content || '',
      type: notif.type || 'system',
      linkType: notif.linkType || 'none',
      linkUrl: notif.linkUrl || '',
      imageUrl: notif.imageUrl || ''
    });
    const formElement = document.getElementById('notification-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteNotification = (id) => {
    triggerConfirm({
      title: "Bildirishnomani o'chirish",
      message: "Ushbu bildirishnomani o'chirishni tasdiqlaysizmi? (Barcha foydalanuvchilar ro'yxatidan butunlay o'chadi)",
      confirmText: "Ha, o'chirish",
      cancelText: "Yo'q, qolsin",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteNotificationApi(token, id);
          toast.success("Bildirishnoma butunlay o'chirildi! 🗑️");
          await loadNotifications();
        } catch (err) {
          toast.error(err.message || "O'chirishda xatolik yuz berdi");
        }
      }
    });
  };

  const loadData = async (showSkeleton = true) => {
    if (showSkeleton) setIsDataLoading(true);
    try {
      const [usersData, bookingsData, statsData, servicesData] = await Promise.all([
        getUsers(),
        getBookings(),
        getStatistics(),
        getServices()
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
      setServicesList(Array.isArray(servicesData) ? servicesData : []);
      await loadNotifications();
    } catch (error) {
      console.error('Admin data loading error:', error);
    } finally {
      if (showSkeleton) setIsDataLoading(false);
    }
  };

  const loadBlockedSchedules = async () => {
    setIsSchedulesLoading(true);
    try {
      const data = await getBlockedSchedulesApi(token);
      setBlockedSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ish jadvalini yuklashda xatolik:', error);
      toast.error('Ish jadvalini yuklashda xatolik yuz berdi');
    } finally {
      setIsSchedulesLoading(false);
    }
  };

  const loadServices = async () => {
    setServicesLoading(true);
    try {
      const data = await getServices();
      setServicesList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Xizmatlarni yuklashda xatolik:', error);
      toast.error('Xizmatlarni yuklashda xatolik yuz berdi');
    } finally {
      setServicesLoading(false);
    }
  };

  const handleSaveBlockedSchedule = async (e) => {
    e.preventDefault();
    if (!selectedBlockDate) {
      toast.error("Iltimos, sanani tanlang!");
      return;
    }
    if (!blockAllDay && selectedBlockTimes.length === 0) {
      toast.error("Kamida bitta soatni tanlashingiz kerak!");
      return;
    }

    setIsSavingSchedule(true);
    try {
      const formattedDate = formatToDbDate(selectedBlockDate); // "YYYY-MM-DD" -> "DD.MM.YYYY"
      const payload = {
        date: formattedDate,
        blockedTimes: blockAllDay ? ['ALL'] : selectedBlockTimes,
        reason: blockReason.trim()
      };

      await saveBlockedScheduleApi(token, payload);
      toast.success("Ish jadvali muvaffaqiyatli saqlandi! 📅");
      
      // Clear form
      setSelectedBlockDate('');
      setBlockAllDay(true);
      setSelectedBlockTimes([]);
      setBlockReason('');
      
      await loadBlockedSchedules();
    } catch (err) {
      console.error('Ish jadvalini saqlashda xato:', err);
      toast.error(err.response?.data?.error || err.message || 'Saqlashda xatolik yuz berdi');
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const handleDeleteBlockedSchedule = async (date) => {
    try {
      await deleteBlockedScheduleApi(token, date);
      toast.success("Kun muvaffaqiyatli blokdan chiqarildi! 🔓");
      await loadBlockedSchedules();
    } catch (err) {
      console.error('Blokdan chiqarishda xato:', err);
      toast.error(err.response?.data?.error || err.message || 'Blokdan chiqarishda xatolik yuz berdi');
    }
  };

  const getBlockCalendarDays = () => {
    const year = blockCalendarViewDate.getFullYear();
    const month = blockCalendarViewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let firstDayIndex = new Date(year, month, 1).getDay() - 1;
    if (firstDayIndex === -1) firstDayIndex = 6; // Sunday = index 6

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handleBlockPrevMonth = () => {
    setBlockCalendarViewDate(new Date(blockCalendarViewDate.getFullYear(), blockCalendarViewDate.getMonth() - 1, 1));
  };

  const handleBlockNextMonth = () => {
    setBlockCalendarViewDate(new Date(blockCalendarViewDate.getFullYear(), blockCalendarViewDate.getMonth() + 1, 1));
  };

  const handleBlockDateSelect = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    setSelectedBlockDate(`${yyyy}-${mm}-${dd}`);
    setIsBlockCalendarOpen(false);
  };

  const formatSelectedBlockDateUz = () => {
    if (!selectedBlockDate) return "Sanani tanlang";
    const parts = selectedBlockDate.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return `${day}-${kassaMonths[monthIndex]} ${year}-yil`;
    }
    return selectedBlockDate;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (blockCalendarRef.current && !blockCalendarRef.current.contains(event.target)) {
        setIsBlockCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSearchTerm('');
    if (activeTab === 'notifications') {
      loadNotifications();
    } else if (activeTab === 'schedule') {
      loadBlockedSchedules();
    } else if (activeTab === 'services') {
      loadServices();
    }
  }, [activeTab]);

  // Services Management handlers
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      name_en: '',
      price: '',
      duration: '',
      image_url: '/styles/1.png',
    });
    setServiceImageFile(null);
    setServiceError('');
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      name_en: service.name_en || '',
      price: service.price.toString(),
      duration: service.duration.toString(),
      image_url: service.image_url || '/styles/1.png',
    });
    setServiceImageFile(null);
    setServiceError('');
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.price || !serviceForm.duration) {
      setServiceError("Xizmat nomi, narxi va davomiyligi kiritilishi shart!");
      return;
    }

    setServiceSaving(true);
    setServiceError('');

    try {
      const payload = {
        name: serviceForm.name,
        name_en: serviceForm.name_en,
        price: Number(serviceForm.price),
        duration: Number(serviceForm.duration),
        image_url: serviceForm.image_url
      };

      if (editingService) {
        await updateService(editingService._id || editingService.id, payload, serviceImageFile);
        toast.success("Xizmat muvaffaqiyatli yangilandi! 💈");
      } else {
        await addService(payload, serviceImageFile);
        toast.success("Yangi xizmat muvaffaqiyatli qo'shildi! 💈");
      }

      setIsServiceModalOpen(false);
      await loadServices();
    } catch (err) {
      console.error("Xizmatni saqlashda xatolik:", err);
      setServiceError(err.response?.data?.error || err.message || "Saqlashda xatolik yuz berdi");
    } finally {
      setServiceSaving(false);
    }
  };

  const handleDeleteService = (serviceId) => {
    triggerConfirm({
      title: "Xizmatni o'chirish",
      message: "Haqiqatan ham ushbu xizmatni o'chirmoqchimisiz? Ushbu xizmatga tegishli barcha ma'lumotlar o'chadi.",
      confirmText: "Ha, o'chirish",
      cancelText: "Yo'q, qolsin",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteService(serviceId);
          toast.success("Xizmat muvaffaqiyatli o'chirildi! 🗑️");
          await loadServices();
        } catch (err) {
          console.error("Xizmatni o'chirishda xatolik:", err);
          toast.error(err.response?.data?.error || err.message || "O'chirishda xatolik yuz berdi");
        }
      }
    });
  };

  // User Actions handlers
  const handleBlockUser = async (targetUserId, currentStatus) => {
    setActionLoading(targetUserId);
    const newBlockedState = currentStatus !== 'blocked';
    try {
      await blockUser(targetUserId, newBlockedState);
      toast.success(`Foydalanuvchi muvaffaqiyatli ${newBlockedState ? 'bloklandi' : 'faollashtirildi'}!`);
      await loadData(false);
    } catch (err) {
      toast.error(err.message || 'Xatolik yuz berdi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = (targetUserId) => {
    triggerConfirm({
      title: "Foydalanuvchini o'chirish",
      message: "Foydalanuvchini o'chirishni tasdiqlaysizmi?",
      confirmText: "Ha, o'chirish",
      cancelText: "Yo'q, bekor qilish",
      type: "danger",
      onConfirm: async () => {
        setActionLoading(targetUserId);
        try {
          await deleteUser(targetUserId);
          toast.success("Foydalanuvchi o'chirildi! 🗑️");
          await loadData(false);
        } catch (err) {
          toast.error(err.message || 'Xatolik yuz berdi');
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  // Booking Actions handlers
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    setActionLoading(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      const statusText = newStatus === 'confirmed' ? 'tasdiqlandi' : newStatus === 'rejected' ? 'rad etildi' : 'kutilmoqda holatiga o\'tkazildi';
      toast.success(`Buyurtma muvaffaqiyatli ${statusText}!`);
      setSuccessActions(prev => ({ ...prev, [bookingId]: newStatus }));
      
      // Delay local reloading to let the button transition finish
      setTimeout(async () => {
        await loadData(false);
        setSuccessActions(prev => {
          const copy = { ...prev };
          delete copy[bookingId];
          return copy;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.message || 'Xatolik yuz berdi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBooking = (bookingId) => {
    triggerConfirm({
      title: "Buyurtmani o'chirish",
      message: "Buyurtmani o'chirishni tasdiqlaysizmi?",
      confirmText: "Ha, o'chirish",
      cancelText: "Yo'q, bekor qilish",
      type: "danger",
      onConfirm: async () => {
        setActionLoading(bookingId);
        try {
          await deleteBooking(bookingId);
          toast.success("Buyurtma muvaffaqiyatli o'chirildi! 🗑️");
          await loadData(false);
        } catch (err) {
          toast.error(err.message || 'Xatolik yuz berdi');
        } finally {
          setActionLoading(null);
        }
      }
    });
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
    const userRef = b.userId;
    const clientName = (userRef && userRef.name) || b.name || '';
    const clientPhone = (userRef && userRef.phone) || b.phone || '';
    
    const matchSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        clientPhone.includes(searchTerm) || 
                        (b.serviceName || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (bookingStatusFilter === 'all') return matchSearch;
    return matchSearch && b.status === bookingStatusFilter;
  });

  const groupBookingsByClient = (bookings) => {
    const groups = {};
    bookings.forEach(b => {
      if (!b) return;
      
      const userRef = b.userId;
      // Group by userId identifier if available, otherwise by phone number
      const userKey = (userRef && (userRef._id || userRef.id)) || b.phone;
      
      if (!groups[userKey]) {
        groups[userKey] = {
          name: (userRef && userRef.name) || b.name,
          phone: (userRef && userRef.phone) || b.phone,
          telegram_user: (userRef && userRef.telegram) || b.telegram_user,
          userId: userRef,
          appointments: []
        };
      } else {
        if (!groups[userKey].userId && userRef) {
          groups[userKey].userId = userRef;
          groups[userKey].name = userRef.name || groups[userKey].name;
          groups[userKey].phone = userRef.phone || groups[userKey].phone;
          groups[userKey].telegram_user = userRef.telegram || groups[userKey].telegram_user;
        }
      }
      groups[userKey].appointments.push(b);
    });
    return Object.values(groups);
  };

  const groupedBookings = groupBookingsByClient(filteredBookings);

  const renderSkeleton = () => {
    switch (activeTab) {
      case 'bookings':
        return <BookingsSkeleton />;
      case 'users':
        return <UsersSkeleton />;
      case 'statistics':
        return <StatisticsSkeleton />;
      case 'profile':
        return <ProfileSkeleton />;
      case 'dashboard':
      default:
        return <DashboardSkeleton />;
    }
  };

  return (
    <div className="w-full text-white">




      {/* Loading Overlay inside tabs */}
      {isDataLoading && !stats ? (
        renderSkeleton()
      ) : (
        <div>
          {/* ================= TAB: BOOKINGS ================= */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Filters Panel */}
              <div className="flex flex-row items-center gap-2 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-2.5 backdrop-blur-sm relative z-30">
                {/* Search */}
                <div className="flex-1 min-w-0 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-550">
                    <FaSearch size={11} />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Qidirish..."
                    className="w-full pl-7 pr-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent text-[11px] sm:text-xs text-white placeholder-zinc-550 transition-all duration-300"
                  />
                </div>
                {/* Status custom select */}
                <div className="w-28 sm:w-44 shrink-0 relative" ref={bookingStatusDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsBookingStatusDropdownOpen(!isBookingStatusDropdownOpen)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 bg-zinc-800/60 border rounded-xl outline-none text-[11px] sm:text-xs text-white cursor-pointer transition-all duration-300 ${
                      isBookingStatusDropdownOpen
                        ? 'border-emerald-500 ring-1 ring-emerald-500'
                        : 'border-zinc-700/50 hover:border-emerald-500/50 hover:bg-zinc-800/80'
                    }`}
                  >
                    <span>
                      {bookingStatusFilter === 'all' && (
                        <>
                          <span className="hidden sm:inline">Barcha holatlar</span>
                          <span className="sm:hidden">Barchasi</span>
                        </>
                      )}
                      {bookingStatusFilter === 'pending' && 'Kutilmoqda'}
                      {bookingStatusFilter === 'confirmed' && 'Tasdiqlangan'}
                      {bookingStatusFilter === 'rejected' && 'Rad etilgan'}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 shrink-0 ml-1 ${isBookingStatusDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Options Menu */}
                  {isBookingStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
                      <div className="p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setBookingStatusFilter('all');
                            setIsBookingStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            bookingStatusFilter === 'all'
                              ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          Barchasi
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBookingStatusFilter('pending');
                            setIsBookingStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            bookingStatusFilter === 'pending'
                              ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          Kutilmoqda
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBookingStatusFilter('confirmed');
                            setIsBookingStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            bookingStatusFilter === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          Tasdiqlangan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBookingStatusFilter('rejected');
                            setIsBookingStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            bookingStatusFilter === 'rejected'
                              ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          Rad etilgan
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Kassa kiritish button */}
                <button
                  type="button"
                  onClick={() => setIsKassaModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-zinc-950 font-extrabold text-[11px] sm:text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-emerald-500/10 border-none"
                >
                  <FaWallet size={11} className="shrink-0" />
                  <span className="hidden sm:inline">Kassa kiritish</span>
                  <span className="sm:hidden">Kassa</span>
                </button>
              </div>

              {/* Bookings Table / Cards */}
              {groupedBookings.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/20 border border-dashed border-zinc-800/80 rounded-2xl">
                  <FaFolderOpen className="mx-auto text-3xl text-zinc-600 mb-2.5 animate-pulse" />
                  <p className="text-zinc-400 text-xs font-medium">Hech qanday buyurtma topilmadi.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {groupedBookings.map((clientGroup) => {
                    const clientUserId = clientGroup.userId;
                    const isBlocked = clientUserId && clientUserId.status === 'blocked';
                    
                    const hasPending = clientGroup.appointments.some(a => a.status === 'pending');
                    const hasConfirmed = clientGroup.appointments.some(a => a.status === 'confirmed');
                    
                    // Determine elegant glowing status dot colors next to the client's name
                    const statusDotColor = isBlocked
                      ? 'bg-red-500'
                      : hasPending
                      ? 'bg-amber-400'
                      : hasConfirmed
                      ? 'bg-emerald-400'
                      : 'bg-red-400';
                    
                    const statusDotShadow = isBlocked
                      ? 'shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                      : hasPending
                      ? 'shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                      : hasConfirmed
                      ? 'shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                      : 'shadow-[0_0_8px_rgba(239,68,68,0.6)]';

                    const isExpanded = !!expandedClients[clientGroup.phone];

                    return (
                      <div
                        key={clientGroup.phone}
                        className={`rounded-2xl p-4 md:p-5 backdrop-blur-md relative overflow-hidden flex flex-col gap-4 shadow-lg transition-all duration-300 ${
                          isBlocked
                            ? 'bg-red-950/10 border border-red-500/20 shadow-red-950/30 hover:border-red-500/40 hover:shadow-[0_12px_40px_rgba(239,68,68,0.12)]'
                            : 'bg-zinc-900/30 border border-zinc-800/60 shadow-zinc-950/40 hover:border-zinc-700/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]'
                        }`}
                      >
                        {/* Client Info Header */}
                        <div 
                          onClick={() => setExpandedClients(prev => ({ ...prev, [clientGroup.phone]: !isExpanded }))}
                          className={`flex items-center justify-between gap-4 pb-3 border-b cursor-pointer select-none group/header ${
                            isBlocked ? 'border-red-900/30' : 'border-zinc-800/40'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Avatar */}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm uppercase shadow-inner shrink-0 select-none border ${
                              isBlocked
                                ? 'bg-gradient-to-tr from-red-500/10 to-rose-500/5 border-red-500/25 text-red-400'
                                : 'bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-400'
                            }`}>
                              {(clientGroup.name || 'M').charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-zinc-200 text-sm tracking-wide block truncate">{clientGroup.name}</span>
                                <span className={`w-2 h-2 rounded-full ${statusDotColor} ${statusDotShadow} animate-pulse shrink-0`}></span>
                                {clientUserId && clientUserId.status === 'blocked' && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-lg border bg-zinc-950/40 text-red-400 border-red-500/20 shrink-0">
                                    <span className="w-1 h-1 rounded-full bg-red-400 animate-pulse"></span>
                                    Blok
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-zinc-500 block mt-0.5 font-medium">
                                {clientGroup.phone}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons: Call, Telegram, Block & Accordion Chevron */}
                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`tel:${clientGroup.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 font-bold text-[10px] transition-all duration-300 active:scale-95 cursor-pointer shrink-0"
                            >
                              <FaPhone size={9} />
                              <span className="hidden sm:inline">Qo'ng'iroq</span>
                            </a>
                            
                            {clientGroup.telegram_user ? (
                              <a
                                href={`https://t.me/${clientGroup.telegram_user}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/25 text-sky-400 font-bold text-[10px] transition-all duration-300 active:scale-95 cursor-pointer shrink-0"
                              >
                                <FaPaperPlane size={9} />
                                <span className="hidden sm:inline">Telegram</span>
                              </a>
                            ) : (
                              <div className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-950/40 border border-zinc-900/50 text-zinc-700 font-bold text-[10px] select-none opacity-40 shrink-0">
                                <FaPaperPlane size={9} />
                                <span className="hidden sm:inline">Telegram</span>
                              </div>
                            )}

                            {clientUserId && (
                              <button
                                disabled={actionLoading === (clientUserId._id || clientUserId.id)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBlockUser(clientUserId._id || clientUserId.id, clientUserId.status);
                                }}
                                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer disabled:opacity-50 shrink-0 ${
                                  clientUserId.status === 'blocked'
                                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                                    : 'bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400'
                                }`}
                                title={clientUserId.status === 'blocked' ? 'Faollashtirish' : 'Mijozni bloklash'}
                              >
                                {actionLoading === (clientUserId._id || clientUserId.id) ? (
                                  <FaSpinner size={12} className="animate-spin text-emerald-400" />
                                ) : (
                                  <FaBan size={12} />
                                )}
                              </button>
                            )}

                            {/* Chevron Toggle Icon */}
                            <div className="pl-1 shrink-0">
                              <FaChevronDown
                                className={`text-zinc-400 group-hover/header:text-white transition-transform duration-300 ${
                                  isExpanded ? 'rotate-180 text-emerald-400' : ''
                                }`}
                                size={13}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Nested Appointments Accordion */}
                        {isExpanded && (
                          <div className="space-y-3 animate-fadeIn">
                            {clientGroup.appointments.map((booking) => {
                              const glowingAccentColor = booking.status === 'pending'
                                ? 'bg-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                                : booking.status === 'confirmed'
                                ? 'bg-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                : 'bg-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
                              
                              return (
                                <div
                                  key={booking.id || booking._id}
                                  className="relative bg-zinc-950/30 border border-zinc-900/60 rounded-xl p-3.5 pl-5 transition-all duration-300 overflow-hidden hover:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center gap-3.5"
                                >
                                  {/* Glowing left accent border matching status of this appointment */}
                                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${glowingAccentColor}`}></div>
                                  
                                  {/* Left: Time Badge */}
                                  <div className="flex sm:flex-col items-center justify-between sm:justify-center bg-zinc-900 border border-zinc-800/80 rounded-xl px-3 py-1.5 sm:py-2 min-w-[75px] text-center shrink-0 gap-1.5 sm:gap-0.5 select-none">
                                    <span className="text-sm sm:text-base font-extrabold text-white tracking-tight">{booking.time}</span>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400">{formatBookingDate(booking.date)}</span>
                                  </div>

                                  {/* Middle: Details */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-bold text-zinc-100 text-sm tracking-wide truncate">{booking.serviceName}</h4>
                                      
                                      {/* Status Badge */}
                                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${
                                        booking.status === 'pending'
                                          ? 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                                          : booking.status === 'confirmed'
                                          ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                                          : 'text-red-400 border-red-500/20 bg-red-500/5'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                          booking.status === 'pending'
                                            ? 'bg-amber-400 animate-pulse'
                                            : booking.status === 'confirmed'
                                            ? 'bg-emerald-400'
                                            : 'bg-red-400'
                                        }`}></span>
                                        {booking.status === 'pending' && 'Kutilmoqda'}
                                        {booking.status === 'confirmed' && 'Tasdiqlandi'}
                                        {booking.status === 'rejected' && 'Rad etilgan'}
                                      </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-zinc-500 font-medium">
                                      <span className="font-bold text-emerald-400">{formatPrice(booking.servicePrice)} so'm</span>
                                      <span className="text-zinc-800">•</span>
                                      <span className="inline-flex items-center gap-1">
                                        {booking.paymentMethod === 'cash' ? (
                                          <>
                                            <FaMoneyBillWave size={10} className="text-emerald-400" />
                                            <span>Joyida</span>
                                          </>
                                        ) : (
                                          <>
                                            <FaCreditCard size={10} className="text-sky-400" />
                                            <span>Karta</span>
                                          </>
                                        )}
                                      </span>
                                      {booking.paymentMethod !== 'cash' && (
                                        <>
                                          <span className="text-zinc-800">•</span>
                                          {booking.receipt && booking.receipt.includes('res.cloudinary.com') ? (
                                            <button
                                              onClick={() => setZoomedReceipt(booking.receipt)}
                                              className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-0.5"
                                            >
                                              <FaPaperclip size={10} />
                                              <span>Chekni ko'rish</span>
                                            </button>
                                          ) : booking.receipt ? (
                                            <span className="text-sky-400 font-bold inline-flex items-center gap-1">
                                              <FaComment size={10} />
                                              <span>Telegramda</span>
                                            </span>
                                          ) : (
                                            <span className="text-zinc-650 font-bold inline-flex items-center gap-1">
                                              <FaCreditCard size={10} />
                                              <span>Cheksiz</span>
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Right: Actions */}
                                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                                    {booking.status !== 'pending' && (
                                      <button
                                        disabled={actionLoading === (booking.id || booking._id)}
                                        onClick={() => handleUpdateBookingStatus(booking.id || booking._id, 'pending')}
                                        className="text-[10px] text-zinc-500 hover:text-zinc-300 hover:underline transition-colors bg-transparent border-none cursor-pointer pr-1 font-semibold"
                                      >
                                        Qaytarish
                                      </button>
                                    )}

                                    {booking.status === 'pending' && (
                                      <>
                                        {/* Tasdiqlash Button */}
                                        <button
                                          disabled={actionLoading === (booking.id || booking._id) || successActions[booking.id || booking._id]}
                                          onClick={() => handleUpdateBookingStatus(booking.id || booking._id, 'confirmed')}
                                          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all duration-300 active:scale-95 cursor-pointer border ${
                                            booking.status === 'confirmed' || successActions[booking.id || booking._id] === 'confirmed'
                                              ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20'
                                              : 'bg-emerald-500/5 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/35'
                                          }`}
                                        >
                                          {actionLoading === (booking.id || booking._id) && successActions[booking.id || booking._id] !== 'confirmed' ? (
                                            <FaSpinner size={10} className="animate-spin text-emerald-400" />
                                          ) : (
                                            <>
                                              <FaCheck size={9} className="shrink-0" />
                                              <span>Tasdiqlash</span>
                                            </>
                                          )}
                                        </button>

                                        {/* Rad etish Button */}
                                        <button
                                          disabled={actionLoading === (booking.id || booking._id) || successActions[booking.id || booking._id]}
                                          onClick={() => handleUpdateBookingStatus(booking.id || booking._id, 'rejected')}
                                          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all duration-300 active:scale-95 cursor-pointer border ${
                                            booking.status === 'rejected' || successActions[booking.id || booking._id] === 'rejected'
                                              ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20'
                                              : 'bg-red-500/5 border-red-500/25 text-red-400 hover:bg-red-500/10 hover:border-red-500/35'
                                          }`}
                                        >
                                          {actionLoading === (booking.id || booking._id) && successActions[booking.id || booking._id] !== 'rejected' ? (
                                            <FaSpinner size={10} className="animate-spin text-red-400" />
                                          ) : (
                                            <>
                                              <FaTimes size={9} className="shrink-0" />
                                              <span>Rad etish</span>
                                            </>
                                          )}
                                        </button>
                                      </>
                                    )}

                                    {/* O'chirish Button */}
                                    <button
                                      disabled={actionLoading === (booking.id || booking._id)}
                                      onClick={() => handleDeleteBooking(booking.id || booking._id)}
                                      className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-red-500/10 border border-zinc-700/60 hover:border-red-500/30 text-zinc-500 hover:text-red-400 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer disabled:opacity-50"
                                      title="O'chirish"
                                    >
                                      <FaTrash size={11} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: SERVICES ================= */}
          {activeTab === 'services' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Header card with Add Button */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-lg text-white tracking-wide">Xizmatlar Boshqaruvi</h3>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">Xizmatlarni qo'shish, o'chirish va ma'lumotlarini tahrirlash</p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddService}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-zinc-950 font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10 border-none shrink-0"
                >
                  <FaPlus size={11} className="shrink-0" />
                  <span>Xizmat qo'shish</span>
                </button>
              </div>

              {/* Services Grid */}
              {servicesLoading && servicesList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/10 border border-zinc-800 rounded-2xl">
                  <FaSpinner size={24} className="animate-spin text-emerald-400 mb-3" />
                  <p className="text-zinc-400 text-xs font-semibold">Yuklanmoqda...</p>
                </div>
              ) : servicesList.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl">
                  <FaFolderOpen className="mx-auto text-4xl text-zinc-600 mb-3 animate-pulse" />
                  <p className="text-zinc-400 text-xs font-semibold">Hozircha xizmatlar mavjud emas.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {servicesList.map((service) => (
                    <div
                      key={service._id || service.id}
                      className="bg-zinc-800/60 border border-green-500/20 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 hover:bg-zinc-800/80 hover:scale-[1.005] active:scale-[0.995] rounded-xl p-4 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
                    >
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </div>

                      <div className="flex items-center gap-4 relative z-10">
                        <div className="transition-all duration-300 relative w-16 h-16 shrink-0 overflow-hidden rounded-xl bg-zinc-700/50 group-hover:scale-105">
                          <img
                            src={service.image_url.startsWith('http') || service.image_url.startsWith('/uploads') || service.image_url.startsWith('/styles')
                              ? service.image_url 
                              : '/styles/1.png'}
                            alt={service.name}
                            className="w-full h-full object-cover rounded-xl shadow-md transition-all duration-300"
                            onError={(e) => { e.target.src = '/styles/1.png'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="text-base sm:text-lg font-bold truncate text-white group-hover:text-green-300 transition-colors duration-300">
                              {service.name}
                            </h4>
                            <span className="text-[11px] text-gray-400 mt-1 shrink-0">
                              {service.duration} min
                            </span>
                          </div>
                          {service.name_en && (
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {service.name_en}
                            </p>
                          )}
                          <p className="text-green-400 group-hover:text-green-300 font-extrabold text-lg mt-2.5 transition-colors duration-300">
                            {formatPrice(service.price)} so'm
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2.5 mt-4 border-t border-zinc-800/40 pt-3 relative z-10">
                        <button
                          type="button"
                          onClick={() => handleOpenEditService(service)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-emerald-500/10 border border-zinc-700/50 hover:border-emerald-500/30 text-zinc-300 hover:text-emerald-400 text-xs font-bold transition-all duration-300 active:scale-[0.97] cursor-pointer"
                        >
                          <FaEdit size={11} />
                          <span>Tahrirlash</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(service._id || service.id)}
                          className="w-10 flex items-center justify-center rounded-xl bg-zinc-800/50 hover:bg-red-500/10 border border-zinc-700/50 hover:border-red-500/30 text-zinc-500 hover:text-red-400 transition-all duration-300 active:scale-[0.97] cursor-pointer"
                          title="Xizmatni o'chirish"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: USERS ================= */}
          {activeTab === 'users' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Back Button Header Card */}
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSearchParams({ tab: 'profile' })}
                    className="p-2.5 rounded-xl border border-white/10 bg-zinc-800/50 hover:bg-zinc-800 hover:border-emerald-500/30 text-emerald-400 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0 shadow-sm"
                    title="Profilga qaytish"
                  >
                    <FaArrowLeft size={14} />
                  </button>
                  <div>
                    <h3 className="font-extrabold text-sm text-white sm:text-base tracking-wide">Mijozlar Boshqaruvi</h3>
                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5 sm:text-xs">Ro'yxatdan o'tgan mijozlarni boshqarish</p>
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="flex flex-row items-center gap-2 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-2.5 backdrop-blur-sm relative z-30">
                <div className="flex-1 min-w-0 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-550">
                    <FaSearch size={11} />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Qidirish..."
                    className="w-full pl-7 pr-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent text-[11px] sm:text-xs text-white placeholder-zinc-550 transition-all duration-300"
                  />
                </div>
                <div className="w-28 sm:w-44 shrink-0 relative" ref={statusDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 bg-zinc-800/60 border rounded-xl outline-none text-[11px] sm:text-xs text-white cursor-pointer transition-all duration-300 ${
                      isStatusDropdownOpen
                        ? 'border-emerald-500 ring-1 ring-emerald-500'
                        : 'border-zinc-700/50 hover:border-emerald-500/50 hover:bg-zinc-800/80'
                    }`}
                  >
                    <span>
                      {userStatusFilter === 'all' && (
                        <>
                          <span className="hidden sm:inline">Barcha foydalanuvchilar</span>
                          <span className="sm:hidden">Barchasi</span>
                        </>
                      )}
                      {userStatusFilter === 'active' && 'Faollar'}
                      {userStatusFilter === 'blocked' && (
                        <>
                          <span className="hidden sm:inline">Bloklanganlar</span>
                          <span className="sm:hidden">Bloklangan</span>
                        </>
                      )}
                    </span>
                    <svg
                      className={`w-3 h-3 text-zinc-500 transition-transform duration-300 shrink-0 ml-1 ${isStatusDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Options Menu */}
                  {isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
                      <div className="p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserStatusFilter('all');
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            userStatusFilter === 'all'
                              ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          Barchasi
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserStatusFilter('active');
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            userStatusFilter === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          Faollar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserStatusFilter('blocked');
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            userStatusFilter === 'blocked'
                              ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          Bloklanganlar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Yangi mijoz qo'shish button */}
                <button
                  type="button"
                  onClick={() => {
                    setUserToEdit({ isAddMode: true });
                    setIsEditUserModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-zinc-950 font-extrabold text-[11px] sm:text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-emerald-500/10 border-none"
                >
                  <FaUserPlus size={11} className="shrink-0" />
                  <span className="hidden sm:inline">Mijoz qo'shish</span>
                  <span className="sm:hidden">Qo'shish</span>
                </button>
              </div>

              {/* Users Table */}
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/10 border border-dashed border-zinc-800/80 rounded-2xl backdrop-blur-xs">
                  <FaUserSlash className="mx-auto text-3xl text-zinc-600 mb-2.5 animate-pulse" />
                  <p className="text-zinc-400 text-xs font-medium">Hech qanday mijoz topilmadi.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Desktop Layout - Spacious, Glassmorphic Table */}
                  <div className="hidden md:block overflow-x-auto bg-zinc-950/40 border border-zinc-850 rounded-2xl shadow-xl backdrop-blur-md">
                    <table className="w-full text-left border-collapse min-w-full font-sans">
                      <thead>
                        <tr className="border-b border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 bg-zinc-950/40 select-none">
                          <th className="px-5 py-4 pl-6">Mijoz</th>
                          <th className="px-5 py-4">Aloqa</th>
                          <th className="px-5 py-4">Holat</th>
                          <th className="px-5 py-4 pr-6 text-right">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {filteredUsers.map((client) => (
                          <tr
                            key={client.id || client._id}
                            className="hover:bg-white/[0.02] active:bg-white/[0.01] transition-all duration-250 border-b border-zinc-900 last:border-none group text-xs"
                          >
                            {/* Mijoz Profile details */}
                            <td className="px-5 py-3.5 pl-6 flex items-center gap-3 whitespace-nowrap">
                              {/* Gradient initials avatar */}
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 border border-emerald-500/25 flex items-center justify-center text-emerald-400 font-extrabold text-sm uppercase shadow-inner group-hover:border-emerald-500/50 group-hover:text-emerald-300 transition-all duration-300 select-none shrink-0">
                                {(client.name || 'M').charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-zinc-200 group-hover:text-white text-sm tracking-wide transition-colors block truncate">{client.name}</span>
                                <span className="text-[10px] text-zinc-500 block mt-0.5 font-medium">
                                  A'zo bo'ldi: {new Date(client.createdAt).toLocaleDateString('uz-UZ')}
                                </span>
                              </div>
                            </td>

                            {/* Aloqa Buttons */}
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:${client.phone}`}
                                  title="Qo'ng'iroq qilish"
                                  className="w-8 h-8 rounded-xl bg-zinc-900/60 hover:bg-emerald-500/10 border border-zinc-800 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                                >
                                  <FaPhone size={11} />
                                </a>
                                {client.telegram ? (
                                  <a
                                    href={`https://t.me/${client.telegram}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Telegram chat ochish"
                                    className="w-8 h-8 rounded-xl bg-zinc-900/60 hover:bg-sky-500/10 border border-zinc-800 hover:border-sky-500/30 text-zinc-400 hover:text-sky-400 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                                  >
                                    <FaPaperPlane size={11} />
                                  </a>
                                ) : (
                                  <div
                                    title="Telegram yo'q"
                                    className="w-8 h-8 rounded-xl bg-zinc-950/40 border border-zinc-900/50 text-zinc-700 flex items-center justify-center select-none"
                                  >
                                    <FaPaperPlane size={11} className="opacity-30" />
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Status Badge */}
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-xl border transition-all duration-300 ${
                                client.status === 'active'
                                  ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                                  : 'bg-red-500/5 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.05)]'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                                {client.status === 'active' ? 'Faol' : 'Bloklangan'}
                              </span>
                            </td>

                            {/* Action Icon Buttons */}
                            <td className="px-5 py-3.5 pr-6 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* Edit Action */}
                                <button
                                  disabled={actionLoading === (client.id || client._id)}
                                  onClick={() => {
                                    setUserToEdit(client);
                                    setIsEditUserModalOpen(true);
                                  }}
                                  className="w-8 h-8 rounded-xl bg-zinc-900/60 hover:bg-emerald-500/10 border border-zinc-800 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                                  title="Tahrirlash"
                                >
                                  <FaEdit size={12} />
                                </button>

                                {/* Block/Activate Toggle Action */}
                                <button
                                  disabled={actionLoading === (client.id || client._id)}
                                  onClick={() => handleBlockUser(client.id || client._id, client.status)}
                                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 ${
                                    client.status === 'active'
                                      ? 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400'
                                      : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                                  }`}
                                  title={client.status === 'active' ? 'Bloklash' : 'Faollashtirish'}
                                >
                                  <FaBan size={12} />
                                </button>

                                {/* Delete Action */}
                                <button
                                  disabled={actionLoading === (client.id || client._id)}
                                  onClick={() => handleDeleteUser(client.id || client._id)}
                                  className="w-8 h-8 rounded-xl bg-zinc-900/60 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/30 text-zinc-500 hover:text-red-400 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
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

                  {/* Mobile Layout - Modern Compact Cards */}
                  <div className="md:hidden space-y-3">
                    {filteredUsers.map((client) => (
                      <div
                        key={client.id || client._id}
                        className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 backdrop-blur-sm relative overflow-hidden flex flex-col gap-3.5 hover:border-zinc-700/60 transition-all duration-300"
                      >
                        {/* Glowing left accent border matching status */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${client.status === 'active' ? 'bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}></div>
                        
                        {/* Top section: User info & Status */}
                        <div className="flex items-start justify-between pl-1">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold text-sm uppercase shadow-inner shrink-0 select-none">
                              {(client.name || 'M').charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-zinc-200 text-sm tracking-wide block truncate">{client.name}</span>
                              <span className="text-[10px] text-zinc-500 block mt-0.5 font-medium">
                                A'zo bo'ldi: {new Date(client.createdAt).toLocaleDateString('uz-UZ')}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-lg border bg-zinc-950/40 ${
                            client.status === 'active'
                              ? 'text-emerald-400 border-emerald-500/20'
                              : 'text-red-400 border-red-500/20'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${client.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                            {client.status === 'active' ? 'Faol' : 'Blok'}
                          </span>
                        </div>

                        {/* Bottom Section: Actions & Contact buttons */}
                        <div className="flex items-center justify-between border-t border-zinc-800/40 pt-3 pl-1">
                          {/* Contacts */}
                          <div className="flex gap-2">
                            <a
                              href={`tel:${client.phone}`}
                              title="Qo'ng'iroq qilish"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 font-bold text-[10px] transition-all duration-300 active:scale-95 cursor-pointer"
                            >
                              <FaPhone size={9} />
                              <span>Qo'ng'iroq</span>
                            </a>
                            {client.telegram ? (
                              <a
                                href={`https://t.me/${client.telegram}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Telegram chat ochish"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/25 text-sky-400 font-bold text-[10px] transition-all duration-300 active:scale-95 cursor-pointer"
                              >
                                <FaPaperPlane size={9} />
                                <span>Telegram</span>
                              </a>
                            ) : (
                              <div
                                title="Telegram yo'q"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/40 border border-zinc-900/50 text-zinc-700 font-bold text-[10px] select-none opacity-40"
                              >
                                <FaPaperPlane size={9} />
                                <span>Telegram</span>
                              </div>
                            )}
                          </div>

                          {/* Admin management buttons */}
                          <div className="flex gap-2">
                            <button
                              disabled={actionLoading === (client.id || client._id)}
                              onClick={() => {
                                setUserToEdit(client);
                                setIsEditUserModalOpen(true);
                              }}
                              className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-300 hover:text-white flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer disabled:opacity-50"
                              title="Tahrirlash"
                            >
                              <FaEdit size={12} />
                            </button>

                            <button
                              disabled={actionLoading === (client.id || client._id)}
                              onClick={() => handleBlockUser(client.id || client._id, client.status)}
                              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer disabled:opacity-50 ${
                                client.status === 'active'
                                  ? 'bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400'
                                  : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                              }`}
                              title={client.status === 'active' ? 'Bloklash' : 'Faollashtirish'}
                            >
                              <FaBan size={12} />
                            </button>

                            <button
                              disabled={actionLoading === (client.id || client._id)}
                              onClick={() => handleDeleteUser(client.id || client._id)}
                              className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-red-500/10 border border-zinc-700/60 hover:border-red-500/30 text-zinc-400 hover:text-red-400 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer disabled:opacity-50"
                              title="O'chirish"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: DASHBOARD ================= */}
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-8 animate-fadeIn">
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Daily income */}
                <div className="bg-zinc-900/60 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex items-center justify-between">
                  <div className="space-y-1 w-full">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-bold">Kunlik Daromad</p>
                    <h3 className="text-2xl font-bold text-emerald-400">{formatPrice(stats.dailyRevenue)} so'm</h3>
                    <div className="text-[10px] space-y-0.5 mt-2 border-t border-white/5 pt-1">
                      <p className="text-zinc-400 flex justify-between">
                        <span>🌐 Online:</span>
                        <span className="text-zinc-200 font-semibold">{formatPrice(stats.onlineDailyRevenue || 0)} so'm</span>
                      </p>
                      <p className="text-zinc-400 flex justify-between">
                        <span>💵 Kassa (Offline):</span>
                        <span className="text-zinc-200 font-semibold">{formatPrice(stats.offlineDailyRevenue || 0)} so'm</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsKassaModalOpen(true)}
                    title="Kunlik pul qo'shish"
                    className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-emerald-400 shrink-0 ml-2 transition-all duration-300 cursor-pointer gap-0.5"
                  >
                    <FaPlus size={11} />
                    <span className="text-[8px] font-extrabold uppercase tracking-wide leading-none">Qo'sh</span>
                  </button>
                </div>

                {/* Weekly income */}
                <div className="bg-zinc-900/60 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex items-center justify-between">
                  <div className="space-y-1 w-full">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-bold">Haftalik Daromad</p>
                    <h3 className="text-2xl font-bold text-white">{formatPrice(stats.weeklyRevenue)} so'm</h3>
                    <div className="text-[10px] space-y-0.5 mt-2 border-t border-white/5 pt-1">
                      <p className="text-zinc-400 flex justify-between">
                        <span>🌐 Online:</span>
                        <span className="text-zinc-200 font-semibold">{formatPrice(stats.onlineWeeklyRevenue || 0)} so'm</span>
                      </p>
                      <p className="text-zinc-400 flex justify-between">
                        <span>💵 Kassa (Offline):</span>
                        <span className="text-zinc-200 font-semibold">{formatPrice(stats.offlineWeeklyRevenue || 0)} so'm</span>
                      </p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 ml-2">
                    <FaChartBar size={20} />
                  </div>
                </div>

                {/* Monthly income */}
                <div className="bg-zinc-900/60 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex items-center justify-between">
                  <div className="space-y-1 w-full">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-bold">Oylik Daromad</p>
                    <h3 className="text-2xl font-bold text-white">{formatPrice(stats.monthlyRevenue)} so'm</h3>
                    <div className="text-[10px] space-y-0.5 mt-2 border-t border-white/5 pt-1">
                      <p className="text-zinc-400 flex justify-between">
                        <span>🌐 Online:</span>
                        <span className="text-zinc-200 font-semibold">{formatPrice(stats.onlineMonthlyRevenue || 0)} so'm</span>
                      </p>
                      <p className="text-zinc-400 flex justify-between">
                        <span>💵 Kassa (Offline):</span>
                        <span className="text-zinc-200 font-semibold">{formatPrice(stats.offlineMonthlyRevenue || 0)} so'm</span>
                      </p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 ml-2">
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
                    <p className="text-xxs text-red-400 font-semibold">{stats.blockedUsersCount} bloklangan</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserToEdit({ isAddMode: true });
                      setIsEditUserModalOpen(true);
                    }}
                    title="Yangi mijoz qo'shish"
                    className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 flex items-center justify-center text-zinc-400 transition-all duration-300 active:scale-95 cursor-pointer shrink-0"
                  >
                    <FaUserPlus size={20} />
                  </button>
                </div>
              </div>

              {/* Quick Actions & Recent Pending Bookings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Pending Bookings */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FaHistory size={16} className="text-amber-500" />
                    Kutilayotgan yangi buyurtmalar
                  </h4>

                  {bookingsList.filter(b => b && b.status === 'pending').length === 0 ? (
                    <div className="text-center py-8 bg-zinc-950/40 border border-dashed border-zinc-850 rounded-xl">
                      <p className="text-zinc-500 text-sm">Barcha buyurtmalar ko'rib chiqilgan. Yangi buyurtmalar yo'q! 🎉</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookingsList.filter(b => b && b.status === 'pending').slice(0, 3).map((booking) => (
                        <div
                          key={booking.id || booking._id}
                          className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 backdrop-blur-sm relative overflow-hidden flex flex-col gap-3.5 hover:border-zinc-700/60 transition-all duration-300 animate-fadeIn"
                        >
                          {/* Glowing left accent border matching pending status */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]"></div>
                          
                          {/* Top section: Booking details */}
                          <div className="pl-1">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <span className="font-bold text-zinc-200 text-sm tracking-wide block">{booking.name}</span>
                                  <span className="text-[11px] text-zinc-550 font-mono font-medium block mt-0.5">{booking.phone}</span>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                  {booking.userId && booking.userId.status === 'blocked' && (
                                    <span className="text-[9px] font-extrabold uppercase bg-red-500/15 border border-red-500/30 text-red-400 px-1.5 py-0.5 rounded-full select-none animate-pulse">
                                      Bloklangan
                                    </span>
                                  )}
                                  {booking.paymentMethod === 'cash' ? (
                                    <span className="text-[10px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full select-none inline-flex items-center gap-1">
                                      <FaMoneyBillWave size={10} />
                                      <span>Joyida to'lash</span>
                                    </span>
                                  ) : (
                                    booking.receipt && (
                                      booking.receipt.includes('res.cloudinary.com') ? (
                                        <button
                                          onClick={() => setZoomedReceipt(booking.receipt)}
                                          className="text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full hover:bg-emerald-500/25 transition-colors cursor-pointer select-none inline-flex items-center gap-1"
                                        >
                                          <FaImage size={10} />
                                          <span>Chekni ko'rish</span>
                                        </button>
                                      ) : (
                                        <span className="text-[10px] font-semibold bg-zinc-800 border border-zinc-700/60 text-zinc-400 px-2 py-0.5 rounded-full select-none inline-flex items-center gap-1">
                                          <FaComment size={10} />
                                          <span>Chek Telegramda</span>
                                        </span>
                                      )
                                    )
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-zinc-400 mt-2">
                                <span>{booking.serviceName}</span> • <span className="text-emerald-400 font-bold">{formatPrice(booking.servicePrice)} so'm</span>
                              </div>
                              <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                                <FaClock size={10} />
                                <span>{booking.date} soat {booking.time}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Bottom Section: Compact Actions */}
                          <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800/40 pt-3 pl-1">
                            {/* Tasdiqlash Button */}
                            <button
                              disabled={actionLoading === (booking.id || booking._id) || successActions[booking.id || booking._id]}
                              onClick={() => handleUpdateBookingStatus(booking.id || booking._id, 'confirmed')}
                              className={`flex items-center justify-center gap-1.5 font-bold py-1.5 px-3 rounded-xl text-center transition-all active:scale-[0.97] border cursor-pointer text-[10px] ${
                                booking.status === 'confirmed' || successActions[booking.id || booking._id] === 'confirmed'
                                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                                  : 'bg-emerald-500/5 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/35'
                              }`}
                            >
                              {actionLoading === (booking.id || booking._id) && successActions[booking.id || booking._id] !== 'confirmed' ? (
                                <>
                                  <svg className="animate-spin h-3.5 w-3.5 text-emerald-400 animate-pulse" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Kutilmoqda</span>
                                </>
                              ) : (
                                <>
                                  <FaCheck size={11} className="shrink-0" />
                                  <span>{booking.status === 'confirmed' || successActions[booking.id || booking._id] === 'confirmed' ? 'Tasdiqlandi' : 'Tasdiqlash'}</span>
                                </>
                              )}
                            </button>

                            {/* Rad etish Button */}
                            <button
                              disabled={actionLoading === (booking.id || booking._id) || successActions[booking.id || booking._id]}
                              onClick={() => handleUpdateBookingStatus(booking.id || booking._id, 'rejected')}
                              className={`flex items-center justify-center gap-1.5 font-bold py-1.5 px-3 rounded-xl text-center transition-all active:scale-[0.97] border cursor-pointer text-[10px] ${
                                booking.status === 'rejected' || successActions[booking.id || booking._id] === 'rejected'
                                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20'
                                  : 'bg-red-500/5 border-red-500/25 text-red-400 hover:bg-red-500/10 hover:border-red-500/35'
                              }`}
                            >
                              {actionLoading === (booking.id || booking._id) && successActions[booking.id || booking._id] !== 'rejected' ? (
                                <>
                                  <svg className="animate-spin h-3.5 w-3.5 text-red-400 animate-pulse" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Kutilmoqda</span>
                                </>
                              ) : (
                                <>
                                  <FaTimes size={11} className="shrink-0" />
                                  <span>{booking.status === 'rejected' || successActions[booking.id || booking._id] === 'rejected' ? 'Rad etildi' : 'Rad etish'}</span>
                                </>
                              )}
                            </button>

                            {/* Bloklash Button */}
                            {booking.userId && (
                              <button
                                disabled={actionLoading === (booking.userId._id || booking.userId.id)}
                                onClick={() => handleBlockUser(booking.userId._id || booking.userId.id, booking.userId.status)}
                                className={`flex items-center justify-center gap-1.5 font-bold py-1.5 px-3 rounded-xl text-center transition-all active:scale-[0.97] border cursor-pointer text-[10px] ${
                                  booking.userId.status === 'blocked'
                                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/20'
                                    : 'bg-amber-500/5 border-amber-500/25 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/35'
                                }`}
                              >
                                {actionLoading === (booking.userId._id || booking.userId.id) ? (
                                  <>
                                    <svg className="animate-spin h-3.5 w-3.5 text-amber-400 animate-pulse" viewBox="0 0 24 24" fill="none">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Kutilmoqda</span>
                                  </>
                                ) : booking.userId.status === 'blocked' ? (
                                  <>
                                    <FaBan size={11} className="shrink-0" />
                                    <span>Bloklangan</span>
                                  </>
                                ) : (
                                  <>
                                    <FaBan size={11} className="shrink-0" />
                                    <span>Bloklash</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {bookingsList.filter(b => b && b.status === 'pending').length > 3 && (
                        <div className="text-center pt-2">
                          <Link
                            to="/admin?tab=bookings"
                            className="text-xs text-emerald-400 font-bold hover:underline"
                          >
                            Barcha kutilayotgan buyurtmalarni ko'rish ({bookingsList.filter(b => b && b.status === 'pending').length} ta) →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right column containing Kassa & System Stats */}
                <div className="space-y-6">
                  {/* System Stats Summary */}
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <FaCog size={16} className="text-emerald-500" />
                        Tizim Xulosasi
                      </h4>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-zinc-400">Jami buyurtmalar:</span>
                          <span className="font-bold text-white">{stats.totalBookings} ta</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-zinc-400">Kutilmoqda:</span>
                          <span className="font-bold text-amber-400">{bookingsList.filter(b => b && b.status === 'pending').length} ta</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-zinc-400">Tasdiqlangan:</span>
                          <span className="font-bold text-emerald-400">{bookingsList.filter(b => b && b.status === 'confirmed').length} ta</span>
                        </div>
                        <div className="flex justify-between pb-2">
                          <span className="text-zinc-400">Rad etilgan:</span>
                          <span className="font-bold text-red-400">{bookingsList.filter(b => b && b.status === 'rejected').length} ta</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5">
                      <Link
                        to="/admin?tab=statistics"
                        className="w-full inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all text-center"
                      >
                        Batafsil Moliya & Grafiklar →
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          )}

          {/* ================= TAB: STATISTICS ================= */}
          {activeTab === 'statistics' && stats && (
            <div className="space-y-8 animate-fadeIn">

              {/* Charts Panel: SVG Trend Line Chart & Popular Services */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Revenue Chart (2/3 width) */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <FaChartLine size={18} className="text-emerald-500" />
                    Hafta grafigi
                  </h4>
                  
                  {/* SVG Chart */}
                  <div className="relative w-full flex select-none pt-2">
                    {/* Y-axis Labels on Left */}
                    {stats.chartData && stats.chartData.length > 0 && (() => {
                      const maxVal = Math.max(...stats.chartData.map(c => c.value)) || 100000;
                      return (
                        <div className="w-6 h-36 text-[9px] text-zinc-500 font-mono font-bold select-none text-right pr-1 flex flex-col justify-between">
                          <div>{maxVal >= 1000 ? `${(maxVal / 1000).toLocaleString()}k` : maxVal}</div>
                          <div>{maxVal >= 1000 ? `${((maxVal * 0.75) / 1000).toLocaleString()}k` : Math.round(maxVal * 0.75)}</div>
                          <div>{maxVal >= 1000 ? `${((maxVal * 0.5) / 1000).toLocaleString()}k` : Math.round(maxVal * 0.5)}</div>
                          <div>{maxVal >= 1000 ? `${((maxVal * 0.25) / 1000).toLocaleString()}k` : Math.round(maxVal * 0.25)}</div>
                          <div>0</div>
                        </div>
                      );
                    })()}

                    {/* Chart Canvas Area */}
                    <div className="flex-1 flex flex-col ml-1">
                      {/* SVG Canvas wrapper */}
                      <div className="relative h-36 w-full">
                        {/* SVG canvas */}
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines inside SVG */}
                          <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                          <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                          <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                          {/* Area beneath the curve */}
                          {stats.chartData && stats.chartData.length > 0 && (
                            <polygon
                              points={`
                                0,100
                                ${stats.chartData.map((d, index) => {
                                  const x = (index / (stats.chartData.length - 1)) * 100;
                                  const maxVal = Math.max(...stats.chartData.map(c => c.value)) || 100000;
                                  const y = 100 - (d.value / maxVal) * 100;
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
                                const y = 100 - (d.value / maxVal) * 100;
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
                            const y = 100 - (d.value / maxVal) * 100;
                            const isHovered = hoveredPoint && hoveredPoint.index === index;
                            return (
                              <g key={index}>
                                {/* Visible point circle */}
                                <circle
                                  cx={x}
                                  cy={y}
                                  r={isHovered ? "2.5" : "1.8"}
                                  fill={isHovered ? "#34d399" : "#059669"}
                                  stroke="#ffffff"
                                  strokeWidth="0.5"
                                  style={{ transition: 'all 0.2s ease' }}
                                />
                                {/* Invisible large hotspot circle for easy hovering */}
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="8"
                                  fill="transparent"
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredPoint({
                                    index,
                                    x,
                                    y,
                                    value: d.value,
                                    date: d.label,
                                    onlineValue: d.onlineValue || 0,
                                    offlineValue: d.offlineValue || 0
                                  })}
                                  onMouseLeave={() => setHoveredPoint(null)}
                                />
                              </g>
                            );
                          })}
                        </svg>

                        {/* Tooltip */}
                        {hoveredPoint && (() => {
                          let leftVal = `${hoveredPoint.x}%`;
                          let transformVal = 'translate(-50%, -115%)';
                          
                          if (hoveredPoint.index === 0) {
                            leftVal = '0%';
                            transformVal = 'translate(0, -115%)';
                          } else if (hoveredPoint.index === stats.chartData.length - 1) {
                            leftVal = '100%';
                            transformVal = 'translate(-100%, -115%)';
                          }
                          
                          return (
                            <div
                              style={{
                                position: 'absolute',
                                left: leftVal,
                                top: `${hoveredPoint.y}%`,
                                transform: transformVal,
                                pointerEvents: 'none'
                              }}
                              className="bg-zinc-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-xxs font-sans shadow-2xl z-30 min-w-[130px] animate-tooltipSimpleFade text-left"
                            >
                              <p className="text-zinc-400 font-bold mb-0.5">{hoveredPoint.date}</p>
                              <p className="text-emerald-400 font-extrabold text-xs">Jami: {hoveredPoint.value.toLocaleString()} so'm</p>
                              <div className="text-[9px] text-zinc-500 mt-1 border-t border-white/5 pt-1 space-y-0.5">
                                <div className="flex justify-between gap-2">
                                  <span>🌐 Online:</span>
                                  <span className="text-white font-semibold">{hoveredPoint.onlineValue.toLocaleString()} so'm</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <span>💵 Kassa (Offline):</span>
                                  <span className="text-white font-semibold">{hoveredPoint.offlineValue.toLocaleString()} so'm</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Chart Labels under X axis */}
                      <div className="relative h-8 mt-2.5 w-full pointer-events-none">
                        {stats.chartData && stats.chartData.map((d, index) => {
                          const x = (index / (stats.chartData.length - 1)) * 100;
                          const dayName = d.label.split(' ')[0];
                          const dateStr = d.label.split(' ')[1] || '';
                          
                          // Uzbek 2-letter mapping
                          const shortDayMap = {
                            'Yak': 'Ya',
                            'Dush': 'Du',
                            'Sesh': 'Se',
                            'Chor': 'Ch',
                            'Pay': 'Pa',
                            'Jum': 'Ju',
                            'Shan': 'Sh'
                          };
                          const shortDay = shortDayMap[dayName] || dayName;
                          
                          let transformStyle = 'translateX(-50%)';
                          if (index === 0) {
                            transformStyle = 'translateX(0)';
                          } else if (index === stats.chartData.length - 1) {
                            transformStyle = 'translateX(-100%)';
                          }
                          
                          return (
                            <div
                              key={index}
                              style={{
                                position: 'absolute',
                                left: `${x}%`,
                                transform: transformStyle,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                              }}
                            >
                              <span className="text-zinc-450 font-extrabold text-[9px] uppercase tracking-wider">{shortDay}</span>
                              {dateStr && (
                                <span className="text-zinc-600 text-[8px] font-bold font-mono mt-0.5">{dateStr}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>


                </div>

                {/* 2. Popular Services (1/3 width) */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center gap-2 mb-6">
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        <FaCut size={18} className="text-emerald-500" />
                        Xizmatlar
                      </h4>
                      <div className="relative" ref={timeframeDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsTimeframeDropdownOpen(!isTimeframeDropdownOpen)}
                          className="flex items-center gap-2 px-3 py-2 bg-zinc-950/60 border border-white/10 hover:border-emerald-500/50 rounded-xl outline-none text-xs font-bold text-zinc-300 hover:text-white transition-all duration-300 cursor-pointer select-none"
                        >
                          <FaClock size={11} className="text-emerald-500" />
                          <span>
                            {servicesTimeframe === 'day' && 'Bugun'}
                            {servicesTimeframe === 'week' && 'Hafta'}
                            {servicesTimeframe === 'month' && 'Oy'}
                            {servicesTimeframe === 'all' && 'Hammasi'}
                          </span>
                          <FaChevronDown size={10} className={`text-zinc-400 transition-transform duration-300 ${isTimeframeDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                        </button>

                        {/* Dropdown Options Menu */}
                        {isTimeframeDropdownOpen && (
                          <div className="absolute right-0 top-full mt-2 z-[40] w-32 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-fadeIn p-1">
                            {[
                              { id: 'day', label: 'Bugun' },
                              { id: 'week', label: 'Hafta' },
                              { id: 'month', label: 'Oy' },
                              { id: 'all', label: 'Hammasi' }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setServicesTimeframe(opt.id);
                                  setIsTimeframeDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer border-none ${
                                  servicesTimeframe === opt.id
                                    ? 'bg-emerald-500/10 text-emerald-400 font-extrabold'
                                    : 'bg-transparent text-zinc-450 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Popular Services List */}
                    <div className="space-y-4">
                      {(() => {
                        const filteredServices = getFilteredServicesStats();
                        if (filteredServices.length === 0) {
                          return (
                            <div className="text-center py-10 bg-zinc-950/20 border border-dashed border-zinc-850 rounded-2xl animate-fadeIn">
                              <p className="text-zinc-500 text-xs font-medium">Ushbu vaqt oralig'ida buyurtmalar mavjud emas.</p>
                            </div>
                          );
                        }

                        const totalCounts = filteredServices.reduce((sum, s) => sum + s.count, 0) || 1;

                        return filteredServices.map((service, index) => {
                          const pct = Math.round((service.count / totalCounts) * 100);

                          return (
                            <div key={service.name} className="space-y-1.5 animate-fadeIn">
                              <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-zinc-300 truncate max-w-[240px] flex items-center gap-1.5">
                                  <span>{index + 1}. {service.name}</span>
                                  <span className="text-[10px] font-normal text-zinc-550 shrink-0">
                                    ({formatPrice(service.price)} so'm)
                                  </span>
                                </span>
                                <span className="font-bold text-white">{service.count} ta</span>
                              </div>
                              
                              {/* Glassmorphic progress bar */}
                              <div className="w-full bg-zinc-950/40 rounded-lg h-4 overflow-hidden border border-white/5 relative flex items-center shadow-inner">
                                <div
                                  style={{ width: `${pct}%` }}
                                  className="bg-linear-to-r from-emerald-500 to-green-400 h-full rounded-lg transition-all duration-1000 flex items-center justify-end pr-1.5"
                                >
                                  {pct >= 15 && (
                                    <span className="text-[9px] font-extrabold text-zinc-950 select-none leading-none">{pct}%</span>
                                  )}
                                </div>
                                {pct < 15 && (
                                  <span className="text-[9px] font-extrabold text-zinc-400 select-none pl-1.5 leading-none">{pct}%</span>
                                )}
                              </div>
                              
                              <div className="flex justify-end text-xxs mt-1">
                                <span className="text-emerald-400/80 font-bold">Jami: {(service.revenue || 0).toLocaleString()} so'm</span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-4 mt-6 text-center text-xs text-zinc-500">
                    Tanlangan davrdagi jami xizmatlar: <strong className="text-white">
                      {getFilteredServicesStats().reduce((sum, s) => sum + s.count, 0)} ta
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: SUBSCRIPTION ================= */}
          {activeTab === 'subscription' && (
            <div className="w-full text-white px-0 sm:px-4 py-2 pb-4 animate-fadeIn">
              <div className="max-w-xl mx-auto space-y-6">
                
                {/* Header with Back button */}
                <div className="flex items-center gap-3">
                  {!isSubscriptionExpired && (
                    <button
                      onClick={() => setSearchParams({ tab: 'profile' })}
                      className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer transition-colors active:scale-95 animate-fadeIn"
                    >
                      <FaArrowLeft size={16} />
                    </button>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <FaCoins className="text-emerald-400" size={20} />
                      <span>To'lov va Obuna holati</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">Ilovadan foydalanish obunasi va to'lovlar tarixi</p>
                  </div>
                </div>

                {/* Subscription Status Card */}
                <div className={`border rounded-3xl p-6 backdrop-blur-xl shadow-xl transition-all duration-300 ${
                  isSubscriptionExpired
                    ? 'bg-red-500/10 border-red-500/20 shadow-red-500/5'
                    : 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Ilova holati</span>
                    <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full ${
                      isSubscriptionExpired
                        ? 'bg-red-500/20 text-red-400 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {isSubscriptionExpired ? "Qarzdorlik" : "Faol Obuna"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-zinc-400 text-xs font-medium block mb-1.5">Obuna muddati tugash sanasi:</span>
                      {mySubscription.subscriptionExpiresAt ? (() => {
                        const expiry = formatSubscriptionExpiry(mySubscription.subscriptionExpiresAt);
                        return (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <span className="text-xl font-black text-white tracking-wide">
                              {expiry.dateFormatted}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold w-fit ${
                              expiry.expired 
                                ? 'bg-red-500/10 text-red-400 border border-red-500/25 animate-pulse' 
                                : expiry.daysLeft <= 7
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                            }`}>
                              {expiry.badgeText}
                            </span>
                          </div>
                        );
                      })() : (
                        <div className="text-lg font-extrabold text-zinc-500">Kiritilmagan</div>
                      )}
                    </div>

                    {isSubscriptionExpired ? (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-xs font-semibold text-red-400 flex items-start gap-2.5">
                        <FaExclamationTriangle className="shrink-0 text-red-400 mt-0.5 animate-bounce" size={16} />
                        <div>
                          <p className="font-bold">Ilovadan foydalanish vaqtincha cheklandi!</p>
                          <p className="mt-1 text-zinc-300 leading-relaxed font-normal">Obuna to'lovi amalga oshirilmagan yoki muddati tugagan. Davom ettirish uchun tizim administratoriga murojaat qiling va to'lov chekini taqdim eting.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-xs font-semibold text-emerald-400 flex items-start gap-2.5">
                        <FaCheckCircle className="shrink-0 text-emerald-400 mt-0.5" size={16} />
                        <div>
                          <p className="font-bold">Sizning obunangiz faol holatda!</p>
                          <p className="mt-1 text-zinc-300 leading-relaxed font-normal">Tizimning barcha imkoniyatlaridan to'liq foydalanishingiz mumkin.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Support (Admin Contacts) */}
                <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-xl space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">To'lov qilish uchun bog'lanish</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Obunani uzaytirish yoki to'lov qilish uchun quyidagi kontaktlarga murojaat qiling:</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Telegram support link */}
                    <a
                      href="https://t.me/AlimardonToshpulatov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-zinc-950/60 border border-white/5 hover:border-sky-500/30 rounded-2xl transition-all duration-300 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors shrink-0">
                        <FaPaperPlane size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-[9px] text-zinc-500 uppercase tracking-wider font-bold">Admin Telegram</span>
                        <span className="text-xs font-semibold text-zinc-200 truncate block group-hover:text-white transition-colors">
                          @AlimardonToshpulatov
                        </span>
                      </div>
                    </a>

                    {/* Phone support link */}
                    <a
                      href="tel:+998509509545"
                      className="flex items-center gap-3 px-4 py-3 bg-zinc-950/60 border border-white/5 hover:border-emerald-500/30 rounded-2xl transition-all duration-300 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors shrink-0">
                        <FaPhone size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-[9px] text-zinc-500 uppercase tracking-wider font-bold">Admin Telefon</span>
                        <span className="text-xs font-semibold text-zinc-200 truncate block group-hover:text-white transition-colors">
                          +998 (50) 950-95-45
                        </span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Payment History Log */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 px-1 flex-row">
                    <FaHistory size={14} />
                    <span>To'lovlar tarixi ({mySubscription.payments?.length || 0})</span>
                  </h3>

                  {subscriptionLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 bg-zinc-900/40 border border-white/5 rounded-3xl">
                      <FaSpinner size={20} className="animate-spin text-emerald-400 mb-2" />
                      <p className="text-zinc-500 text-xs font-medium">Yuklanmoqda...</p>
                    </div>
                  ) : !mySubscription.payments || mySubscription.payments.length === 0 ? (
                    <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 text-center text-zinc-500">
                      <p className="text-xs font-semibold">To'lovlar tarixi mavjud emas</p>
                      <p className="text-[10px] text-zinc-650 mt-0.5">Siz to'lagan obuna cheklari bu yerda ro'yxat bo'lib ko'rinadi.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {mySubscription.payments.map((payment) => {
                        const from = new Date(payment.fromDate).toLocaleDateString('uz-UZ');
                        const to = new Date(payment.toDate).toLocaleDateString('uz-UZ');
                        const isPaymentExpired = new Date(payment.toDate) < new Date();

                        return (
                          <div
                            key={payment._id}
                            className="bg-zinc-900/50 border border-white/5 rounded-3xl p-4.5 space-y-3.5 relative overflow-hidden group shadow-lg"
                          >
                            {/* Left indicator accent color */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
                              isPaymentExpired ? 'bg-red-500/50' : 'bg-emerald-500/50'
                            }`}></div>

                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white">
                                  {((payment.amount || 0) * (payment.monthsCount || 1)).toLocaleString('uz-UZ')} UZS
                                </div>
                                <div className="text-[10px] text-zinc-400 font-semibold">
                                  Muddat: {payment.monthsCount} oy ({from} dan - {to} gacha)
                                </div>
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isPaymentExpired ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                              }`}>
                                {isPaymentExpired ? "Eski" : "Faol"}
                              </span>
                            </div>

                            {payment.notes && (
                              <p className="text-xs text-zinc-400 leading-relaxed italic bg-zinc-950/20 border border-white/5 rounded-xl p-2.5 font-medium font-sans">
                                Izoh: {payment.notes}
                              </p>
                            )}

                            {payment.receiptUrl ? (
                              <div className="flex items-center justify-between gap-3 bg-zinc-950/40 border border-white/5 rounded-2xl p-2.5 backdrop-blur-sm">
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">To'lov hujjati (Check)</span>
                                <button
                                  type="button"
                                  onClick={() => setZoomedReceipt(payment.receiptUrl)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 hover:border-emerald-500/30 text-zinc-300 hover:text-emerald-400 text-[10px] font-bold transition-all cursor-pointer select-none active:scale-95 shrink-0"
                                >
                                  <span>Checkni ko'rish</span>
                                  <FaExternalLinkAlt size={9} />
                                </button>
                              </div>
                            ) : (
                              <div className="bg-zinc-950/10 border border-white/5 rounded-2xl p-2.5 text-center">
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider italic">Check hujjati yuklanmagan</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB: PROFILE ================= */}
          {activeTab === 'profile' && (
            <div className="w-full text-white px-0 sm:px-4 py-2 pb-4 animate-fadeIn">
              <div className="max-w-md mx-auto space-y-5">
                
                 {/* Success / Error Alerts */}
                {profileError && (
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold animate-fade-in">
                    {profileError}
                  </div>
                )}
                {profileSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-fade-in">
                    {profileSuccess}
                  </div>
                )}

                {isEditingProfile ? (
                  /* Editing Form Card */
                  <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-xl space-y-4">
                    <h3 className="text-base font-bold text-white mb-2 border-b border-white/5 pb-3">Profilni tahrirlash</h3>
                    <form onSubmit={handleSaveAdminProfile} className="space-y-4" autoComplete="off">
                      {/* Name Input */}
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Ism</label>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          disabled={isProfileUpdating}
                          className="w-full bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                          placeholder={user?.name || "Ismingizni kiriting"}
                          autoComplete="off"
                        />
                      </div>

                      {/* Phone Input */}
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Telefon raqam</label>
                        <div className="relative flex items-center">
                          <FaPhone size={12} className="absolute left-3 text-zinc-500 z-10" />
                          <input
                            type="text"
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                            disabled={isProfileUpdating}
                            className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                            placeholder={user?.phone || "+998 99 999 99 99"}
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      {/* Telegram Username Input */}
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Telegram username</label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-zinc-500 text-sm font-semibold">@</span>
                          <input
                            type="text"
                            value={editedTelegram}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditedTelegram(val.startsWith('@') ? val.substring(1) : val);
                            }}
                            disabled={isProfileUpdating}
                            className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                            placeholder={user?.telegram || "username"}
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      {/* Barber Code Input */}
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Sartarosh kodi</label>
                        <div className="relative flex items-center">
                          <FaCut size={12} className="absolute left-3 text-zinc-500 z-10" />
                          <input
                            type="text"
                            value={editedSlug}
                            onChange={(e) => {
                              setEditedSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''));
                            }}
                            disabled={isProfileUpdating}
                            className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                            placeholder={user?.slug || "sartarosh kodi"}
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Yangi parol (ixtiyoriy)</label>
                        <div className="relative flex items-center">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={editedPassword}
                            onChange={(e) => setEditedPassword(e.target.value)}
                            disabled={isProfileUpdating}
                            className="w-full bg-zinc-850/80 border border-white/10 rounded-xl pl-3 pr-10 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                            placeholder="Bo'sh qoldirilsa o'zgarmaydi"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
                          >
                            {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          disabled={isProfileUpdating}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50"
                        >
                          {isProfileUpdating ? (
                            <FaSpinner size={12} className="animate-spin" />
                          ) : (
                            <FaSave size={12} />
                          )}
                          <span>Saqlash</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          disabled={isProfileUpdating}
                          className="flex-1 bg-zinc-800 border border-white/5 hover:bg-zinc-750 text-gray-300 font-semibold py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50"
                        >
                          <FaTimes size={12} />
                          <span>Bekor qilish</span>
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Profile Details & Navigation lists */
                  <>
                    {/* User Info Header Card */}
                    <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl">
                      <div className="flex items-center gap-4">
                        <div className="relative group shrink-0">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300 animate-pulse"></div>
                          <img 
                            src="/avatar/men.png" 
                            alt="Profile" 
                            className="relative w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30" 
                          />
                          <span className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center text-[8px]" title="Online">
                            ✓
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold tracking-wide text-white truncate">{user?.name}</h3>
                          <p className="text-xs text-zinc-400 font-medium mt-0.5">{user?.phone}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="inline-block px-2.5 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                              Sartarosh
                            </span>
                          </div>
                        </div>
                        {/* Edit profile header shortcut */}
                        <button
                          onClick={() => {
                            setIsEditingProfile(true);
                            setProfileError('');
                          }}
                          className="w-10 h-10 rounded-xl bg-zinc-800/80 hover:bg-zinc-855 border border-white/5 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shrink-0"
                          title="Profilni tahrirlash"
                        >
                          <FaEdit size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Group 1: Manage Sections */}
                    <div className="bg-zinc-900/70 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
                      <div className="p-1">
                        {/* Item 1: Mijozlar Boshqaruvi */}
                        <button
                          onClick={() => setSearchParams({ tab: 'users' })}
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-white/5 text-left font-sans"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <FaUsers size={16} />
                          </div>
                          <span className="flex-1 text-sm font-semibold text-zinc-200">Mijozlar boshqaruvi</span>
                          <FaChevronRight size={12} className="text-zinc-500" />
                        </button>

                        {/* Item 2: Bildirishnomalar Boshqaruvi */}
                        <button
                          onClick={() => setSearchParams({ tab: 'notifications' })}
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-white/5 text-left font-sans"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <FaBell size={16} />
                          </div>
                          <span className="flex-1 text-sm font-semibold text-zinc-200">Bildirishnomalar boshqaruvi</span>
                          <FaChevronRight size={12} className="text-zinc-500" />
                        </button>

                        {/* Item 3: Dastur Yo'riqnomalari (Tutorials) */}
                        <button
                          onClick={() => setSearchParams({ tab: 'tutorials' })}
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-white/5 text-left font-sans"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <FaBookOpen size={16} />
                          </div>
                          <span className="flex-1 text-sm font-semibold text-zinc-200">Boshqaruv tizimi darsliklari</span>
                          <FaChevronRight size={12} className="text-zinc-500" />
                        </button>

                        {/* Item 4: Ish jadvali boshqaruvi */}
                        <button
                          onClick={() => setSearchParams({ tab: 'schedule' })}
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-white/5 text-left font-sans"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <FaCalendarAlt size={16} />
                          </div>
                          <span className="flex-1 text-sm font-semibold text-zinc-200">Ish jadvali boshqaruvi</span>
                          <FaChevronRight size={12} className="text-zinc-500" />
                        </button>

                        {/* Item 5: Sartarosh ma'lumotlari */}
                        <button
                          onClick={() => setSearchParams({ tab: 'barber-info' })}
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-white/5 text-left font-sans"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <FaCut size={16} />
                          </div>
                          <span className="flex-1 text-sm font-semibold text-zinc-200">Sartarosh ma'lumotlari</span>
                          <FaChevronRight size={12} className="text-zinc-500" />
                        </button>

                        {/* Item 6: To'lov va obuna */}
                        <button
                          onClick={() => setSearchParams({ tab: 'subscription' })}
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer text-left font-sans"
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSubscriptionExpired 
                              ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                              : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          }`}>
                            <FaCoins size={16} />
                          </div>
                          <span className="flex-1 text-sm font-semibold text-zinc-200 flex items-center gap-2">
                            <span>To'lov va obuna</span>
                            {isSubscriptionExpired && (
                              <span className="px-1.5 py-0.5 text-[8px] font-black bg-red-500/20 text-red-400 border border-red-500/35 uppercase tracking-wider animate-pulse rounded-md">
                                Qarzdorlik
                              </span>
                            )}
                          </span>
                          <FaChevronRight size={12} className="text-zinc-500" />
                        </button>
                      </div>
                    </div>

                    {/* Group 2: Developer Contact Info */}
                    <div className="bg-zinc-900/70 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
                      <div className="p-1">
                        {/* Item 1: Telegram Link */}
                        <a
                          href="https://t.me/AlimardonToshpulatov"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-all duration-200 border-b border-white/5 text-left font-sans cursor-pointer group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 group-hover:bg-sky-500/20 group-hover:border-sky-500/30 flex items-center justify-center text-sky-400 transition-colors duration-200 shrink-0">
                            <FaPaperPlane size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-[10px] text-gray-400 uppercase tracking-wider">Dasturchi Telegram</span>
                            <span className="text-sm font-semibold text-zinc-200 truncate block group-hover:text-white transition-colors duration-200">
                              @AlimardonToshpulatov
                            </span>
                          </div>
                          <FaChevronRight size={12} className="text-zinc-500 group-hover:text-zinc-300 transition-colors duration-200" />
                        </a>

                        {/* Item 2: Phone Link */}
                        <a
                          href="tel:+998509509545"
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-all duration-200 text-left font-sans cursor-pointer group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 flex items-center justify-center text-emerald-400 transition-colors duration-200 shrink-0">
                            <FaPhone size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-[10px] text-gray-400 uppercase tracking-wider">Dasturchi Telefon</span>
                            <span className="text-sm font-semibold text-zinc-200 truncate block group-hover:text-white transition-colors duration-200">
                              +998 (50) 950-95-45
                            </span>
                          </div>
                          <FaChevronRight size={12} className="text-zinc-500 group-hover:text-zinc-300 transition-colors duration-200" />
                        </a>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2">
                      <button
                        onClick={logout}
                        className="w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-semibold py-3.5 px-4 rounded-2xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm font-sans"
                      >
                        <FaSignOutAlt size={16} />
                        <span>Tizimdan chiqish</span>
                      </button>
                    </div>

                    {/* Version info */}
                    
                  </>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB: BARBER INFO ================= */}
          {activeTab === 'barber-info' && (
            <div className="w-full text-white px-0 sm:px-4 py-2 pb-4 animate-fadeIn">
              <div className="max-w-xl mx-auto space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => setSearchParams({ tab: 'profile' })}
                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer transition-colors active:scale-95"
                  >
                    <FaArrowLeft size={16} />
                  </button>
                  <h2 className="text-xl font-bold text-white">Mijozlar ko'radigan ma'lumotlar</h2>
                </div>

                <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-xl">
                  <form onSubmit={handleSaveBarberInfo} className="space-y-4" autoComplete="off">
                    {/* Salon nomi */}
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Salon nomi</label>
                      <input
                        type="text"
                        value={editedShopName}
                        onChange={(e) => setEditedShopName(e.target.value)}
                        disabled={isBarberInfoSaving}
                        className="w-full bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                        placeholder="Salon nomini kiriting"
                        required
                      />
                    </div>



                    {/* Avatar URL */}
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Rasm havolasi (Avatar URL)</label>
                      <input
                        type="text"
                        value={editedAvatar}
                        onChange={(e) => setEditedAvatar(e.target.value)}
                        disabled={isBarberInfoSaving}
                        className="w-full bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                        placeholder="/barber/1.png"
                        required
                      />
                    </div>

                    {/* Tajriba boshlangan yil va Yillar */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Tajriba boshlangan yil</label>
                        <input
                          type="number"
                          value={editedExperienceStartYear}
                          onChange={(e) => setEditedExperienceStartYear(e.target.value)}
                          disabled={isBarberInfoSaving}
                          className="w-full bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                          placeholder="2011"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Tajriba yillari</label>
                        <input
                          type="number"
                          value={editedExperienceYears}
                          onChange={(e) => setEditedExperienceYears(e.target.value)}
                          disabled={isBarberInfoSaving}
                          className="w-full bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                          placeholder="15"
                          required
                        />
                      </div>
                    </div>

                    {/* Men haqimda (Bio) */}
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Men haqimda (Tarjimai hol)</label>
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        disabled={isBarberInfoSaving}
                        rows={4}
                        className="w-full bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 resize-none font-sans"
                        placeholder="Mijozlarga ko'rinadigan tarjimai holingizni kiriting..."
                      />
                    </div>

                    {/* Ijtimoiy tarmoqlar */}
                    <div className="border-t border-white/5 pt-4 space-y-4">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Ijtimoiy tarmoqlar (Username)</h4>
                      
                      <div className="grid grid-cols-2 gap-3.5 md:gap-4">
                        {/* Telegram */}
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Telegram (username)</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-zinc-550 text-sm font-semibold">@</span>
                            <input
                              type="text"
                              value={editedTelegram}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditedTelegram(val.startsWith('@') ? val.substring(1) : val);
                              }}
                              disabled={isBarberInfoSaving}
                              className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                              placeholder="username"
                            />
                          </div>
                        </div>

                        {/* Instagram */}
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Instagram (username)</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-zinc-550 text-sm font-semibold">@</span>
                            <input
                              type="text"
                              value={editedInstagram}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditedInstagram(val.startsWith('@') ? val.substring(1) : val);
                              }}
                              disabled={isBarberInfoSaving}
                              className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                              placeholder="username"
                            />
                          </div>
                        </div>

                        {/* Facebook */}
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Facebook (username)</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-zinc-550 text-sm font-semibold">@</span>
                            <input
                              type="text"
                              value={editedFacebook}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditedFacebook(val.startsWith('@') ? val.substring(1) : val);
                              }}
                              disabled={isBarberInfoSaving}
                              className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                              placeholder="username"
                            />
                          </div>
                        </div>

                        {/* YouTube */}
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">YouTube (username)</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-zinc-550 text-sm font-semibold">@</span>
                            <input
                              type="text"
                              value={editedYoutube}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditedYoutube(val.startsWith('@') ? val.substring(1) : val);
                              }}
                              disabled={isBarberInfoSaving}
                              className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                              placeholder="username"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tugmalar */}
                    <div className="flex gap-3 pt-4 border-t border-white/5">
                      <button
                        type="submit"
                        disabled={isBarberInfoSaving}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
                      >
                        {isBarberInfoSaving ? (
                          <FaSpinner size={16} className="animate-spin" />
                        ) : (
                          <FaSave size={16} />
                        )}
                        <span>Saqlash</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSearchParams({ tab: 'profile' })}
                        disabled={isBarberInfoSaving}
                        className="flex-1 bg-zinc-800 border border-white/5 hover:bg-zinc-750 text-gray-300 font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
                      >
                        <FaTimes size={16} />
                        <span>Bekor qilish</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: SCHEDULE ================= */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
              {/* Back Button Header Card */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSearchParams({ tab: 'profile' })}
                    className="p-2.5 rounded-xl border border-white/10 bg-zinc-800/50 hover:bg-zinc-800 hover:border-emerald-500/30 text-emerald-400 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0 shadow-sm"
                    title="Profilga qaytish"
                  >
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold leading-tight text-white">Ish jadvali boshqaruvi</h3>
                    <p className="text-zinc-400 text-xs mt-0.5">Sartaroshning band kunlarini va soatlarini sozlash</p>
                  </div>
                </div>
              </div>

              {/* Form & List Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* 1. Form Card */}
                <div className="lg:col-span-5 relative bg-zinc-950/70 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl overflow-hidden space-y-5 z-10">
                  <div className="absolute top-0 -left-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
                  
                  <div>
                    <h4 className="text-base font-bold flex items-center gap-2 text-white">
                      <FaCalendarAlt size={16} className="text-emerald-500 animate-pulse" />
                      <span>Vaqtni band qilish (Bloklash)</span>
                    </h4>
                    <p className="text-xs text-zinc-450 mt-1 leading-normal">
                      Sartaroshning shaxsiy ishi chiqib qolganda, ma'lum sana yoki soatlarni band qibly qo'yish uchun foydalaniladi. Mijozlar bu vaqtlarda buyurtma bera olmaydilar.
                    </p>
                  </div>

                  <form onSubmit={handleSaveBlockedSchedule} className="space-y-4">
                    {/* Date Input */}
                    <div className="flex flex-col relative" ref={blockCalendarRef}>
                      <label className="text-xs font-semibold text-zinc-400 mb-1.5 pl-1">
                        Sanani tanlang
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsBlockCalendarOpen(!isBlockCalendarOpen)}
                        className={`w-full flex items-center justify-between px-4 py-3 bg-white/5 border rounded-xl outline-none text-sm text-white cursor-pointer transition-all duration-300 ${
                          isBlockCalendarOpen
                            ? 'border-emerald-500 ring-4 ring-emerald-500/10'
                            : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/10'
                        }`}
                      >
                        <span className={`${selectedBlockDate ? 'text-white' : 'text-zinc-500'} font-medium`}>
                          {formatSelectedBlockDateUz()}
                        </span>
                        <svg
                          className={`w-5 h-5 text-emerald-400 transition-transform duration-300 ${isBlockCalendarOpen ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown Custom Calendar Popup */}
                      {isBlockCalendarOpen && (
                        <div
                          className="absolute top-full left-0 right-0 mt-2 z-50 animate-fadeIn"
                          style={{
                            background: 'linear-gradient(145deg, rgba(18,20,26,0.98), rgba(12,14,19,0.99))',
                            border: '1px solid rgba(255,255,255,0.09)',
                            borderRadius: '18px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(16,185,129,0.1)',
                            backdropFilter: 'blur(30px)',
                            padding: '16px',
                          }}
                        >
                          {/* Calendar Header */}
                          <div className="flex items-center justify-between mb-3">
                            <button
                              type="button"
                              onClick={handleBlockPrevMonth}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white cursor-pointer transition-all duration-250 active:scale-90"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
                              {kassaMonths[blockCalendarViewDate.getMonth()]} {blockCalendarViewDate.getFullYear()}
                            </h4>
                            <button
                              type="button"
                              onClick={handleBlockNextMonth}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white cursor-pointer transition-all duration-250 active:scale-90"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>

                          {/* Weekdays */}
                          <div className="grid grid-cols-7 gap-1 mb-2 pb-2 border-b border-white/5">
                            {kassaDaysOfWeek.map(day => (
                              <div key={day} className="text-center text-[10px] font-bold py-0.5 text-emerald-400 select-none">
                                {day}
                              </div>
                            ))}
                          </div>

                          {/* Days Grid */}
                          <div className="grid grid-cols-7 gap-1">
                            {getBlockCalendarDays().map((date, index) => {
                              if (!date) return <div key={`empty-${index}`} className="h-8" />;
                              
                              const dateToCheck = new Date(date);
                              dateToCheck.setHours(0, 0, 0, 0);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              
                              const isDisabled = dateToCheck < today;
                              const isSunday = date.getDay() === 0;
                              
                              const isSelected = selectedBlockDate && date.toDateString() === parseToDate(selectedBlockDate).toDateString();
                              const isToday = date.toDateString() === new Date().toDateString();
                              
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  disabled={isDisabled}
                                  onClick={() => handleBlockDateSelect(date)}
                                  className={`h-8 w-full flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    isDisabled
                                      ? 'text-zinc-700 cursor-not-allowed opacity-40'
                                      : 'cursor-pointer hover:bg-emerald-500/10'
                                  }`}
                                  style={{
                                    background: isSelected
                                      ? 'linear-gradient(135deg, #10b981, #059669)'
                                      : isToday && !isSelected ? 'rgba(16,185,129,0.12)' : 'transparent',
                                    border: isSelected
                                      ? '1px solid rgba(52,211,153,0.5)'
                                      : isToday && !isSelected ? '1px solid rgba(52,211,153,0.4)' : '1px solid transparent',
                                    color: isSelected
                                      ? 'white'
                                      : isDisabled
                                      ? ''
                                      : isSunday
                                      ? '#ef4444'
                                      : isToday
                                      ? '#34d399'
                                      : 'rgba(255,255,255,0.75)',
                                    boxShadow: isSelected ? '0 4px 15px rgba(16,185,129,0.35)' : 'none',
                                  }}
                                >
                                  {date.getDate()}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Block Type Tabs */}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-zinc-400 mb-1.5 pl-1">
                        Bloklash turi
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-zinc-900/80 p-1 rounded-xl border border-white/5">
                        <button
                          type="button"
                          onClick={() => setBlockAllDay(true)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            blockAllDay
                              ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                              : 'text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          Butun kunni bloklash
                        </button>
                        <button
                          type="button"
                          onClick={() => setBlockAllDay(false)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            !blockAllDay
                              ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                              : 'text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          Ma'lum soatlarni bloklash
                        </button>
                      </div>
                    </div>

                    {/* Time Slots Chips (Conditional) */}
                    {!blockAllDay && (
                      <div className="flex flex-col animate-fadeIn">
                        <label className="text-xs font-semibold text-zinc-400 mb-1.5 pl-1">
                          Bloklanadigan soatlarni tanlang
                        </label>
                        <div className="grid grid-cols-4 gap-1.5 p-2 bg-zinc-900/50 rounded-xl border border-white/5 max-h-48 overflow-y-auto custom-scrollbar">
                          {[
                            "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
                            "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
                            "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
                            "18:00", "18:30"
                          ].map((time) => {
                            const isSelected = selectedBlockTimes.includes(time);
                            return (
                              <button
                                type="button"
                                key={time}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedBlockTimes(selectedBlockTimes.filter(t => t !== time));
                                  } else {
                                    setSelectedBlockTimes([...selectedBlockTimes, time]);
                                  }
                                }}
                                className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold border transition-all text-center cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-400 shadow-inner'
                                    : 'bg-zinc-800/40 border-white/5 text-zinc-400 hover:border-white/10 hover:text-white'
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Reason input */}
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-zinc-400 mb-1.5 pl-1">
                        Sababi (Ixtiyoriy)
                      </label>
                      <input
                        type="text"
                        placeholder="Masalan: Shaxsiy yumushlar, dam olish"
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 text-sm text-white"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSavingSchedule}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-zinc-950 font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                    >
                      {isSavingSchedule ? (
                        <>
                          <FaSpinner size={16} className="animate-spin" />
                          <span>Saqlanmoqda...</span>
                        </>
                      ) : (
                        <>
                          <FaSave size={16} />
                          <span>Bloklashni saqlash</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* 2. Blocked List Card */}
                <div className="lg:col-span-7 bg-zinc-950/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <FaHistory size={16} className="text-emerald-500" />
                      <span>Faol bloklangan kunlar va soatlar</span>
                    </h4>
                    <p className="text-xs text-zinc-450 mt-1 leading-normal">
                      Belgilangan kunlar va vaqtlar ro'yxati. Ularni o'chirish orqali yana mijozlar uchun ochiq qilishingiz mumkin.
                    </p>
                  </div>

                  {isSchedulesLoading ? (
                    <div className="space-y-3 py-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 w-full bg-zinc-900/30 border border-zinc-800/40 rounded-2xl animate-pulse"></div>
                      ))}
                    </div>
                  ) : blockedSchedules.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-zinc-900/10">
                      <FaCalendarAlt size={32} className="mx-auto text-zinc-600 mb-3 animate-bounce" />
                      <p className="text-sm font-semibold text-zinc-400">Hozirda band qilingan kunlar/soatlar mavjud emas</p>
                      <p className="text-xs text-zinc-500 mt-1">Bloklash uchun chap tomondagi formadan foydalaning</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                      {blockedSchedules
                        .sort((a, b) => {
                          const dateA = a.date.split('.').reverse().join('-');
                          const dateB = b.date.split('.').reverse().join('-');
                          return new Date(dateA) - new Date(dateB);
                        })
                        .map((schedule) => {
                          const isAllDay = schedule.blockedTimes.includes('ALL');
                          return (
                            <div
                              key={schedule._id || schedule.id}
                              className="group flex items-center justify-between p-4 bg-zinc-900/60 border border-white/5 rounded-2xl hover:border-emerald-500/30 hover:bg-zinc-900 transition-all duration-300"
                            >
                              <div className="space-y-2 flex-1 min-w-0 pr-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-bold text-white tracking-wide">
                                    {formatBookingDate(schedule.date)}
                                  </span>
                                  {isAllDay ? (
                                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wide">
                                      Butun kun
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wide">
                                      {schedule.blockedTimes.length} ta soat
                                    </span>
                                  )}
                                </div>

                                {/* List of specific blocked times */}
                                {!isAllDay && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {schedule.blockedTimes.map((t) => (
                                      <span key={t} className="px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[9px] font-mono border border-white/5">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Reason text if provided */}
                                {schedule.reason && (
                                  <p className="text-xs text-zinc-400 italic font-medium truncate mt-1">
                                    Sabab: <span className="text-zinc-300">{schedule.reason}</span>
                                  </p>
                                )}
                              </div>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  triggerConfirm({
                                    title: "Bloklashni o'chirish",
                                    message: `${schedule.date} kunidagi bloklashni o'chirmoqchimisiz? Ushbu vaqtlar mijozlar uchun yana bron qilishga ochiq bo'ladi.`,
                                    confirmText: "Ha, o'chirish",
                                    cancelText: "Yo'q, bekor qilish",
                                    type: "danger",
                                    onConfirm: () => handleDeleteBlockedSchedule(schedule.date)
                                  });
                                }}
                                className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shrink-0"
                                title="Blokdan chiqarish"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: TUTORIALS ================= */}
          {activeTab === 'tutorials' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
              {/* Back button */}
              <button
                onClick={() => {
                  setSearchParams({ tab: 'profile' });
                  setPlayingVideoId(null);
                  setIsVideoLoading(false);
                }}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-wider bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl active:scale-95 cursor-pointer hover:border-emerald-500/30 hover:text-emerald-400"
              >
                <FaArrowLeft size={10} />
                <span>Ortga qaytish</span>
              </button>

              {/* Title Header */}
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent uppercase tracking-wider">
                  Dasturdan foydalanish yo'riqnomalari
                </h3>
                <p className="text-zinc-400 text-xs">Tizim imkoniyatlaridan to'g'ri foydalanish bo'yicha video darsliklar</p>
              </div>

              {/* Summary / Text Guidance */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <FaBookOpen className="text-emerald-500" size={16} />
                  Boshqaruv Tizimi Bo'yicha Yo'riqnoma:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400 leading-relaxed">
                  <div className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl space-y-1">
                    <span className="font-bold text-zinc-200 block text-xs">1. Moliya & Statistika:</span>
                    <span>Kunlik, haftalik va oylik tushumlarni hamda ommabop xizmatlar taqsimotini nazorat qilish.</span>
                  </div>
                  <div className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl space-y-1">
                    <span className="font-bold text-zinc-200 block text-xs">2. Buyurtmalar:</span>
                    <span>Mijozlar tomonidan yuklangan to'lov cheklarini tekshirish, tasdiqlash yoki rad etish.</span>
                  </div>
                  <div className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl space-y-1">
                    <span className="font-bold text-zinc-200 block text-xs">3. Mijozlar:</span>
                    <span>Ro'yxatdan o'tgan mijozlarni qidirish, ma'lumotlarini tahrirlash, bloklash yoki o'chirish.</span>
                  </div>
                </div>
              </div>

              {/* Video Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorialsList.map((tutorial) => (
                  <div key={tutorial.id} className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-zinc-700 transition-all duration-300 group flex flex-col justify-between">
                    {/* Thumbnail container */}
                    <div className="relative aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden border-b border-zinc-850">
                      {playingVideoId === tutorial.id ? (
                        <>
                          <iframe
                            src={`https://www.youtube.com/embed/${tutorial.youtubeId}?autoplay=1&rel=0`}
                            title={tutorial.title}
                            className="w-full h-full border-0 absolute inset-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => setIsVideoLoading(false)}
                          ></iframe>
                          {isVideoLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm z-20 animate-fadeIn">
                              <div className="relative w-12 h-12 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500/10 border-t-emerald-500 animate-spin"></div>
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 animate-pulse"></div>
                              </div>
                              <span className="text-[10px] tracking-widest text-emerald-400 font-extrabold mt-3 animate-pulse uppercase">
                                Video yuklanmoqda...
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <img 
                            src={`https://img.youtube.com/vi/${tutorial.youtubeId}/hqdefault.jpg`} 
                            alt={tutorial.title}
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-40 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60"></div>
                          <button
                            onClick={() => {
                              setPlayingVideoId(tutorial.id);
                              setIsVideoLoading(true);
                            }}
                            className="absolute w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 scale-95 group-hover:scale-105 transition-all duration-300 cursor-pointer animate-pulse z-10"
                          >
                            <FaPlay className="ml-1 text-zinc-950" size={16} />
                          </button>
                          <span className="absolute bottom-3 right-3 bg-zinc-950/80 border border-white/10 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">
                            {tutorial.duration}
                          </span>
                        </>
                      )}
                    </div>
                    {/* Body */}
                    <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                          {tutorial.title}
                        </h4>
                        <p className="text-zinc-400 text-xs leading-normal">
                          {tutorial.description}
                        </p>
                      </div>
                      <a
                        href={`https://www.youtube.com/watch?v=${tutorial.youtubeId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full bg-zinc-800 hover:bg-zinc-750 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all active:scale-[0.98] border border-white/5 mt-4"
                      >
                        <FaYoutube className="text-red-500" size={14} />
                        <span>YouTubeda tomosha qilish</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB: NOTIFICATIONS ================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Back Button Header Card */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    to="/admin?tab=profile"
                    className="p-2.5 rounded-xl border border-white/10 bg-zinc-800/50 hover:bg-zinc-800 hover:border-emerald-500/30 text-emerald-400 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0 shadow-sm"
                    title="Profilga qaytish"
                  >
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold leading-tight">Bildirishnomalar Boshqaruvi</h3>
                    <p className="text-zinc-400 text-xs mt-0.5">Yangi xabar yuborish va tarixni kuzatish</p>
                  </div>
                </div>
              </div>

              {/* Form & Sent Notifications History */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                
                {/* 1. Dispatch Form */}
                <div className="relative xl:col-span-1 bg-zinc-950/70 border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-xl shadow-2xl overflow-hidden space-y-4 z-10">
                  {/* Ambient glow backgrounds */}
                  <div className="absolute top-0 -left-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
                  <div className="absolute bottom-0 -right-4 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -z-10"></div>

                  <div className="relative z-10" id="notification-form">
                    <h4 className="text-lg font-bold flex items-center gap-2">
                      {editingNotificationId ? (
                        <>
                          <FaEdit size={18} className="text-amber-500 animate-pulse" />
                          <span>Bildirishnomani tahrirlash</span>
                        </>
                      ) : (
                        <>
                          <FaBullhorn size={18} className="text-emerald-500 animate-pulse" />
                          <span>Yangi bildirishnoma yuborish</span>
                        </>
                      )}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-normal">
                      {editingNotificationId
                        ? "Tanlangan bildirishnomaning ma'lumotlarini o'zgartiring. O'zgarishlar barcha foydalanuvchilar uchun amal qiladi."
                        : "Barcha foydalanuvchilarning shaxsiy kabinetiga xabar yuborish. Qisqa va batafsil ma'lumotlar bilan boyiting."
                      }
                    </p>
                  </div>

                  <form onSubmit={handleCreateNotification} className="space-y-4 relative z-10">
                    {/* Title */}
                    <div className="group flex flex-col">
                      <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
                        Xabar sarlavhasi (Majburiy)
                      </label>
                      <input
                        type="text"
                        placeholder="Masalan: Yozgi yangi stillar qo'shildi! 💈"
                        value={newNotification.title}
                        onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 placeholder:text-white/20 text-sm hover:bg-white/10 text-white"
                        required
                      />
                    </div>

                    {/* Short Description */}
                    <div className="group flex flex-col">
                      <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
                        Qisqa ma'lumot (Listda ko'rinadi - Majburiy)
                      </label>
                      <textarea
                        placeholder="Masalan: Katalogimizga yangi zamonaviy soch stillari yuklandi..."
                        value={newNotification.description}
                        onChange={(e) => setNewNotification({ ...newNotification, description: e.target.value })}
                        rows="2"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 placeholder:text-white/20 text-sm hover:bg-white/10 text-white resize-none"
                        required
                      ></textarea>
                    </div>

                    {/* Detailed Content */}
                    <div className="group flex flex-col">
                      <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
                        Batafsil matn (Ichiga kirganda o'qiladi - Ixtiyoriy)
                      </label>
                      <textarea
                        placeholder="Masalan: Ushbu xabarning batafsil mazmuni, o'zgarishlar va shartlar bu yerda to'liq yoziladi..."
                        value={newNotification.content}
                        onChange={(e) => setNewNotification({ ...newNotification, content: e.target.value })}
                        rows="4"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 placeholder:text-white/20 text-sm hover:bg-white/10 text-white"
                      ></textarea>
                    </div>

                    {/* Category Type & Action Button */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Category Type */}
                      <div className="group flex flex-col relative" ref={typeDropdownRef}>
                        <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
                          Tur (Kategoriya)
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 text-sm hover:bg-white/10 text-white cursor-pointer flex items-center justify-between text-left"
                        >
                          <span>
                            {newNotification.type === 'system' && 'Tizim (Yangilik)'}
                            {newNotification.type === 'welcome' && 'Xush kelibsiz'}
                            {newNotification.type === 'loyalty' && 'Sadoqat dasturi'}
                            {newNotification.type === 'appointment' && 'Navbat / Tashrif'}
                          </span>
                          <svg
                            className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isTypeDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* Custom Options List */}
                        {isTypeDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-zinc-950/95 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fadeIn p-1 flex flex-col">
                            <button
                              type="button"
                              onClick={() => {
                                setNewNotification({ ...newNotification, type: 'system' });
                                setIsTypeDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-205 cursor-pointer border-none bg-transparent ${
                                newNotification.type === 'system'
                                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              Tizim (Yangilik)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewNotification({ ...newNotification, type: 'welcome' });
                                setIsTypeDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-205 cursor-pointer border-none bg-transparent ${
                                newNotification.type === 'welcome'
                                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              Xush kelibsiz
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewNotification({ ...newNotification, type: 'loyalty' });
                                setIsTypeDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-205 cursor-pointer border-none bg-transparent ${
                                newNotification.type === 'loyalty'
                                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              Sadoqat dasturi
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewNotification({ ...newNotification, type: 'appointment' });
                                setIsTypeDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-205 cursor-pointer border-none bg-transparent ${
                                newNotification.type === 'appointment'
                                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              Navbat / Tashrif
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Action Link Type */}
                      <div className="group flex flex-col relative" ref={linkTypeDropdownRef}>
                        <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
                          Harakat tugmasi
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsLinkTypeDropdownOpen(!isLinkTypeDropdownOpen)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 text-sm hover:bg-white/10 text-white cursor-pointer flex items-center justify-between text-left"
                        >
                          <span>
                            {newNotification.linkType === 'none' && 'Tugmasiz (Harakatsiz)'}
                            {newNotification.linkType === 'booking' && 'Navbat olish sahifasi'}
                            {newNotification.linkType === 'styles' && 'Stillar sahifasi'}
                            {newNotification.linkType === 'loyalty' && 'Loyallik kartasi'}
                            {newNotification.linkType === 'external' && 'Tashqi havola'}
                          </span>
                          <svg
                            className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isLinkTypeDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* Custom Options List */}
                        {isLinkTypeDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-zinc-950/95 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fadeIn p-1 flex flex-col">
                            <button
                              type="button"
                              onClick={() => {
                                setNewNotification({ ...newNotification, linkType: 'none' });
                                setIsLinkTypeDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-205 cursor-pointer border-none bg-transparent ${
                                newNotification.linkType === 'none'
                                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              Tugmasiz (Harakatsiz)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewNotification({ ...newNotification, linkType: 'booking' });
                                setIsLinkTypeDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-205 cursor-pointer border-none bg-transparent ${
                                newNotification.linkType === 'booking'
                                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              Navbat olish sahifasi
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewNotification({ ...newNotification, linkType: 'styles' });
                                setIsLinkTypeDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-205 cursor-pointer border-none bg-transparent ${
                                newNotification.linkType === 'styles'
                                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              Stillar sahifasi
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewNotification({ ...newNotification, linkType: 'loyalty' });
                                setIsLinkTypeDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-205 cursor-pointer border-none bg-transparent ${
                                newNotification.linkType === 'loyalty'
                                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              Loyallik kartasi
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewNotification({ ...newNotification, linkType: 'external' });
                                setIsLinkTypeDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-205 cursor-pointer border-none bg-transparent ${
                                newNotification.linkType === 'external'
                                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              Tashqi havola
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Conditional Link URL */}
                    {newNotification.linkType === 'external' && (
                      <div className="group flex flex-col">
                        <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
                          Tashqi havola manzili (URL)
                        </label>
                        <input
                          type="url"
                          placeholder="Masalan: https://t.me/barber_bot"
                          value={newNotification.linkUrl}
                          onChange={(e) => setNewNotification({ ...newNotification, linkUrl: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 placeholder:text-white/20 text-sm hover:bg-white/10 text-white"
                          required
                        />
                      </div>
                    )}

                    {/* Image URL (optional) */}
                    <div className="group flex flex-col">
                      <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
                        Rasm havolasi (Banner - Ixtiyoriy)
                      </label>
                      <input
                        type="url"
                        placeholder="Masalan: https://images.unsplash.com/... (yoki bo'sh qoldiring)"
                        value={newNotification.imageUrl}
                        onChange={(e) => setNewNotification({ ...newNotification, imageUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 placeholder:text-white/20 text-sm hover:bg-white/10 text-white"
                      />
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div className="space-y-2">
                      <button
                        type="submit"
                        disabled={notificationSubmitting}
                        className={`w-full mt-4 group relative overflow-hidden text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer disabled:bg-zinc-800 disabled:text-white/20 disabled:cursor-not-allowed flex items-center justify-center gap-2 border ${
                          editingNotificationId 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] border-amber-400/30' 
                            : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] border-emerald-400/30'
                        }`}
                      >
                        {/* Hover shine effect */}
                        <span className="absolute inset-0 -translate-x-full group-hover:animate-[button-shine_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"></span>

                        {notificationSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saqlanmoqda...</span>
                          </>
                        ) : (
                          <span className="flex items-center gap-2 tracking-wide uppercase text-sm">
                            {editingNotificationId ? (
                              <>
                                <span>O'zgarishlarni Saqlash</span>
                                <FaSave size={13} />
                              </>
                            ) : (
                              <>
                                <span>Bildirishnomani Yuborish</span>
                                <FaPaperPlane size={13} />
                              </>
                            )}
                          </span>
                        )}
                      </button>

                      {editingNotificationId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNotificationId(null);
                            setNewNotification({
                              title: '',
                              description: '',
                              content: '',
                              type: 'system',
                              linkType: 'none',
                              linkUrl: '',
                              imageUrl: ''
                            });
                          }}
                          className="w-full bg-zinc-800 hover:bg-zinc-750 border border-white/5 text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                        >
                          <FaTimes size={12} />
                          <span>Tahrirlashni bekor qilish</span>
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* 2. Sent Notifications History List */}
                <div className="xl:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm space-y-4 min-h-[400px]">
                  <div>
                    <h4 className="text-lg font-bold flex items-center gap-2">
                      <FaHistory size={16} className="text-emerald-500" />
                      Yuborilgan bildirishnomalar tarixi
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Tizimda yaratilgan va barcha foydalanuvchilarga jo'natilgan xabarlar ro'yxati.
                    </p>
                  </div>

                  {notificationsLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-emerald-500" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : notificationsList.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-950/20 border border-dashed border-zinc-850 rounded-xl">
                      <FaBell className="mx-auto text-4xl text-zinc-650 mb-3" />
                      <p className="text-zinc-550 text-sm">Hali hech qanday bildirishnomalar yuborilmagan.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 chat-scrollbar">
                      {notificationsList.map((notif) => {
                        const trimmedTitle = (notif.title || '').trim();
                        const trimmedDesc = (notif.description || '').trim();
                        const trimmedContent = (notif.content || '').trim();
                        const trimmedImgUrl = (notif.imageUrl || '').trim();

                        return (
                          <div
                            key={notif._id || notif.id}
                            className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 pr-12 backdrop-blur-sm relative overflow-hidden flex flex-col gap-2 hover:border-zinc-700/60 transition-all duration-300 animate-fadeIn"
                          >
                            {/* Glowing left accent border matching category */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                              notif.type === 'welcome'
                                ? 'bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                : notif.type === 'loyalty'
                                ? 'bg-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                : notif.type === 'appointment'
                                ? 'bg-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                                : 'bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                            }`}></div>

                            {/* Header row (Badges, Time) */}
                            <div className="flex items-start gap-2.5 select-none">
                              {/* Badges list */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                {/* Type Badge */}
                                <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg border ${
                                  notif.type === 'welcome'
                                    ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                                    : notif.type === 'loyalty'
                                    ? 'bg-amber-500/5 text-amber-400 border-amber-500/20'
                                    : notif.type === 'appointment'
                                    ? 'bg-teal-500/5 text-teal-400 border-teal-500/20'
                                    : 'text-blue-400 border-blue-500/20 bg-blue-500/5'
                                }`}>
                                  {notif.type === 'welcome' && 'Xush kelibsiz'}
                                  {notif.type === 'loyalty' && 'Sadoqat dasturi'}
                                  {notif.type === 'appointment' && 'Navbat / Tashrif'}
                                  {notif.type === 'system' && 'Tizim'}
                                </span>

                                {/* Link Action Badge */}
                                {notif.linkType !== 'none' && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-purple-500/5 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-lg">
                                    <FaLink size={8} className="shrink-0" />
                                    <span>Tugma: {
                                      notif.linkType === 'booking' ? 'Navbat Olish' :
                                      notif.linkType === 'styles' ? 'Stillar' :
                                      notif.linkType === 'loyalty' ? 'Karta' :
                                      notif.linkType === 'external' ? 'Havola' : notif.linkType
                                    }</span>
                                  </span>
                                )}

                                <span className="text-[10px] text-zinc-500 font-semibold">
                                  ⏱ {new Date(notif.createdAt || Date.now()).toLocaleString('uz-UZ')}
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-1.5 text-left pl-0.5 mt-0.5">
                              <h5 className="font-bold text-zinc-200 text-sm tracking-wide">{trimmedTitle}</h5>
                              <p className="text-xs text-zinc-400 leading-relaxed font-medium">{trimmedDesc}</p>

                              {trimmedContent && trimmedContent !== trimmedDesc && (
                                <div className="bg-zinc-950/40 px-3 py-2 rounded-xl border border-white/5 text-[11px] text-zinc-300/90 whitespace-pre-line mt-1.5 font-medium max-h-24 overflow-y-auto chat-scrollbar">
                                  <span className="text-zinc-500 font-bold block mb-0.5 text-[9px] uppercase tracking-wider">Batafsil matni:</span>
                                  {trimmedContent}
                                </div>
                              )}

                              {trimmedImgUrl && (
                                <div className="mt-2.5 max-w-[160px] aspect-video rounded-xl overflow-hidden border border-white/10 shadow-md">
                                  <img
                                    src={trimmedImgUrl}
                                    alt="Banner preview"
                                    className="w-full h-full object-cover select-none"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Absolute Positioned Action Buttons */}
                            <div className="absolute top-3.5 right-3.5 z-10 flex flex-col gap-1.5">
                              {/* Edit Button */}
                              <button
                                onClick={() => handleStartEditNotification(notif)}
                                className="w-7 h-7 rounded-lg bg-zinc-900/60 hover:bg-amber-500/10 border border-zinc-855 hover:border-amber-500/30 text-zinc-500 hover:text-amber-400 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                                title="Tahrirlash"
                              >
                                <FaEdit size={10} />
                              </button>

                              {/* Delete Button */}
                              <button
                                disabled={actionLoading === (notif._id || notif.id)}
                                onClick={() => handleDeleteNotification(notif._id || notif.id)}
                                className="w-7 h-7 rounded-lg bg-zinc-900/60 hover:bg-red-500/10 border border-zinc-855 hover:border-red-500/30 text-zinc-500 hover:text-red-400 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                                title="O'chirish"
                              >
                                <FaTrash size={10} />
                              </button>

                              {/* View Simulation Button */}
                              <button
                                onClick={() => setPreviewNotification(notif)}
                                className="w-7 h-7 rounded-lg bg-zinc-900/60 hover:bg-emerald-500/10 border border-zinc-855 hover:border-emerald-500/30 text-zinc-500 hover:text-emerald-400 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                                title="Foydalanuvchi ko'rinishida ko'rish"
                              >
                                <FaEye size={10} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadImage(zoomedReceipt)}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 bg-transparent border-none cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  title="Yuklab olish"
                >
                  <FaDownload size={16} />
                  <span className="hidden sm:inline">Yuklab olish</span>
                </button>
                <button
                  onClick={() => setZoomedReceipt(null)}
                  className="text-white hover:text-red-400 transition-colors p-1 bg-transparent border-none cursor-pointer"
                  title="Yopish"
                >
                  <FaTimesCircle size={20} />
                </button>
              </div>
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

      {/* Fullscreen Photo zoom overlay modal for Banners */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[150] p-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setZoomedImage(null)}></div>
          
          <div className="relative max-w-2xl w-full flex flex-col items-center z-10 animate-bounce-in">
            {/* Header info */}
            <div className="w-full flex justify-between items-center mb-3 bg-zinc-950/70 p-3 rounded-xl border border-white/5 backdrop-blur-md">
              <span className="text-sm font-semibold">{zoomedImage.title}</span>
              <button
                onClick={() => setZoomedImage(null)}
                className="text-white hover:text-emerald-400 transition-colors p-1 bg-transparent border-none cursor-pointer"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>
            {/* Large picture */}
            <img
              src={zoomedImage.url}
              alt="Zoomed"
              className="max-h-[75vh] object-contain rounded-2xl border border-emerald-500/30 shadow-2xl bg-zinc-900"
            />
            
            <p className="mt-4 text-xs text-zinc-400 text-center">Yopish uchun rasm atrofidagi joyga yoki yuqoridagi yopish tugmasiga bosing</p>
          </div>
        </div>
      )}

      {/* Fullscreen Customer Simulation View Modal */}
      {previewNotification && (() => {
        const isLinked = previewNotification.linkType && previewNotification.linkType !== 'none';
        
        const getActionButtonLabel = () => {
          switch (previewNotification.linkType) {
            case 'booking':
              return 'Hoziroq Navbat Olish 📅';
            case 'styles':
              return "Soch Stillarini Ko'rish 💈";
            case 'loyalty':
              return "Sadoqat Kartasiga O'tish 💳";
            case 'external':
            default:
              return 'Batafsil ma\'lumot 🔗';
          }
        };

        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[150] p-4">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setPreviewNotification(null)}></div>
            
            <div className="relative max-w-xl w-full bg-zinc-950/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 animate-bounce-in flex flex-col max-h-[90vh] text-white">
              {/* Close button at top right */}
              <button
                onClick={() => setPreviewNotification(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 p-2 rounded-full backdrop-blur-md z-30"
              >
                <FaTimes size={15} />
              </button>

              <div className="overflow-y-auto chat-scrollbar">
                {/* Banner Image */}
                {previewNotification.imageUrl ? (
                  <div className="w-full h-48 sm:h-64 relative">
                    <img
                      src={previewNotification.imageUrl}
                      alt={previewNotification.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent"></div>
                  </div>
                ) : (
                  <div className="w-full h-16 bg-gradient-to-r from-emerald-950/20 via-zinc-900/50 to-teal-950/20 border-b border-white/5"></div>
                )}

                {/* Detail Content Area */}
                <div className="p-5 sm:p-6 md:p-8 space-y-5 text-left">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        previewNotification.type === 'welcome'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                          : previewNotification.type === 'loyalty'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                          : previewNotification.type === 'appointment'
                          ? 'bg-teal-500/10 text-teal-400 border border-teal-500/25'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                      }`}>
                        {previewNotification.type === 'welcome' && 'Xush kelibsiz'}
                        {previewNotification.type === 'loyalty' && 'Sadoqat dasturi'}
                        {previewNotification.type === 'appointment' && 'Navbat / Tashrif'}
                        {previewNotification.type === 'system' && 'Tizim'}
                      </span>
                      
                      <span className="text-xs text-zinc-550 font-semibold">
                        ⏱ {new Date(previewNotification.createdAt || Date.now()).toLocaleString('uz-UZ', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                      {previewNotification.title}
                    </h1>
                  </div>

                  <div className="border-b border-white/5"></div>

                  <div className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                    {previewNotification.content || previewNotification.description}
                  </div>

                  {isLinked && (
                    <div className="pt-4 border-t border-white/5">
                      <button
                        type="button"
                        className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all duration-300 shadow-lg shadow-emerald-500/20 border-none select-none cursor-pointer flex items-center justify-center gap-2"
                      >
                        {getActionButtonLabel()}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <EditUserModal
        isOpen={isEditUserModalOpen}
        userToEdit={userToEdit}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={handleEditUserSave}
      />

      {/* Kassa Modal */}
      {isKassaModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[150] p-0 sm:p-4 animate-fadeIn">
          {/* Animated blur overlay */}
          <div
            className="absolute inset-0 cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            onClick={() => { setIsKassaModalOpen(false); setIsKassaCalendarOpen(false); }}
          />

          {/* Ambient glow orbs behind modal */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div style={{
              position: 'absolute', width: '360px', height: '360px',
              background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
              bottom: '5%', left: '50%', transform: 'translateX(-50%)',
              filter: 'blur(40px)', animation: 'pulse 4s ease-in-out infinite'
            }} />
            <div style={{
              position: 'absolute', width: '220px', height: '220px',
              background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)',
              top: '15%', left: '20%',
              filter: 'blur(50px)', animation: 'pulse 5s ease-in-out infinite 1s'
            }} />
          </div>

          {/* Modal card */}
          <div
            className="relative w-full sm:max-w-md min-h-screen sm:min-h-0 sm:h-auto z-10 flex flex-col text-white sm:rounded-3xl rounded-none overflow-y-auto sm:overflow-visible"
            style={{
              background: 'linear-gradient(145deg, rgba(24,26,32,0.95) 0%, rgba(15,17,22,0.98) 100%)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 -8px 80px rgba(16,185,129,0.22), 0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
            }}
          >
            {/* Gradient top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.7), transparent)',
              borderRadius: '999px'
            }} />

            {/* Inner content */}
            <div className="p-6 sm:p-7 space-y-5">
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Glowing icon */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(52,211,153,0.12) 100%)',
                    border: '1px solid rgba(52,211,153,0.3)',
                    boxShadow: '0 0 20px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FaWallet size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-white tracking-tight leading-tight">Kunlik Kassa Kiritish</h4>
                    <p className="text-[11px] text-emerald-400/70 font-medium mt-0.5">Offline naqd pul kirimi</p>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => { setIsKassaModalOpen(false); setIsKassaCalendarOpen(false); }}
                  className="shrink-0 cursor-pointer transition-all duration-300 active:scale-90"
                  style={{
                    width: '34px', height: '34px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  <FaTimes size={13} />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 leading-relaxed"
                style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                Saytdan tashqari (offline) sartaroshxonada yig'ilgan kunlik naqd pul tushumini bu yerga kiritib borishingiz mumkin.
              </p>

              <form onSubmit={handleSaveOfflineIncome} className="space-y-4">
                {/* Date field */}
                <div className="relative" ref={kassaCalendarRef}>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2"
                    style={{ color: 'rgba(52,211,153,0.7)', letterSpacing: '0.12em' }}>Sana</label>
                  <button
                    type="button"
                    onClick={() => setIsKassaCalendarOpen(!isKassaCalendarOpen)}
                    className="w-full flex items-center justify-between cursor-pointer transition-all duration-300"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '14px',
                      background: isKassaCalendarOpen
                        ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(52,211,153,0.06))'
                        : 'rgba(255,255,255,0.05)',
                      border: isKassaCalendarOpen
                        ? '1px solid rgba(52,211,153,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: isKassaCalendarOpen ? '0 0 20px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
                      outline: 'none',
                    }}
                  >
                    <span className="font-semibold text-white text-sm">{formatSelectedKassaDateUz()}</span>
                    <svg
                      className={`w-4 h-4 text-emerald-400 transition-transform duration-300 ${isKassaCalendarOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Calendar Popover */}
                  {isKassaCalendarOpen && (
                    <div
                      className="absolute top-full left-0 right-0 mt-2 z-[160] animate-fadeIn"
                      style={{
                        background: 'linear-gradient(145deg, rgba(18,20,26,0.98), rgba(12,14,19,0.99))',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: '18px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(16,185,129,0.1)',
                        backdropFilter: 'blur(30px)',
                        padding: '16px',
                      }}
                    >
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-3">
                        <button type="button" onClick={handleKassaPrevMonth}
                          className="cursor-pointer transition-all duration-200 active:scale-90"
                          style={{ padding: '6px', borderRadius: '9px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest">
                          {kassaMonths[kassaViewDate.getMonth()]} {kassaViewDate.getFullYear()}
                        </h4>
                        <button type="button" onClick={handleKassaNextMonth}
                          className="cursor-pointer transition-all duration-200 active:scale-90"
                          style={{ padding: '6px', borderRadius: '9px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Weekdays */}
                      <div className="grid grid-cols-7 gap-1 mb-2 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {kassaDaysOfWeek.map(day => (
                          <div key={day} className="text-center text-[10px] font-bold py-0.5 select-none" style={{ color: 'rgba(52,211,153,0.8)' }}>
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {getKassaCalendarDays().map((date, index) => {
                          if (!date) return <div key={`empty-${index}`} className="h-8" />;
                          const isSelected = kassaDate && date.toDateString() === parseToDate(kassaDate).toDateString();
                          const isToday = date.toDateString() === new Date().toDateString();
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleKassaDateSelect(date)}
                              className="h-8 w-full flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer"
                              style={{
                                background: isSelected
                                  ? 'linear-gradient(135deg, #10b981, #059669)'
                                  : isToday ? 'rgba(16,185,129,0.12)' : 'transparent',
                                border: isSelected
                                  ? '1px solid rgba(52,211,153,0.5)'
                                  : isToday ? '1px solid rgba(52,211,153,0.4)' : '1px solid transparent',
                                color: isSelected ? 'white' : isToday ? '#34d399' : 'rgba(255,255,255,0.65)',
                                boxShadow: isSelected ? '0 4px 15px rgba(16,185,129,0.35)' : 'none',
                              }}
                            >
                              {date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Amount field */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2"
                    style={{ color: 'rgba(52,211,153,0.7)', letterSpacing: '0.12em' }}>Kassa Pul Miqdori (so'm)</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Masalan: 150000"
                      value={kassaAmount}
                      onChange={(e) => setKassaAmount(e.target.value)}
                      min="0"
                      required
                      style={{
                        width: '100%', paddingLeft: '16px', paddingRight: '52px', paddingTop: '13px', paddingBottom: '13px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: '14px',
                        outline: 'none',
                        color: 'white',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        transition: 'all 0.3s',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'rgba(52,211,153,0.5)';
                        e.target.style.background = 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.04))';
                        e.target.style.boxShadow = '0 0 20px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.05)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.09)';
                        e.target.style.background = 'rgba(255,255,255,0.05)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <span className="absolute right-4 inset-y-0 flex items-center text-xs font-bold pointer-events-none"
                      style={{ color: 'rgba(52,211,153,0.6)' }}>so'm</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={kassaSaving}
                  className="w-full font-bold text-sm cursor-pointer transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    padding: '14px 24px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%)',
                    boxShadow: '0 8px 30px rgba(16,185,129,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                    color: 'white',
                    letterSpacing: '0.02em',
                  }}
                  onMouseEnter={e => { if (!kassaSaving) e.currentTarget.style.boxShadow = '0 12px 40px rgba(16,185,129,0.55), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(16,185,129,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'; }}
                >
                  {kassaSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <FaWallet size={14} />
                      <span>Kassani Saqlash</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom gradient line */}
            <div style={{
              position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)',
              borderRadius: '999px'
            }} />
          </div>
        </div>
      )}

      {/* ================= SERVICE ADD/EDIT MODAL ================= */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full sm:max-w-lg min-h-screen sm:min-h-0 sm:h-auto bg-zinc-900/90 sm:border border-white/10 sm:rounded-3xl rounded-none p-5 sm:p-6 shadow-2xl flex flex-col max-h-screen sm:max-h-[90vh] overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 shrink-0">
              <h3 className="text-lg font-extrabold text-white">
                {editingService ? "Xizmatni tahrirlash" : "Yangi xizmat qo'shish"}
              </h3>
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer hover:border-zinc-700 transition-all"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Error message */}
            {serviceError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl mb-4 shrink-0 animate-fadeIn">
                {serviceError}
              </div>
            )}

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto pr-1 space-y-4 pb-4">
              {/* Service Name */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Xizmat Nomi (Uzbek)</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="Masalan: Soch kesish"
                  className="w-full bg-zinc-850/80 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Service English Name */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Inglizcha Nomi</label>
                <input
                  type="text"
                  value={serviceForm.name_en}
                  onChange={(e) => setServiceForm({ ...serviceForm, name_en: e.target.value })}
                  placeholder="Masalan: Haircut"
                  className="w-full bg-zinc-850/80 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Narxi (so'm)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="50000"
                    className="w-full bg-zinc-850/80 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Davomiyligi (daqiqa)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    placeholder="30"
                    className="w-full bg-zinc-850/80 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Preset Image Selection */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-2">Preset Rasm Tanlash</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => {
                    const presetPath = `/styles/${i}.png`;
                    const isSelected = serviceForm.image_url === presetPath && !serviceImageFile;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setServiceForm({ ...serviceForm, image_url: presetPath });
                          setServiceImageFile(null);
                        }}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 scale-95 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            : 'border-white/5 opacity-55 hover:opacity-100 hover:border-white/20'
                        }`}
                      >
                        <img src={presetPath} alt={`Style ${i}`} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                            <span className="bg-emerald-500 text-zinc-950 rounded-full p-0.5 text-[9px] font-extrabold">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Image Upload */}
              <div className="pt-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5">Sartaroshlik rasmini yuklash (ixtiyoriy)</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      id="service-image-upload"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setServiceImageFile(e.target.files[0]);
                          setServiceForm({ ...serviceForm, image_url: e.target.files[0].name });
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="service-image-upload"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-750 border border-white/5 hover:border-white/10 text-zinc-300 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-[0.98] select-none text-center"
                    >
                      <FaImage size={13} className="text-emerald-400" />
                      <span>{serviceImageFile ? serviceImageFile.name : "Rasm faylini tanlash"}</span>
                    </label>
                  </div>
                  {serviceImageFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setServiceImageFile(null);
                        setServiceForm({ ...serviceForm, image_url: '/styles/1.png' });
                      }}
                      className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center cursor-pointer hover:bg-red-500/20 transition-all shrink-0"
                      title="O'chirish"
                    >
                      <FaTimes size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Image URL (Alternative) */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Yoki Rasm URL manzili</label>
                <input
                  type="text"
                  value={serviceForm.image_url}
                  onChange={(e) => {
                    setServiceForm({ ...serviceForm, image_url: e.target.value });
                    setServiceImageFile(null);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-zinc-850/80 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 pt-2 shrink-0 border-t border-white/5 mt-4">
                <button
                  type="submit"
                  disabled={serviceSaving}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-zinc-950 font-extrabold py-3 px-4 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-60"
                >
                  {serviceSaving ? (
                    <FaSpinner size={12} className="animate-spin text-zinc-950" />
                  ) : (
                    <FaSave size={12} className="text-zinc-950" />
                  )}
                  <span>Saqlash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  disabled={serviceSaving}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-750 text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50 border border-white/5"
                >
                  <FaTimes size={12} />
                  <span>Bekor qilish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
