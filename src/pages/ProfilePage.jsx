import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaPhone, FaPaperPlane, FaSignOutAlt, FaUserShield, FaSignInAlt, FaEdit, FaSave, FaTimes, FaSpinner, FaCut, FaRobot, FaChevronRight, FaCalendarCheck, FaGift, FaBell, FaBookOpen, FaPlay, FaYoutube, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/features/auth/AuthModal';

const userTutorialsList = [
  {
    id: 'user-tut1',
    youtubeId: '6HPVo-X5qg0',
    title: "Botga kirish",
    description: "Botga kirish va dasturni ochishning 3 xil usuli bo'yicha yo'riqnoma.",
    duration: "01:00"
  },
  {
    id: 'user-tut2',
    youtubeId: 'L0duYJ0zPpc',
    title: "Ro'yxatdan o'tish",
    description: "Mijozlar uchun ilovada ro'yxatdan o'tish bo'yicha video darslik.",
    duration: "01:00"
  },
  {
    id: 'user-tut3',
    youtubeId: 'Wo8sAmFKm94',
    title: "Stillar bo'limi",
    description: "Stillar bo'limidan foydalanish va soch turmaklarini tanlash bo'yicha darslik.",
    duration: "00:50"
  },
  {
    id: 'user-tut4',
    youtubeId: '149-MpmVEBs',
    title: "Sartarosh haqida bo'limi",
    description: "Sartarosh haqidagi bo'lim va uning faoliyati bilan tanishish.",
    duration: "00:45"
  },
  {
    id: 'user-tut5',
    youtubeId: 'ImqFzzKCsOA',
    title: "Sadoqat kartasi",
    description: "Sadoqat kartasi bo'limi va cashback tizimidan foydalanish tartibi.",
    duration: "01:10"
  },
  {
    id: 'user-tut6',
    youtubeId: 'Ojyyr0JvVJ8',
    title: "Sun'iy intellekt chat boti",
    description: "Sun'iy intellekt chat boti bo'limidan foydalanish bo'yicha video darslik.",
    duration: "01:15"
  },
  {
    id: 'user-tut7',
    youtubeId: 'RkpoqSi1xBs',
    title: "Buyurtma berish",
    description: "Dastur orqali xizmatlarga buyurtma berish va joy band qilish jarayoni.",
    duration: "02:30"
  },
  {
    id: 'user-tut8',
    youtubeId: 'VIMN2WEHq6Q',
    title: "Profil bo'limi",
    description: "Profil bo'limi va shaxsiy ma'lumotlarni tahrirlash bo'yicha video darslik.",
    duration: "01:20"
  }
];

