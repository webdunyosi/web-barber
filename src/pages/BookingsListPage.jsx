import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/features/auth/AuthModal';
import { 
  FaCalendarCheck, 
  FaClock, 
  FaDollarSign, 
  FaInfoCircle, 
  FaLock, 
  FaSignInAlt, 
  FaHistory 
} from 'react-icons/fa';

const BookingsListPage = () => {
  const { token, isAuthenticated, getMyBookings } = useAuth();
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

  return (
    <div className="w-full lg:w-5/6 ml-auto text-white px-4 py-6 pb-4 lg:pb-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Mening Buyurtmalarim
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Siz band qilgan barcha tashriflar ro'yxati va ularning tasdiqlanish holati
          </p>
        </div>

        {isAuthenticated ? (
          <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl animate-fadeIn">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaHistory size={18} className="text-emerald-400 animate-spin-slow" />
              Buyurtmalar Tarixi
            </h3>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="p-4 bg-zinc-800/20 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse"
                  >
                    <div className="space-y-2.5">
                      <div className="h-5 w-40 bg-zinc-700/50 rounded-lg"></div>
                      <div className="flex items-center gap-4">
                        <div className="h-3.5 w-16 bg-zinc-700/30 rounded"></div>
                        <div className="h-3.5 w-12 bg-zinc-700/30 rounded"></div>
                        <div className="h-3.5 w-20 bg-zinc-700/30 rounded"></div>
                      </div>
                    </div>
                    <div className="h-7 w-24 bg-zinc-700/30 rounded-lg mt-2 md:mt-0 shrink-0"></div>
                  </div>
                ))}
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
              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                {bookings.map((booking) => (
                  <div
                    key={booking._id || booking.id}
                    className="p-4 bg-zinc-800/40 border border-white/5 hover:border-emerald-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-200">{booking.serviceName}</h4>
                        {booking.isFree && (
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                            Bepul
                          </span>
                        )}
                      </div>
                      
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
                          {booking.isFree ? '0' : Number(booking.servicePrice).toLocaleString()} so'm
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
        ) : (
          /* Locked Guest View */
          <div className="max-w-md w-full bg-zinc-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mx-auto text-zinc-400">
              <FaLock size={24} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Ruxsat cheklangan</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Buyurtmalaringiz ro'yxatini ko'rish va ularning tasdiqlanish holatini kuzatish uchun profilingizga kiring.
              </p>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-linear-to-br from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-emerald-500/30 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98] border border-emerald-400 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <FaSignInAlt size={16} />
              <span>Tizimga kirish</span>
            </button>
            
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingsListPage;
