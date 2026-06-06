import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaUserCircle, FaPhone, FaPaperPlane, FaCalendarCheck, FaClock, FaDollarSign, FaSignOutAlt, FaUserShield, FaSignInAlt, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/features/auth/AuthModal';

const ProfilePage = () => {
  const { user, token, isAuthenticated, isAdmin, logout, getMyBookings } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (isAuthenticated && token) {
        setIsLoading(true);
        try {
          const data = await getMyBookings();
          setBookings(data);
        } catch (error) {
          console.error("Buyurtmalarni yuklashda xato:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchBookings();
  }, [isAuthenticated, token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Tasdiqlangan
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Rad etilgan
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
            Kutilmoqda
          </span>
        );
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
            Profilingizni ko'rish va buyurtmalaringiz ro'yxatini kuzatish uchun iltimos tizimga kiring.
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
    <div className="w-full lg:w-5/6 ml-auto text-white px-4 py-6 pb-4 lg:pb-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Title */}
        <h2 className="text-3xl font-extrabold mb-8 text-center bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Shaxsiy Kabinet
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* User Info Card */}
          <div className="lg:col-span-1 bg-zinc-900/70 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between h-fit">
            <div>
              {/* Profile Avatar */}
              <div className="text-center mb-6 border-b border-white/5 pb-6">
                <img 
                  src="/avatar/men.png" 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border border-emerald-500/30 mx-auto mb-3 shadow-lg shadow-emerald-500/10" 
                />
                <h3 className="text-xl font-bold tracking-wide">{user?.name}</h3>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {isAdmin ? 'Sartarosh (Admin)' : 'Mijoz'}
                </span>
              </div>

              {/* User Details */}
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
              </div>
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

          {/* Booking History section */}
          <div className="lg:col-span-2 bg-zinc-900/70 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaCalendarCheck size={18} className="text-emerald-400" />
              Sizning buyurtmalaringiz
            </h3>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <svg className="animate-spin h-8 w-8 text-emerald-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-gray-400">Yuklanmoqda...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-12 border border-dashed border-white/5 rounded-2xl text-center text-gray-400 flex flex-col items-center justify-center gap-2">
                <FaInfoCircle size={24} className="text-zinc-600" />
                <p className="text-sm">Sizda hali hech qanday buyurtma mavjud emas.</p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold border-b border-emerald-400/30 hover:border-emerald-300 cursor-pointer"
                >
                  Birinchi buyurtmangizni yarating
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {bookings.map((booking) => (
                  <div
                    key={booking._id || booking.id}
                    className="p-4 bg-zinc-800/40 border border-white/5 hover:border-emerald-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
                  >
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-200">{booking.serviceName}</h4>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaCalendarCheck size={12} className="text-emerald-500/70" />
                          {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock size={12} className="text-emerald-500/70" />
                          {booking.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaDollarSign size={12} className="text-emerald-500/70" />
                          {Number(booking.servicePrice).toLocaleString()} so'm
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end border-t border-white/5 pt-2.5 md:border-none md:pt-0 shrink-0">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