const ProfilePage = () => {
  const { user, isAuthenticated, isAdmin, isSuperAdmin, logout, updateProfile } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  // Redirect admins to their dashboards immediately
  useEffect(() => {
    if (isAuthenticated) {
      if (isSuperAdmin) {
        navigate('/superadmin');
      } else if (isAdmin) {
        navigate('/admin');
      }
    }
  }, [isAuthenticated, isAdmin, isSuperAdmin, navigate]);

  // Profile view state
  const [view, setView] = useState('profile'); // 'profile' | 'edit' | 'tutorials'
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedTelegram, setEditedTelegram] = useState('');
  const [editedPassword, setEditedPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Initialize edit fields when user info changes or edit mode is toggled
  useEffect(() => {
    if (user) {
      setEditedName(user.name || '');
      setEditedPhone(user.phone || '');
      setEditedTelegram(user.telegram || '');
      setEditedPassword('');
      setShowPassword(false);
    }
  }, [user, view]);

  // Notifications unread count
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    const saved = localStorage.getItem('barber_notifications');
    if (saved) {
      try {
        const notifs = JSON.parse(saved);
        const unread = notifs.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (e) {
        console.error('Error parsing notifications:', e);
      }
    } else {
      setUnreadCount(2); // Default mock notifications unread count
    }
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const finalName = editedName.trim() || user?.name || '';
    const finalTelegram = editedTelegram.trim() || user?.telegram || '';
    const finalPhone = editedPhone.trim() || user?.phone || '';
    
    setIsUpdating(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const updateData = {
        name: finalName,
        phone: finalPhone,
        telegram: finalTelegram
      };
      if (editedPassword.trim()) {
        updateData.password = editedPassword;
      }
      await updateProfile(updateData);
      setSuccessMessage('Profil muvaffaqiyatli yangilandi!');
      setView('profile');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Profilni yangilashda xato:', error);
      setErrorMessage(error.response?.data?.error || error.message || 'Serverda xatolik yuz berdi');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full lg:w-5/6 ml-auto min-h-[70vh] flex flex-col items-center justify-center px-0 sm:px-4 py-12 text-white text-center">
        <div className="max-w-md w-full bg-zinc-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <img 
            src="/avatar/men.png" 
            alt="Guest" 
            className="w-20 h-20 rounded-full object-cover border border-zinc-700/50 mx-auto mb-4" 
          />
          <h2 className="text-2xl font-bold mb-2">Profilga kirish</h2>
          <p className="text-gray-400 text-sm mb-6">
            Profilingizni ko'rish va boshqarish uchun iltimos tizimga kiring.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-linear-to-br from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-emerald-500/30 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] border border-emerald-400 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaSignInAlt size={16} />
            <span>Tizimga kirish</span>
          </button>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="w-full lg:w-5/6 ml-auto text-white px-0 sm:px-4 py-6 pb-4 lg:pb-8">
      <div className="max-w-md mx-auto space-y-5">
        
        {/* Success / Error Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold animate-fade-in">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-fade-in">
            {successMessage}
          </div>
        )}

        {view === 'edit' ? (
          /* Editing Form Card */
          <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white mb-2 border-b border-white/5 pb-3">Profilni tahrirlash</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4" autoComplete="off">
              {/* Name Input */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Ism</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  disabled={isUpdating}
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
                    disabled={isUpdating}
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
                    disabled={isUpdating}
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
                    disabled={isUpdating}
                    className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-3 pr-10 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                    placeholder="Bo'sh qoldirilsa o'zgarmaydi"
                    autoComplete="new-password"
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

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50"
                >
                  {isUpdating ? (
                    <FaSpinner size={12} className="animate-spin" />
                  ) : (
                    <FaSave size={12} />
                  )}
                  <span>Saqlash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setView('profile')}
                  disabled={isUpdating}
                  className="flex-1 bg-zinc-800 border border-white/5 hover:bg-zinc-750 text-gray-300 font-semibold py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50"
                >
                  <FaTimes size={12} />
                  <span>Bekor qilish</span>
                </button>
              </div>
            </form>
          </div>
        ) : view === 'tutorials' ? (
          /* Video Tutorials Card */
          <div className="space-y-6 animate-fadeIn pb-6">
            {/* Back button */}
            <button
              onClick={() => {
                setView('profile');
                setPlayingVideoId(null);
              }}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-wider bg-zinc-900 border border-zinc-850 px-4 py-2.5 rounded-xl active:scale-95 cursor-pointer hover:border-emerald-500/30 hover:text-emerald-400"
            >
              <FaArrowLeft size={10} />
              <span>Ortga qaytish</span>
            </button>

            {/* Title Header */}
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent uppercase tracking-wider">
                Ilovadan foydalanish darsliklari
              </h3>
              <p className="text-zinc-400 text-xs">Ilova imkoniyatlaridan to'g'ri foydalanish bo'yicha video darsliklar</p>
            </div>

            {/* Summary / Text Guidance */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 backdrop-blur-sm space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <FaBookOpen className="text-emerald-500" size={16} />
                Foydalanuvchi Qo'llanmasi:
              </h4>
              <div className="grid grid-cols-1 gap-3 text-xs text-zinc-400 leading-relaxed">
                <div className="bg-zinc-950/40 border border-zinc-900 p-3.5 rounded-2xl space-y-1">
                  <span className="font-bold text-zinc-200 block text-xs">1. Joy band qilish:</span>
                  <span>Kerakli sartaroshlik xizmatini tanlang, taqvimdan kun va soatni belgilang, so'ngra shaxsiy ma'lumotlaringizni to'ldiring.</span>
                </div>
                <div className="bg-zinc-950/40 border border-zinc-900 p-3.5 rounded-2xl space-y-1">
                  <span className="font-bold text-zinc-200 block text-xs">2. To'lovni tasdiqlash:</span>
                  <span>Onlayn karta orqali to'lov qilib, chek rasmini tizimga yuklang. Sartarosh to'lovni tekshirib, buyurtmangizni tasdiqlaydi.</span>
                </div>
                <div className="bg-zinc-950/40 border border-zinc-900 p-3.5 rounded-2xl space-y-1">
                  <span className="font-bold text-zinc-200 block text-xs">3. Sadoqat dasturi (Cashback):</span>
                  <span>Har safar buyurtmangiz tasdiqlanganda 1 ball to'playsiz. Ballar soni 9 taga yetganda, keyingi 10-tashrif bepul bo'ladi.</span>
                </div>
              </div>
            </div>

            {/* Video Lessons List */}
            <div className="space-y-4">
              {userTutorialsList.map((tutorial) => (
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
        ) : (
          /* Profile Details \ Navigation lists (App style) */
          <>
            {/* User Info Header Card */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative group shrink-0">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300 animate-pulse"></div>
                    <img 
                      src="/avatar/men.png" 
                      alt="Profile" 
                      className="relative w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold tracking-wide text-white truncate">{user?.name}</h3>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">{user?.phone}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-block px-2.5 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        {isAdmin ? 'Sartarosh (Admin)' : 'Mijoz'}
                      </span>
                      {user?.loyaltyPoints > 0 && (
                        <span className="inline-block px-2.5 py-0.5 text-[9px] font-extrabold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                          ⭐ premium
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit profile header shortcut */}
                <button
                  onClick={() => {
                    setView('edit');
                    setErrorMessage('');
                  }}
                  className="w-10 h-10 rounded-xl bg-zinc-800/80 hover:bg-zinc-850 border border-white/5 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shrink-0"
                  title="Profilni tahrirlash"
                >
                  <FaEdit size={16} />
                </button>
              </div>
            </div>

            {/* Guruh 1: Asosiy Xizmatlar (List Group 1) */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
              <div className="p-1">
                {/* Item 1: Soch stillari */}
                <button
                  onClick={() => navigate('/stillar')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-white/5 text-left font-sans"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaCut size={16} />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-zinc-200">Soch stillari</span>
                  <FaChevronRight size={12} className="text-zinc-500" />
                </button>

                {/* Item 2: Mening bildirishnomalarim */}
                <button
                  onClick={() => navigate('/bildirishnomalar')}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer text-left font-sans ${!isAdmin ? 'border-b border-white/5' : ''}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaBell size={16} />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-zinc-200">Mening bildirishnomalarim</span>
                  
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                  
                  <FaChevronRight size={12} className="text-zinc-500 ml-1" />
                </button>

                {/* Item 3: Ilovadan foydalanish darsliklari */}
                {!isAdmin && (
                  <button
                    onClick={() => setView('tutorials')}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer text-left font-sans"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <FaBookOpen size={16} />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-zinc-200">Ilovadan foydalanish darsliklari</span>
                    <FaChevronRight size={12} className="text-zinc-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Guruh 2: Sartarosh bilan bog'lanish (Barber Contact Info) */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
              <div className="p-1">
                {/* Item 1: Telegram Link */}
                <a
                  href="https://t.me/behruz_sartarosh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-all duration-200 border-b border-white/5 text-left font-sans cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 group-hover:bg-sky-500/20 group-hover:border-sky-500/30 flex items-center justify-center text-sky-400 transition-colors duration-200 shrink-0">
                    <FaPaperPlane size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] text-gray-400 uppercase tracking-wider">Sartarosh Telegram</span>
                    <span className="text-sm font-semibold text-zinc-200 truncate block group-hover:text-white transition-colors duration-200">
                      @behruz_sartarosh
                    </span>
                  </div>
                  <FaChevronRight size={12} className="text-zinc-500 group-hover:text-zinc-300 transition-colors duration-200" />
                </a>

                {/* Item 2: Phone Link */}
                <a
                  href="tel:+998509988965"
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-all duration-200 text-left font-sans cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 flex items-center justify-center text-emerald-400 transition-colors duration-200 shrink-0">
                    <FaPhone size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] text-gray-400 uppercase tracking-wider">Sartarosh Telefon</span>
                    <span className="text-sm font-semibold text-zinc-200 truncate block group-hover:text-white transition-colors duration-200">
                      +998 (50) 998-89-65
                    </span>
                  </div>
                  <FaChevronRight size={12} className="text-zinc-500 group-hover:text-zinc-300 transition-colors duration-200" />
                </a>
              </div>
            </div>



            {/* Guruh 3: Admin Paneli (agar foydalanuvchi Admin bo'lsa) */}
            {isAdmin && (
              <div className="bg-zinc-900/70 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
                <div className="p-1">
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer text-left font-sans"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
                      <FaUserShield size={16} />
                    </div>
                    <span className="flex-1 text-sm font-bold text-emerald-400">Admin Panelga o'tish</span>
                    <FaChevronRight size={12} className="text-emerald-400" />
                  </button>
                </div>
              </div>
            )}

            {/* Tizimdan Chiqish Tugmasi (Full width) */}
            <div className="pt-2">
              <button
                onClick={() => {
                  sessionStorage.removeItem('viewing_storefront');
                  logout();
                  navigate('/');
                }}
                className="w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-semibold py-3.5 px-4 rounded-2xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm font-sans"
              >
                <FaSignOutAlt size={16} />
                <span>Tizimdan chiqish</span>
              </button>
            </div>

            {/* Versiya ma'lumoti */}

          </>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;
