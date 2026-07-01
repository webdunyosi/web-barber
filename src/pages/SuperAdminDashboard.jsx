import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  FaUserTie, FaUsers, FaCalendarCheck, FaCoins, FaPlus, 
  FaTrash, FaEdit, FaCopy, FaCheck, FaTimes, FaSpinner, 
  FaSignOutAlt, FaEye, FaEyeSlash, FaChartBar, FaUserShield, FaUser,
  FaChevronRight, FaSave, FaPhone, FaPaperPlane
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const { user, token, logout, getBarbers, createBarber, updateBarber, deleteBarber, getSuperadminStats, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('barbers'); // 'barbers', 'statistics' or 'profile'
  const [barbers, setBarbers] = useState([]);
  const [stats, setStats] = useState({ barbersCount: 0, clientsCount: 0, appointmentsCount: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState(user?.phone || '');
  const [editedTelegram, setEditedTelegram] = useState(user?.telegram || '');
  const [editedPassword, setEditedPassword] = useState('');
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);

  // Sync state on user load
  useEffect(() => {
    if (user) {
      setEditedName(user.name || '');
      setEditedPhone(user.phone || '');
      setEditedTelegram(user.telegram || '');
    }
  }, [user, isEditingProfile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsProfileUpdating(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      const updateData = {
        name: editedName,
        telegram: editedTelegram
      };
      if (editedPassword.trim()) {
        updateData.password = editedPassword;
      }
      await updateProfile(updateData);
      setProfileSuccess('Profil muvaffaqiyatli yangilandi!');
      setIsEditingProfile(false);
      setEditedPassword('');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (error) {
      console.error('Update profile error:', error);
      setProfileError(error.response?.data?.error || error.message || 'Profilni yangilashda xatolik yuz berdi');
    } finally {
      setIsProfileUpdating(false);
    }
  };

  // Modals / Forms state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    slug: '',
    shopName: '',
    description: '',
    telegram: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const barbersData = await getBarbers();
      const statsData = await getSuperadminStats();
      setBarbers(barbersData);
      setStats(statsData);
    } catch (error) {
      console.error('Superadmin load error:', error);
      toast.error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingBarber(null);
    setFormData({
      name: '',
      phone: '',
      password: '',
      slug: '',
      shopName: '',
      description: '',
      telegram: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (barber) => {
    setEditingBarber(barber);
    setFormData({
      name: barber.name || '',
      phone: barber.phone || '',
      password: '', // blank by default
      slug: barber.slug || '',
      shopName: barber.shopName || '',
      description: barber.description || '',
      telegram: barber.telegram || ''
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'slug') {
      // Force alphanumeric slugs
      setFormData(prev => ({ ...prev, [name]: value.toLowerCase().replace(/[^a-z0-9-_]/g, '') }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingBarber) {
        // Edit barber
        const updateData = { ...formData };
        if (!updateData.password.trim()) delete updateData.password;
        
        await updateBarber(editingBarber._id, updateData);
        toast.success('Sartarosh muvaffaqiyatli tahrirlandi');
      } else {
        // Create new barber
        if (!formData.password.trim()) {
          toast.error('Parol kiritilishi majburiy');
          setSubmitting(false);
          return;
        }
        await createBarber(formData);
        toast.success('Yangi sartarosh muvaffaqiyatli ro\'yxatdan o\'tkazildi');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Haqiqatan ham ${name} va uning barcha ma'lumotlarini o'chirib tashlamoqchisiz?`)) {
      try {
        await deleteBarber(id);
        toast.success('Sartarosh muvaffaqiyatli o\'chirildi');
        loadData();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('O\'chirishda xatolik yuz berdi');
      }
    }
  };

  const handleToggleStatus = async (barber) => {
    const newStatus = barber.status === 'active' ? 'blocked' : 'active';
    try {
      await updateBarber(barber._id, { status: newStatus });
      toast.success(`Sartarosh holati yangilandi`);
      loadData();
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Holatni o\'zgartirishda xatolik');
    }
  };

  const copySlug = (slug, id) => {
    navigator.clipboard.writeText(slug);
    setCopiedId(id);
    toast.success('Sartarosh kodi nusxalandi');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col lg:flex-row web-pattern">
      
      {/* Super Admin Sidebar */}
      <aside className="hidden lg:flex w-full lg:w-64 bg-zinc-900/90 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-emerald-500/30 flex-col justify-between shrink-0 sticky top-0 h-screen">
        <div className="p-4 flex-1 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <FaUserShield className="text-emerald-500" size={24} />
            <div>
              <h1 className="text-lg font-extrabold uppercase tracking-wider text-emerald-400">Web Barber</h1>
              <span className="text-xxs font-bold text-emerald-500/80 uppercase">Admin</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5 flex-1">
            <button
              onClick={() => setActiveTab('barbers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm cursor-pointer ${
                activeTab === 'barbers'
                  ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaUserTie size={18} />
              <span>Sartaroshlar</span>
            </button>

            <button
              onClick={() => setActiveTab('statistics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm cursor-pointer ${
                activeTab === 'statistics'
                  ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaChartBar size={18} />
              <span>Tizim Statistikasi</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaUser size={18} />
              <span>Profil Boshqaruvi</span>
            </button>
          </nav>

          {/* Logout button at bottom of sidebar */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-red-400 text-sm font-semibold py-2.5 px-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer mt-auto"
          >
            <FaSignOutAlt size={14} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>



      {/* Main Admin Workspace Container */}
      <main className="flex-1 min-w-0 p-4 md:p-8 pb-24 lg:pb-8 overflow-y-auto">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin"></div>
            <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest animate-pulse">Ma'lumotlar yuklanmoqda...</span>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            
            {/* TAB 1: BARBERS MANAGEMENT */}
            {activeTab === 'barbers' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black tracking-wide">Sartaroshlar Boshqaruvi</h2>
                    <p className="text-xs text-zinc-500">Tizimda sartaroshlarni qo'shishingiz va ularning profillarini boshqarishingiz mumkin</p>
                  </div>
                  <button 
                    onClick={handleOpenAddModal}
                    className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-xs"
                  >
                    <FaPlus size={12} />
                    <span>Yangi Qo'shish</span>
                  </button>
                </div>

                {barbers.length === 0 ? (
                  <div className="text-center py-16 bg-zinc-900/20 border border-zinc-850 rounded-3xl">
                    <span className="text-4xl block mb-2">💈</span>
                    <p className="text-zinc-400 font-bold text-sm">Hozircha ro'yxatdan o'tgan sartaroshlar mavjud emas.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {barbers.map((barber) => (
                      <div key={barber._id} className="bg-zinc-900/40 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 relative overflow-hidden rounded-3xl pl-7 pr-5 py-5 flex flex-col justify-between space-y-4 group">
                        
                        {/* Status Accent Left Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${
                          barber.status === 'active' 
                            ? 'bg-gradient-to-b from-emerald-500 to-green-600 shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
                            : 'bg-gradient-to-b from-red-500 to-rose-600 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                        }`}></div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={barber.avatar || "/avatar/men.png"} 
                              alt={barber.name} 
                              className="w-12 h-12 rounded-full object-cover border border-zinc-800/80 group-hover:border-emerald-500/30 transition-colors"
                            />
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base font-bold truncate group-hover:text-emerald-400 transition-colors">
                                {barber.name}
                              </h3>
                              <span className="text-emerald-400 text-xxs font-bold uppercase tracking-wider block bg-emerald-500/5 border border-emerald-500/10 w-fit px-1.5 py-0.5 rounded-md mt-0.5">
                                {barber.shopName || 'Salon nomi yo\'q'}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs text-zinc-400">
                            <div className="flex justify-between">
                              <span className="text-zinc-650 font-medium">Telefon:</span>
                              <span className="font-semibold text-zinc-300">{barber.phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-650 font-medium">Telegram:</span>
                              <span className="font-semibold text-zinc-300">
                                {barber.telegram ? `@${barber.telegram}` : '-'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-650 font-medium">Sartarosh kodi:</span>
                              <span className="font-semibold text-emerald-500">{barber.slug}</span>
                            </div>
                          </div>

                          <div className="bg-zinc-950/40 border border-zinc-900/80 rounded-xl p-2.5 flex items-center justify-between gap-2 backdrop-blur-sm">
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] text-zinc-650 font-bold uppercase tracking-wider block leading-none">Mijozlar kirishi uchun kod</span>
                              <span className="text-xs font-mono font-bold text-emerald-400 block mt-1">
                                {barber.slug}
                              </span>
                            </div>
                            <button
                              onClick={() => copySlug(barber.slug, barber._id)}
                              className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 flex items-center justify-center cursor-pointer transition-colors"
                              title="Nusxalash"
                            >
                              {copiedId === barber._id ? <FaCheck className="text-emerald-400" size={11} /> : <FaCopy size={11} />}
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-zinc-850/40 pt-3.5 flex items-center justify-between">
                          <button
                            onClick={() => handleToggleStatus(barber)}
                            className={`text-xxs font-bold uppercase px-2.5 py-1 rounded-full cursor-pointer transition-colors active:scale-95 ${
                              barber.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            }`}
                          >
                            {barber.status === 'active' ? 'Faol' : 'Bloklangan'}
                          </button>

                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => handleOpenEditModal(barber)}
                              className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-750 text-zinc-400 hover:text-white border border-zinc-850/60 flex items-center justify-center transition-colors cursor-pointer"
                              title="Tahrirlash"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button 
                              onClick={() => handleDelete(barber._id, barber.name)}
                              className="w-8 h-8 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 flex items-center justify-center transition-colors cursor-pointer"
                              title="O'chirish"
                            >
                              <FaTrash size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SYSTEM STATISTICS */}
            {activeTab === 'statistics' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black tracking-wide">Tizim Statistikasi</h2>
                  <p className="text-xs text-zinc-500">Platformaning global ko'rsatkichlari va tushum hisobotlari</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Metric 1 */}
                  <div className="bg-zinc-900/40 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 rounded-3xl p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-550 font-bold uppercase tracking-wider block">Sartaroshlar</span>
                      <p className="text-3xl font-black">{stats.barbersCount}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaUserTie size={24} />
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-zinc-900/40 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 rounded-3xl p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-550 font-bold uppercase tracking-wider block">Mijozlar</span>
                      <p className="text-3xl font-black">{stats.clientsCount}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaUsers size={24} />
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-zinc-900/40 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 rounded-3xl p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-550 font-bold uppercase tracking-wider block">Buyurtmalar</span>
                      <p className="text-3xl font-black">{stats.appointmentsCount}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaCalendarCheck size={24} />
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="bg-zinc-900/40 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 rounded-3xl p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-550 font-bold uppercase tracking-wider block">Karta Tushumi</span>
                      <p className="text-3xl font-black text-emerald-400">{(stats.revenue || 0).toLocaleString()} UZS</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaCoins size={24} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROFILE MANAGEMENT */}
            {activeTab === 'profile' && (
              <div className="w-full text-white px-0 sm:px-4 py-2 pb-4 animate-fadeIn">
                <div className="max-w-md mx-auto space-y-5">
                  
                  {/* Page Title */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-center bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                    Shaxsiy Kabinet
                  </h2>

                  {/* Success / Error Alerts */}
                  {profileError && (
                    <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold animate-fadeIn">
                      {profileError}
                    </div>
                  )}
                  {profileSuccess && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-fadeIn">
                      {profileSuccess}
                    </div>
                  )}

                  {isEditingProfile ? (
                    /* Editing Form Card */
                    <div className="bg-zinc-900/40 backdrop-blur-md shadow-xl rounded-3xl p-5 space-y-4 relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-green-600 shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
                      <h3 className="text-base font-bold text-white mb-2 border-b border-white/5 pb-3">Profilni tahrirlash</h3>
                      
                      <form onSubmit={handleSaveProfile} className="space-y-4" autoComplete="off">
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
                              disabled
                              className="w-full bg-zinc-950/40 border border-zinc-900 text-zinc-550 rounded-xl pl-9 pr-3 py-2 text-sm cursor-not-allowed select-none"
                              placeholder={user?.phone || "+998 99 999 99 99"}
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
                      <div className="bg-zinc-900/40 backdrop-blur-md shadow-xl rounded-3xl p-4 sm:p-5 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-green-600 shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
                        
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
                                Admin
                              </span>
                            </div>
                          </div>
                          {/* Edit profile header shortcut */}
                          <button
                            onClick={() => {
                              setIsEditingProfile(true);
                              setProfileError('');
                            }}
                            className="w-10 h-10 rounded-xl bg-zinc-800/80 hover:bg-zinc-750 border border-white/5 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shrink-0"
                            title="Profilni tahrirlash"
                          >
                            <FaEdit size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Group 1: Manage Sections */}
                      <div className="bg-zinc-900/40 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden">
                        <div className="p-1">
                          {/* Item 1: Sartaroshlar Boshqaruvi */}
                          <button
                            onClick={() => setActiveTab('barbers')}
                            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-white/5 text-left font-sans"
                          >
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                              <FaUserTie size={16} />
                            </div>
                            <span className="flex-1 text-sm font-semibold text-zinc-200">Sartaroshlar boshqaruvi</span>
                            <FaChevronRight size={12} className="text-zinc-500" />
                          </button>

                          {/* Item 2: Tizim Statistikasi */}
                          <button
                            onClick={() => setActiveTab('statistics')}
                            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer text-left font-sans"
                          >
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                              <FaChartBar size={16} />
                            </div>
                            <span className="flex-1 text-sm font-semibold text-zinc-200">Tizim statistikasi</span>
                            <FaChevronRight size={12} className="text-zinc-500" />
                          </button>
                        </div>
                      </div>

                      {/* Group 2: Developer Contact Info */}
                      <div className="bg-zinc-900/40 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden">
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
                                +998 50 950 95 45
                              </span>
                            </div>
                            <FaChevronRight size={12} className="text-zinc-500 group-hover:text-zinc-300 transition-colors duration-200" />
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/95 border-t border-emerald-500/20 py-2.5 px-6 flex justify-around items-center z-40 backdrop-blur-lg">
        <button
          onClick={() => setActiveTab('barbers')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
            activeTab === 'barbers' ? 'text-emerald-400' : 'text-zinc-500'
          }`}
        >
          <FaUserTie size={18} />
          <span>Sartaroshlar</span>
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
            activeTab === 'statistics' ? 'text-emerald-400' : 'text-zinc-500'
          }`}
        >
          <FaChartBar size={18} />
          <span>Statistika</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-emerald-400' : 'text-zinc-500'
          }`}
        >
          <FaUser size={18} />
          <span>Profil</span>
        </button>
      </div>

      {/* Modal Dialog for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="bg-zinc-950 border-b border-zinc-850 px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingBarber ? 'Sartarosh ma\'lumotlarini tahrirlash' : 'Yangi sartarosh qo\'shish'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <FaTimes size={12} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Ism / Familiya</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Masalan, Jasur Ali"
                    className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Telefon raqam</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Masalan, +998 90 123 45 67"
                    className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Sartarosh kodi</label>
                  <input 
                    type="text" 
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    placeholder="masalan, jasur"
                    className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Salon nomi</label>
                  <input 
                    type="text" 
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    required
                    placeholder="Masalan, Barber Premium"
                    className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                  {editingBarber ? 'Yangi Parol (Agar o\'zgartirmoqchi bo\'lsangiz)' : 'Parol'}
                </label>
                <div className="relative flex items-center">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingBarber}
                    placeholder={editingBarber ? 'O\'zgartirishni xohlamasangiz bo\'sh qoldiring' : 'Kirish paroli'}
                    className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-xl pl-3 pr-10 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Telegram Username (Ixtiyoriy)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-zinc-500 text-sm font-semibold">@</span>
                  <input 
                    type="text" 
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleInputChange}
                    placeholder="username"
                    className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-xl pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>



              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-2.5 px-4 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50"
                >
                  {submitting ? <FaSpinner size={12} className="animate-spin" /> : null}
                  <span>{editingBarber ? 'Saqlash' : 'Tizimga qo\'shish'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-bold py-2.5 px-4 rounded-xl border border-zinc-700/30 transition-all cursor-pointer text-xs disabled:opacity-50"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
