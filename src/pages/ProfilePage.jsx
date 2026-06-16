import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaPhone, FaPaperPlane, FaSignOutAlt, FaUserShield, FaSignInAlt, FaEdit, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
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
      <div className="w-full lg:w-5/6 ml-auto min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-white text-center">
        <div className="max-w-md w-full bg-zinc-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
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
    <div className="w-full lg:w-5/6 ml-auto text-white px-4 py-6 pb-24 lg:pb-8">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Page Title */}
        <h2 className="text-3xl font-extrabold mb-4 text-center bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Shaxsiy Kabinet
        </h2>

        {/* User Info Card */}
        <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between h-fit">
          <div>
            {/* Profile Avatar */}
            <div className="text-center mb-6 border-b border-white/5 pb-6">
              <img 
                src="/avatar/men.png" 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border border-emerald-500/30 mx-auto mb-3 shadow-lg shadow-emerald-500/10" 
              />
              {!isEditing ? (
                <>
                  <h3 className="text-xl font-bold tracking-wide">{user?.name}</h3>
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {isAdmin ? 'Sartarosh (Admin)' : 'Mijoz'}
                  </span>
                </>
              ) : (
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Profilni tahrirlash
                </span>
              )}
            </div>

            {/* Error and Success Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                {successMessage}
              </div>
            )}

            {/* User Details / Form */}
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-gray-400">
                    <FaPhone size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Telefon raqam</p>
                    <p className="text-sm font-semibold text-gray-200">{user?.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-gray-400">
                    <FaPaperPlane size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Telegram username</p>
                    <p className="text-sm font-semibold text-gray-200">
                      {user?.telegram ? `@${user.telegram}` : 'kiritilmagan'}
                    </p>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setErrorMessage('');
                  }}
                  className="w-full mt-4 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 hover:border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <FaEdit size={14} />
                  <span>Profilni tahrirlash</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Ism</label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    disabled={isUpdating}
                    className="w-full bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 animate-fade-in"
                    placeholder="Ismingizni kiriting"
                    required
                  />
                </div>

                {/* Phone Input (Readonly) */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Telefon raqam (O'zgartirilmaydi)</label>
                  <div className="flex items-center gap-2 bg-zinc-800/30 border border-white/5 rounded-xl px-3 py-2 text-gray-500 text-sm">
                    <FaPhone size={12} className="text-gray-600" />
                    <span>{user?.phone}</span>
                  </div>
                </div>

                {/* Telegram Username Input */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Telegram username</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-500 text-sm">@</span>
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
                    className="flex-1 bg-linear-to-br from-emerald-500 to-green-600 text-white font-bold py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50"
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
                    className="flex-1 bg-zinc-800 border border-white/5 hover:bg-zinc-700/50 text-gray-300 font-semibold py-2.5 px-3 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50"
                  >
                    <FaTimes size={12} />
                    <span>Bekor qilish</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Logout/Admin buttons */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="w-full bg-linear-to-br from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-emerald-500/20 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-emerald-400 cursor-pointer text-sm"
              >
                <FaUserShield size={16} />
                <span>Admin Panelga o'tish</span>
              </button>
            )}
            
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <FaSignOutAlt size={16} />
              <span>Tizimdan chiqish</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
