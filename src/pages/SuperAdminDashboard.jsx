import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  FaUserTie, FaUsers, FaCalendarCheck, FaCoins, FaPlus, 
  FaTrash, FaEdit, FaCopy, FaCheck, FaTimes, FaSpinner, 
  FaSignOutAlt, FaEye, FaEyeSlash, FaChartBar, FaUserShield
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const { token, logout, getBarbers, createBarber, updateBarber, deleteBarber, getSuperadminStats } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('barbers'); // 'barbers' or 'statistics'
  const [barbers, setBarbers] = useState([]);
  const [stats, setStats] = useState({ barbersCount: 0, clientsCount: 0, appointmentsCount: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  
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

  const copyUrl = (slug, id) => {
    const origin = window.location.origin;
    const url = `${origin}/b/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Mijoz havolasi nusxalandi');
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
              <span className="text-xxs font-bold text-emerald-500/80 uppercase">Super Admin</span>
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

      {/* Mobile Header Bar */}
      <header className="lg:hidden bg-zinc-900/90 border-b border-emerald-500/20 py-4 px-6 sticky top-0 z-40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaUserShield className="text-emerald-500" size={20} />
          <h1 className="text-md font-bold uppercase tracking-wider text-emerald-400">Web Barber SaaS</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
        >
          Chiqish
        </button>
      </header>

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
                      <div key={barber._id} className="bg-zinc-900/40 border border-zinc-850 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-zinc-700/60 transition-all shadow-md relative overflow-hidden group">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={barber.avatar || "/avatar/men.png"} 
                              alt={barber.name} 
                              className="w-12 h-12 rounded-full object-cover border border-zinc-800 group-hover:border-emerald-500/30 transition-colors"
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
                              <span className="text-zinc-600">Telefon:</span>
                              <span className="font-semibold text-zinc-300">{barber.phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-600">Telegram:</span>
                              <span className="font-semibold text-zinc-300">
                                {barber.telegram ? `@${barber.telegram}` : '-'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-600">Slug:</span>
                              <span className="font-semibold text-emerald-500">/{barber.slug}</span>
                            </div>
                          </div>

                          <div className="bg-zinc-950/80 border border-zinc-850 rounded-xl p-2.5 flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] text-zinc-650 font-bold uppercase tracking-wider block leading-none">Mijoz havolasi</span>
                              <span className="text-xxs font-mono text-zinc-450 truncate block mt-1">
                                {window.location.origin}/b/{barber.slug}
                              </span>
                            </div>
                            <button
                              onClick={() => copyUrl(barber.slug, barber._id)}
                              className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 flex items-center justify-center cursor-pointer transition-colors"
                              title="Nusxalash"
                            >
                              {copiedId === barber._id ? <FaCheck className="text-emerald-400" size={11} /> : <FaCopy size={11} />}
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-zinc-850/60 pt-3.5 flex items-center justify-between">
                          <button
                            onClick={() => handleToggleStatus(barber)}
                            className={`text-xxs font-bold uppercase px-2.5 py-1 rounded-full cursor-pointer transition-colors active:scale-95 ${
                              barber.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                            }`}
                          >
                            {barber.status === 'active' ? 'Faol' : 'Bloklangan'}
                          </button>

                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => handleOpenEditModal(barber)}
                              className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-750 text-zinc-400 hover:text-white border border-zinc-850 flex items-center justify-center transition-colors cursor-pointer"
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
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block">Sartaroshlar</span>
                      <p className="text-3xl font-black">{stats.barbersCount}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaUserTie size={24} />
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block">Mijozlar</span>
                      <p className="text-3xl font-black">{stats.clientsCount}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaUsers size={24} />
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block">Buyurtmalar</span>
                      <p className="text-3xl font-black">{stats.appointmentsCount}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaCalendarCheck size={24} />
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block">Karta Tushumi</span>
                      <p className="text-3xl font-black text-emerald-400">{(stats.revenue || 0).toLocaleString()} UZS</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaCoins size={24} />
                    </div>
                  </div>
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
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Havola Slug (URL nomi)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xxs font-mono text-zinc-500">/b/</span>
                    <input 
                      type="text" 
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      placeholder="masalan, jasur"
                      className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-xl pl-8 pr-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
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

              <div>
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Salon haqida tavsif (Ixtiyoriy)</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Salon yoki sartarosh haqida batafsil ma'lumotlar..."
                  className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
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
