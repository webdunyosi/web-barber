import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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
  FaImage,
  FaComment,
  FaClock,
  FaMoneyBillWave,
  FaCreditCard,
  FaPaperclip,
  FaLink
} from 'react-icons/fa';
import { formatPrice } from '../utils/format';
import { getNotificationsApi, createNotificationApi, deleteNotificationApi } from '../utils/api';
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
    youtubeId: 'dQw4w9WgXcQ',
    title: "1-Dars: Statistika va Moliyaviy Tushumlar",
    description: "Ushbu darsda kunlik/haftalik daromadlarni hisoblash, ommabop xizmatlar tahlilini ko'rish va kassa (offline) daromadlarini kiritishni o'rganasiz.",
    duration: "02:45"
  },
  {
    id: 'tut2',
    youtubeId: 'dQw4w9WgXcQ',
    title: "2-Dars: Buyurtmalar va To'lovlar Nazorati",
    description: "Mijozlar tomonidan band qilingan vaqtlar va yuborilgan to'lov cheklarini tasdiqlash yoki rad etish, shuningdek buyurtmalarni o'chirish logikasini o'rganish.",
    duration: "03:15"
  },
  {
    id: 'tut3',
    youtubeId: 'dQw4w9WgXcQ',
    title: "3-Dars: Mijozlarni Bloklash va Tahrirlash",
    description: "Foydalanuvchilarning shaxsiy ma'lumotlarini tahrirlash, ularning sodiqlik cashback ballarini ko'tarish/tushirish va nofaol mijozlarni bloklash jarayonlari.",
    duration: "01:50"
  }
];

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
    token
  } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const [usersList, setUsersList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [stats, setStats] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // Filters & UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all'); // 'all' | 'active' | 'blocked'
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all'); // 'all' | 'pending' | 'confirmed' | 'rejected'
  const [zoomedReceipt, setZoomedReceipt] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
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
  const [editedTelegram, setEditedTelegram] = useState('');
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // User Editing modal states
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const handleEditUserSave = async (userId, updatedUserData) => {
    try {
      await editUser(userId, updatedUserData);
      await loadData();
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
      setEditedTelegram(user.telegram || '');
    }
  }, [user, isEditingProfile]);

  const handleSaveAdminProfile = async (e) => {
    e.preventDefault();
    if (!editedName.trim()) {
      setProfileError('Ism kiritilishi majburiy!');
      return;
    }
    
    setIsProfileUpdating(true);
    setProfileError('');
    setProfileSuccess('');
    
    try {
      await updateProfile({
        name: editedName,
        telegram: editedTelegram
      });
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    if (!newNotification.title || !newNotification.description) {
      toast.error("Sarlavha va Qisqa matn kiritilishi majburiy!");
      return;
    }
    setNotificationSubmitting(true);
    try {
      await createNotificationApi(token, newNotification);
      toast.success("Bildirishnoma muvaffaqiyatli yuborildi! 📢");
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
      await loadNotifications();
    } catch (error) {
      console.error('Admin data loading error:', error);
    } finally {
      if (showSkeleton) setIsDataLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSearchTerm('');
    if (activeTab === 'notifications') {
      loadNotifications();
    }
  }, [activeTab]);

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
              <div className="flex flex-col sm:flex-row gap-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-3 backdrop-blur-sm relative z-30">
                {/* Search */}
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <FaSearch size={12} />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Mijoz ismi, telefon raqami yoki xizmat..."
                    className="w-full pl-8 pr-4 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent text-xs text-white placeholder-zinc-500 transition-all duration-300"
                  />
                </div>
                {/* Status custom select */}
                <div className="w-full sm:w-48 relative" ref={bookingStatusDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsBookingStatusDropdownOpen(!isBookingStatusDropdownOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2 bg-zinc-800/60 border rounded-xl outline-none text-xs text-white cursor-pointer transition-all duration-300 ${
                      isBookingStatusDropdownOpen
                        ? 'border-emerald-500 ring-1 ring-emerald-500'
                        : 'border-zinc-700/50 hover:border-emerald-500/50 hover:bg-zinc-800/80'
                    }`}
                  >
                    <span>
                      {bookingStatusFilter === 'all' && 'Barcha holatlar'}
                      {bookingStatusFilter === 'pending' && 'Kutilmoqda'}
                      {bookingStatusFilter === 'confirmed' && 'Tasdiqlangan'}
                      {bookingStatusFilter === 'rejected' && 'Rad etilgan'}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-300 ${isBookingStatusDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`}
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
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            bookingStatusFilter === 'all'
                              ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          Barcha holatlar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBookingStatusFilter('pending');
                            setIsBookingStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
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
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
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
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
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

          {/* ================= TAB: USERS ================= */}
          {activeTab === 'users' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Filters Panel */}
              <div className="flex flex-col sm:flex-row gap-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-3 backdrop-blur-sm relative z-30">
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <FaSearch size={12} />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Mijoz ismi yoki telefon raqami..."
                    className="w-full pl-8 pr-4 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent text-xs text-white placeholder-zinc-500 transition-all duration-300"
                  />
                </div>
                <div className="w-full sm:w-48 relative" ref={statusDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2 bg-zinc-800/60 border rounded-xl outline-none text-xs text-white cursor-pointer transition-all duration-300 ${
                      isStatusDropdownOpen
                        ? 'border-emerald-500 ring-1 ring-emerald-500'
                        : 'border-zinc-700/50 hover:border-emerald-500/50 hover:bg-zinc-800/80'
                    }`}
                  >
                    <span>
                      {userStatusFilter === 'all' && 'Barcha foydalanuvchilar'}
                      {userStatusFilter === 'active' && 'Faollar'}
                      {userStatusFilter === 'blocked' && 'Bloklanganlar'}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-300 ${isStatusDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`}
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
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            userStatusFilter === 'all'
                              ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          Barcha foydalanuvchilar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUserStatusFilter('active');
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
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
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
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
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 ml-2">
                    <FaDollarSign size={20} />
                  </div>
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
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                    <FaUserPlus size={20} />
                  </div>
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
                        <div key={booking.id || booking._id} className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-white">{booking.name}</span>
                              <span className="text-xs text-zinc-550 font-mono">{booking.phone}</span>
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
                            <div className="text-xs text-zinc-400 mt-1">
                              <span>{booking.serviceName}</span> • <span className="text-emerald-400 font-bold">{formatPrice(booking.servicePrice)} so'm</span>
                            </div>
                            <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                              <FaClock size={10} />
                              <span>{booking.date} soat {booking.time}</span>
                            </div>
                          </div>
                          
                          <div className={`grid gap-2 shrink-0 ${booking.userId ? 'grid-cols-3 w-full sm:w-auto' : 'grid-cols-2 w-full sm:w-auto'}`}>
                            {/* Tasdiqlash Button */}
                            <button
                              disabled={actionLoading === (booking.id || booking._id) || successActions[booking.id || booking._id]}
                              onClick={() => handleUpdateBookingStatus(booking.id || booking._id, 'confirmed')}
                              className={`flex flex-col items-center justify-center gap-1 font-bold py-2 px-2.5 rounded-xl text-center transition-all active:scale-[0.97] border cursor-pointer ${
                                booking.status === 'confirmed' || successActions[booking.id || booking._id] === 'confirmed'
                                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                                  : 'bg-transparent border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                              }`}
                            >
                              {actionLoading === (booking.id || booking._id) && successActions[booking.id || booking._id] !== 'confirmed' ? (
                                <>
                                  <svg className="animate-spin h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span className="text-[10px] leading-tight">Kutilmoqda</span>
                                </>
                              ) : (
                                <>
                                  <FaCheck size={11} className="shrink-0" />
                                  <span className="text-[10px] leading-tight">{booking.status === 'confirmed' || successActions[booking.id || booking._id] === 'confirmed' ? 'Tasdiqlandi' : 'Tasdiqlash'}</span>
                                </>
                              )}
                            </button>

                            {/* Rad etish Button */}
                            <button
                              disabled={actionLoading === (booking.id || booking._id) || successActions[booking.id || booking._id]}
                              onClick={() => handleUpdateBookingStatus(booking.id || booking._id, 'rejected')}
                              className={`flex flex-col items-center justify-center gap-1 font-bold py-2 px-2.5 rounded-xl text-center transition-all active:scale-[0.97] border cursor-pointer ${
                                booking.status === 'rejected' || successActions[booking.id || booking._id] === 'rejected'
                                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20'
                                  : 'bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10'
                              }`}
                            >
                              {actionLoading === (booking.id || booking._id) && successActions[booking.id || booking._id] !== 'rejected' ? (
                                <>
                                  <svg className="animate-spin h-3.5 w-3.5 text-red-400" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span className="text-[10px] leading-tight">Kutilmoqda</span>
                                </>
                              ) : (
                                <>
                                  <FaTimes size={11} className="shrink-0" />
                                  <span className="text-[10px] leading-tight">{booking.status === 'rejected' || successActions[booking.id || booking._id] === 'rejected' ? 'Rad etildi' : 'Rad etish'}</span>
                                </>
                              )}
                            </button>

                            {/* Bloklash Button */}
                            {booking.userId && (
                              <button
                                disabled={actionLoading === (booking.userId._id || booking.userId.id)}
                                onClick={() => handleBlockUser(booking.userId._id || booking.userId.id, booking.userId.status)}
                                className={`flex flex-col items-center justify-center gap-1 font-bold py-2 px-2.5 rounded-xl text-center transition-all active:scale-[0.97] border cursor-pointer ${
                                  booking.userId.status === 'blocked'
                                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/20'
                                    : 'bg-transparent border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                                }`}
                              >
                                {actionLoading === (booking.userId._id || booking.userId.id) ? (
                                  <>
                                    <svg className="animate-spin h-3.5 w-3.5 text-amber-400" viewBox="0 0 24 24" fill="none">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-[10px] leading-tight">Kutilmoqda</span>
                                  </>
                                ) : booking.userId.status === 'blocked' ? (
                                  <>
                                    <FaBan size={11} className="shrink-0" />
                                    <span className="text-[10px] leading-tight">Bloklangan</span>
                                  </>
                                ) : (
                                  <>
                                    <FaBan size={11} className="shrink-0" />
                                    <span className="text-[10px] leading-tight">Bloklash</span>
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
                  {/* Kassa (Offline Daromad) Kiritish Form */}
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                    <h4 className="text-lg font-bold flex items-center gap-2">
                      <FaWallet size={16} className="text-emerald-500" />
                      Kunlik Kassa Kiritish
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Saytdan tashqari (offline) sartaroshxonada yig'ilgan kunlik naqd pul tushumini bu yerga kiritib borishingiz mumkin.
                    </p>
                    
                    <form onSubmit={handleSaveOfflineIncome} className="space-y-3">
                      <div className="relative" ref={kassaCalendarRef}>
                        <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Sana</label>
                        <button
                          type="button"
                          onClick={() => setIsKassaCalendarOpen(!isKassaCalendarOpen)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 outline-none text-left cursor-pointer ${
                            isKassaCalendarOpen
                              ? 'bg-zinc-800/90 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                              : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:border-emerald-500/50'
                          }`}
                        >
                          <span className="font-semibold text-white text-sm">
                            {formatSelectedKassaDateUz()}
                          </span>
                          <svg 
                            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isKassaCalendarOpen ? 'rotate-180' : ''}`} 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* Calendar Popover */}
                        {isKassaCalendarOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 z-[60] bg-zinc-950 border border-zinc-850 rounded-2xl shadow-2xl p-4 animate-fadeIn">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-3">
                              <button
                                type="button"
                                onClick={handleKassaPrevMonth}
                                className="p-1 hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                              </button>
                              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                                {kassaMonths[kassaViewDate.getMonth()]} {kassaViewDate.getFullYear()}
                              </h4>
                              <button
                                type="button"
                                onClick={handleKassaNextMonth}
                                className="p-1 hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                              </button>
                            </div>

                            {/* Weekdays */}
                            <div className="grid grid-cols-7 gap-1 mb-1.5 border-b border-white/5 pb-1">
                              {kassaDaysOfWeek.map(day => (
                                <div key={day} className="text-center text-[10px] font-bold text-emerald-500 py-0.5 select-none">
                                  {day}
                                </div>
                              ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-1">
                              {getKassaCalendarDays().map((date, index) => {
                                if (!date) return <div key={`empty-${index}`} className="h-8"></div>;

                                const isSelected = kassaDate && date.toDateString() === parseToDate(kassaDate).toDateString();
                                const isToday = date.toDateString() === new Date().toDateString();

                                return (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleKassaDateSelect(date)}
                                    className={`
                                      h-8 w-full flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 border-none cursor-pointer
                                      ${isSelected ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-400' : 'bg-transparent text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400'}
                                      ${isToday && !isSelected ? 'border border-emerald-500/50 text-emerald-400 font-bold' : ''}
                                    `}
                                  >
                                    {date.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Kassa Pul Miqdori (so'm)</label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Masalan: 150000"
                            value={kassaAmount}
                            onChange={(e) => setKassaAmount(e.target.value)}
                            className="w-full pl-3 pr-12 py-2 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-white"
                            min="0"
                            required
                          />
                          <span className="absolute right-3 inset-y-0 flex items-center text-xs text-zinc-500 font-bold">so'm</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={kassaSaving}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 border-none"
                      >
                        {kassaSaving ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saqlanmoqda...</span>
                          </>
                        ) : (
                          <span>Kassani Saqlash</span>
                        )}
                      </button>
                    </form>
                  </div>

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

                  {/* Quick Actions (Tezkor Amallar) */}
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                    <h4 className="text-lg font-bold flex items-center gap-2">
                      <FaBolt size={16} className="text-emerald-500" />
                      Tezkor Amallar
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Tizim bo'yicha tezkor boshqaruv amallari va yangiliklar yuborish.
                    </p>
                    <Link
                      to="/admin?tab=notifications"
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all text-center border-none cursor-pointer"
                    >
                      <FaBell size={13} />
                      <span>Yangilik / Bildirishnoma Yuborish</span>
                    </Link>
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
                  <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <FaChartLine size={18} className="text-emerald-500" />
                    Kunlik daromad grafigi (Oxirgi 7 kun)
                  </h4>
                  
                  {/* SVG Chart */}
                  <div className="relative h-64 w-full pl-5 flex select-none">
                    {/* Y-axis Labels on Left */}
                    {stats.chartData && stats.chartData.length > 0 && (() => {
                      const maxVal = Math.max(...stats.chartData.map(c => c.value)) || 100000;
                      return (
                        <div className="absolute inset-y-0 w-8 text-[9px] text-zinc-500 font-mono font-bold select-none pt-4 pb-8 text-right pr-1" style={{ left: '-16px' }}>
                          <div style={{ position: 'absolute', top: '20%', right: '4px', transform: 'translateY(-50%)' }}>
                            {maxVal >= 1000 ? `${(maxVal / 1000).toLocaleString()}k` : maxVal}
                          </div>
                          <div style={{ position: 'absolute', top: '40%', right: '4px', transform: 'translateY(-50%)' }}>
                            {maxVal >= 1000 ? `${((maxVal * 0.75) / 1000).toLocaleString()}k` : Math.round(maxVal * 0.75)}
                          </div>
                          <div style={{ position: 'absolute', top: '60%', right: '4px', transform: 'translateY(-50%)' }}>
                            {maxVal >= 1000 ? `${((maxVal * 0.5) / 1000).toLocaleString()}k` : Math.round(maxVal * 0.5)}
                          </div>
                          <div style={{ position: 'absolute', top: '80%', right: '4px', transform: 'translateY(-50%)' }}>
                            {maxVal >= 1000 ? `${((maxVal * 0.25) / 1000).toLocaleString()}k` : Math.round(maxVal * 0.25)}
                          </div>
                          <div style={{ position: 'absolute', top: '100%', right: '4px', transform: 'translateY(-50%)' }}>0</div>
                        </div>
                      );
                    })()}

                    {/* Chart Canvas Area */}
                    <div className="relative flex-1 h-full">
                      {/* SVG canvas */}
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid Lines inside SVG */}
                        <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                        <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                        <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                        <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                        <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

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

                      {/* Chart Labels under X axis */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-zinc-500 font-bold text-xxs mt-2 pointer-events-none">
                        {stats.chartData && stats.chartData.map((d, index) => (
                          <div key={index} className="text-center w-12 truncate">
                            {d.label.split(' ')[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sparkline analytics information */}
                  <div className="mt-4 border-t border-white/5 pt-4 flex justify-between items-center text-xs text-zinc-400">
                    <span>Maksimal kunlik: <strong className="text-white">{(stats.chartData && stats.chartData.length > 0 ? Math.max(...stats.chartData.map(c => c.value)) : 0).toLocaleString()} so'm</strong></span>
                    <span>Tasdiqlangan online buyurtmalar va kassa (offline) tushumi ko'rsatiladi</span>
                  </div>
                </div>

                {/* 2. Popular Services (1/3 width) */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center gap-2 mb-6">
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        <FaCut size={18} className="text-emerald-500" />
                        Xizmatlar ko'rsatkichlari
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
                              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden border border-white/5">
                                <div
                                  style={{ width: `${pct}%` }}
                                  className="bg-linear-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-1000"
                                ></div>
                              </div>
                              
                              <div className="flex justify-between text-xxs text-zinc-500">
                                <span>Tegishli ulush: {pct}%</span>
                                <span className="text-emerald-400/80 font-bold">Jami tushum: {(service.revenue || 0).toLocaleString()} so'm</span>
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

          {/* ================= TAB: PROFILE ================= */}
          {activeTab === 'profile' && (
            <div className="w-full text-white px-0 sm:px-4 py-2 pb-4 animate-fadeIn">
              <div className="max-w-md mx-auto space-y-5">
                
                {/* Page Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-center bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Shaxsiy Kabinet
                </h2>

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
                    <form onSubmit={handleSaveAdminProfile} className="space-y-4">
                      {/* Name Input */}
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Ism</label>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          disabled={isProfileUpdating}
                          className="w-full bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                          placeholder="Ismingizni kiriting"
                          required
                        />
                      </div>

                      {/* Phone Input (Readonly) */}
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Telefon raqam</label>
                        <div className="flex items-center gap-2 bg-zinc-850/50 border border-white/5 rounded-xl px-3 py-2.5 text-zinc-500 text-sm">
                          <FaPhone size={12} className="text-zinc-650" />
                          <span>{user?.phone}</span>
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
                            placeholder="username"
                          />
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
                              Sartarosh Admin
                            </span>
                            <span className="inline-block px-2.5 py-0.5 text-[9px] font-extrabold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                              Holati: Faol
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
                        {/* Item 1: Buyurtmalar Boshqaruvi */}
                        <button
                          onClick={() => setSearchParams({ tab: 'bookings' })}
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-white/5 text-left font-sans"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <FaCalendarCheck size={16} />
                          </div>
                          <span className="flex-1 text-sm font-semibold text-zinc-200">Buyurtmalar boshqaruvi</span>
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
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer text-left font-sans"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <FaBookOpen size={16} />
                          </div>
                          <span className="flex-1 text-sm font-semibold text-zinc-200">Boshqaruv tizimi darsliklari</span>
                          <FaChevronRight size={12} className="text-zinc-500" />
                        </button>
                      </div>
                    </div>

                    {/* Group 2: Settings and Info */}
                    <div className="bg-zinc-900/70 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
                      <div className="p-1">
                        {/* Item 1: Telegram Username */}
                        <div className="w-full flex items-center gap-3 px-4 py-3 border-b border-white/5 text-left">
                          <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-white/5 flex items-center justify-center text-gray-400">
                            <FaPaperPlane size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-[10px] text-gray-400 uppercase tracking-wider">Telegram username</span>
                            <span className="text-sm font-semibold text-zinc-200 truncate block">
                              {user?.telegram ? `@${user.telegram}` : 'Kiritilmagan'}
                            </span>
                          </div>
                        </div>

                        {/* Item 2: Profil Sozlamalari (Tahrirlash) */}
                        <button
                          onClick={() => {
                            setIsEditingProfile(true);
                            setProfileError('');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer text-left font-sans"
                        >
                          <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-white/5 flex items-center justify-center text-gray-400">
                            <FaEdit size={14} />
                          </div>
                          <span className="flex-1 text-sm font-semibold text-zinc-200">Profil ma'lumotlarini tahrirlash</span>
                          <FaChevronRight size={12} className="text-zinc-500" />
                        </button>
                      </div>
                    </div>

                    {/* Group 3: Transition to Client Homepage */}
                    <div className="bg-zinc-900/70 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
                      <div className="p-1">
                        <Link
                          to="/"
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer text-left font-sans"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <FaUserShield size={16} />
                          </div>
                          <span className="flex-1 text-sm font-bold text-emerald-400">Mijozlar sahifasiga o'tish</span>
                          <FaChevronRight size={12} className="text-emerald-400" />
                        </Link>
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
                    <p className="text-center text-[10px] text-zinc-650 font-medium tracking-wide pt-2">
                      Ilova versiyasi 1.10.42 (Build 349)
                    </p>
                  </>
                )}
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
                        <iframe
                          src={`https://www.youtube.com/embed/${tutorial.youtubeId}?autoplay=1&rel=0`}
                          title={tutorial.title}
                          className="w-full h-full border-0 absolute inset-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <>
                          <img 
                            src={`https://img.youtube.com/vi/${tutorial.youtubeId}/hqdefault.jpg`} 
                            alt={tutorial.title}
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-40 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60"></div>
                          <button
                            onClick={() => setPlayingVideoId(tutorial.id)}
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
              {/* Form & Sent Notifications History */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                
                {/* 1. Dispatch Form */}
                <div className="xl:col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                  <div>
                    <h4 className="text-lg font-bold flex items-center gap-2">
                      <FaBullhorn size={18} className="text-emerald-500" />
                      Yangi bildirishnoma yuborish
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Barcha foydalanuvchilarning shaxsiy kabinetiga xabar yuborish. Qisqa va batafsil ma'lumotlar bilan boyiting.
                    </p>
                  </div>

                  <form onSubmit={handleCreateNotification} className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Xabar sarlavhasi (Majburiy)</label>
                      <input
                        type="text"
                        placeholder="Masalan: Yozgi yangi stillar qo'shildi! 💈"
                        value={newNotification.title}
                        onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                        className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-white"
                        required
                      />
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Qisqa ma'lumot (Listda ko'rinadi - Majburiy)</label>
                      <textarea
                        placeholder="Masalan: Katalogimizga yangi zamonaviy soch stillari yuklandi..."
                        value={newNotification.description}
                        onChange={(e) => setNewNotification({ ...newNotification, description: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-white resize-none"
                        required
                      ></textarea>
                    </div>

                    {/* Detailed Content */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Batafsil matn (Ichiga kirganda o'qiladi - Ixtiyoriy)</label>
                      <textarea
                        placeholder="Masalan: Ushbu xabarning batafsil mazmuni, o'zgarishlar va shartlar bu yerda to'liq yoziladi..."
                        value={newNotification.content}
                        onChange={(e) => setNewNotification({ ...newNotification, content: e.target.value })}
                        rows="4"
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-white"
                      ></textarea>
                    </div>

                    {/* Category Type */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Tur (Kategoriya)</label>
                        <select
                          value={newNotification.type}
                          onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                          className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-white"
                        >
                          <option value="system">Tizim (Yangilik)</option>
                          <option value="welcome">Xush kelibsiz</option>
                          <option value="loyalty">Sadoqat dasturi</option>
                          <option value="appointment">Navbat / Tashrif</option>
                        </select>
                      </div>

                      {/* Action Link Type */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Harakat tugmasi</label>
                        <select
                          value={newNotification.linkType}
                          onChange={(e) => setNewNotification({ ...newNotification, linkType: e.target.value })}
                          className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-white"
                        >
                          <option value="none">Tugmasiz (Harakatsiz)</option>
                          <option value="booking">Navbat olish sahifasi</option>
                          <option value="styles">Stillar sahifasi</option>
                          <option value="loyalty">Loyallik kartasi</option>
                          <option value="external">Tashqi havola</option>
                        </select>
                      </div>
                    </div>

                    {/* Conditional Link URL */}
                    {newNotification.linkType === 'external' && (
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Tashqi havola manzili (URL)</label>
                        <input
                          type="url"
                          placeholder="Masalan: https://t.me/barber_bot"
                          value={newNotification.linkUrl}
                          onChange={(e) => setNewNotification({ ...newNotification, linkUrl: e.target.value })}
                          className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-white"
                          required
                        />
                      </div>
                    )}

                    {/* Image URL (optional) */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Rasm havolasi (Banner - Ixtiyoriy)</label>
                      <input
                        type="url"
                        placeholder="Masalan: https://images.unsplash.com/... (yoki bo'sh qoldiring)"
                        value={newNotification.imageUrl}
                        onChange={(e) => setNewNotification({ ...newNotification, imageUrl: e.target.value })}
                        className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-white"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={notificationSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 border-none"
                    >
                      {notificationSubmitting ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Yuborilmoqda...</span>
                        </>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <span>Bildirishnomani Yuborish</span>
                          <FaPaperPlane size={11} />
                        </span>
                      )}
                    </button>
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
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                      {notificationsList.map((notif) => (
                        <div
                          key={notif._id || notif.id}
                          className="bg-zinc-950/30 border border-zinc-850 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 hover:border-zinc-700 transition-colors"
                        >
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Type Badge */}
                              <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                notif.type === 'welcome'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                                  : notif.type === 'loyalty'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                                  : notif.type === 'appointment'
                                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/25'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                              }`}>
                                {notif.type === 'welcome' && 'Xush kelibsiz'}
                                {notif.type === 'loyalty' && 'Sadoqat dasturi'}
                                {notif.type === 'appointment' && 'Navbat / Tashrif'}
                                {notif.type === 'system' && 'Tizim'}
                              </span>

                              {/* Link action Badge */}
                              {notif.linkType !== 'none' && (
                                <span className="inline-flex items-center gap-1.5 text-[9px] font-bold bg-purple-500/10 border border-purple-500/25 text-purple-400 px-2 py-0.5 rounded-full select-none">
                                  <FaLink size={8} />
                                  <span>Tugma: {notif.linkType}</span>
                                </span>
                              )}
                              
                              <span className="text-[10px] text-zinc-500 font-medium">
                                {new Date(notif.createdAt || Date.now()).toLocaleString('uz-UZ')}
                              </span>
                            </div>

                            <h5 className="font-bold text-white text-sm">{notif.title}</h5>
                            <p className="text-xs text-zinc-400 leading-relaxed">{notif.description}</p>
                            
                            {notif.content && notif.content !== notif.description && (
                              <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-white/5 text-[11px] text-zinc-500 whitespace-pre-line mt-1.5 font-medium max-h-24 overflow-y-auto">
                                <span className="text-zinc-400 font-bold block mb-1">Batafsil matni:</span>
                                {notif.content}
                              </div>
                            )}

                            {notif.imageUrl && (
                              <div className="text-[10px] text-emerald-400/80 font-semibold truncate max-w-md inline-flex items-center gap-1">
                                <FaImage size={10} />
                                <span>Banner URL: <a href={notif.imageUrl} target="_blank" rel="noreferrer" className="underline hover:text-emerald-300">{notif.imageUrl}</a></span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-end md:border-l md:border-white/5 md:pl-4">
                            <button
                              onClick={() => handleDeleteNotification(notif._id || notif.id)}
                              className="p-2.5 bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/25 rounded-xl transition-all active:scale-[0.97] cursor-pointer"
                              title="O'chirish"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
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
    </div>
  );
};

export default AdminDashboard;
