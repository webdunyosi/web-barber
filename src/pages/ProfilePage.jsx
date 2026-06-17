import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaPhone, FaPaperPlane, FaSignOutAlt, FaUserShield, FaSignInAlt, FaEdit, FaSave, FaTimes, FaSpinner, FaCut, FaRobot, FaChevronRight, FaCalendarCheck, FaGift } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/features/auth/AuthModal';

const ProfilePage = () => {
  const { user, isAuthenticated, isAdmin, logout, updateProfile } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedTelegram, setEditedTelegram] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize edit fields when user info changes or edit mode is toggled
  useEffect(() => {
    if (user) {
      setEditedName(user.name || '');
      setEditedTelegram(user.telegram || '');
    }
  }, [user, isEditing]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editedName.trim()) {
      setErrorMessage('Ism kiritilishi majburiy!');
      return;
    }
    
    setIsUpdating(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await updateProfile({
        name: editedName,
        telegram: editedTelegram
      });
      setSuccessMessage('Profil muvaffaqiyatli yangilandi!');
      setIsEditing(false);
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
        
        {/* Page Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Shaxsiy Kabinet
        </h2>

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

        {isEditing ? (
          /* Editing Form Card */
          <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white mb-2 border-b border-white/5 pb-3">Profilni tahrirlash</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Ism</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  disabled={isUpdating}
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
                    disabled={isUpdating}
                    className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                    placeholder="username"
                  />
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
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                  className="flex-1 bg-zinc-800 border border-white/5 hover:bg-zinc-750 text-gray-300 font-semibold py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50"
                >
                  <FaTimes size={12} />
                  <span>Bekor qilish</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Profile Details \ Navigation lists (App style) */
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
                {/* Edit profile header shortcut */}
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setErrorMessage('');
                  }}
                  className="w-10 h-10 rounded-xl bg-zinc-800/80 hover:bg-zinc-855 border border-white/5 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shrink-0"
                  title="Profilni tahrirlash"
                >
                  <FaEdit size={16} />
                </button>
              </div>
            </div>

            {/* Guruh 1: Asosiy Xizmatlar (List Group 1) */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
              <div className="p-1">
                {/* Item 1: Mening buyurtmalarim */}
                <button
                  onClick={() => navigate('/buyurtmalarim')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-white/5 text-left font-sans"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaCalendarCheck size={16} />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-zinc-200">Mening buyurtmalarim</span>
                  <FaChevronRight size={12} className="text-zinc-500" />
                </button>

                {/* Item 2: Sadoqat kartasi */}
                <button
                  onClick={() => navigate('/loyalty')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-white/5 text-left font-sans"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaGift size={16} />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-zinc-200">Sadoqat kartasi (Loyalty)</span>
                  <div className="flex items-center gap-1.5">
                    {user?.loyaltyPoints > 0 && (
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25 font-bold">
                        {user.loyaltyPoints} ball
                      </span>
                    )}
                    <FaChevronRight size={12} className="text-zinc-500" />
                  </div>
                </button>

                {/* Item 3: Soch stillari */}
                <button
                  onClick={() => navigate('/stillar')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-white/5 text-left font-sans"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaCut size={16} />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-zinc-200">Soch va soqol stillari</span>
                  <FaChevronRight size={12} className="text-zinc-500" />
                </button>

                {/* Item 4: AI chat bot */}
                <button
                  onClick={() => navigate('/ai-chat')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors duration-200 cursor-pointer text-left font-sans"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaRobot size={16} />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-zinc-200">AI Yordamchi Bot</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25 font-extrabold uppercase animate-pulse">
                      Online
                    </span>
                    <FaChevronRight size={12} className="text-zinc-500" />
                  </div>
                </button>
              </div>
            </div>

            {/* Guruh 2: Sozlamalar va Ma'lumotlar (List Group 2) */}
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
                    setIsEditing(true);
                    setErrorMessage('');
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
            <p className="text-center text-[10px] text-zinc-600 font-medium tracking-wide pt-2">
              Ilova versiyasi 1.10.42 (Build 349)
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;
