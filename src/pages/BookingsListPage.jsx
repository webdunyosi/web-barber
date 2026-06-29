import React, { useState, useEffect, useRef } from 'react';
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
  FaHistory,
  FaCreditCard,
  FaMoneyBillWave,
  FaPaperclip,
  FaComment,
  FaSearch,
  FaPlus,
  FaArrowLeft
} from 'react-icons/fa';

const BookingsListPage = () => {
  const { token, isAuthenticated, getMyBookings } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [isBookingStatusDropdownOpen, setIsBookingStatusDropdownOpen] = useState(false);
  const bookingStatusDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bookingStatusDropdownRef.current && !bookingStatusDropdownRef.current.contains(event.target)) {
        setIsBookingStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    // 1. Status Filter
    if (bookingStatusFilter !== 'all' && booking.status !== bookingStatusFilter) {
      return false;
    }
    // 2. Search Term Filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const serviceNameMatches = booking.serviceName?.toLowerCase().includes(term);
      const dateMatches = booking.date?.toLowerCase().includes(term);
      const timeMatches = booking.time?.toLowerCase().includes(term);
      const priceMatches = String(booking.servicePrice).includes(term);
      
      return serviceNameMatches || dateMatches || timeMatches || priceMatches;
    }
    return true;
  });

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

  return (
    <div className="w-full lg:w-5/6 ml-auto text-white px-0 sm:px-4 pt-0 pb-0 lg:pb-8 h-full sm:h-auto flex flex-col overflow-hidden sm:overflow-visible min-h-0">
      <div className="w-full sm:max-w-3xl mx-auto mt-0 pt-0 space-y-4 sm:space-y-8 flex-1 flex flex-col min-h-0">

        {isAuthenticated ? (
          <div className="w-full bg-zinc-900 border-x-0 border-y border-white/10 sm:border sm:rounded-3xl p-4 sm:p-6 shadow-xl animate-fadeIn flex-1 flex flex-col overflow-hidden min-h-0">

            {/* Filters Panel */}
            <div className="flex flex-row items-center gap-2 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-2.5 backdrop-blur-sm relative z-30 mb-6">
              {/* Back Button */}
              <button
                type="button"
                onClick={() => navigate('/profil')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-850/60 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 active:scale-[0.98] text-zinc-300 hover:text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shrink-0 h-[34px] sm:h-auto"
                title="Profilga qaytish"
              >
                <FaArrowLeft size={11} className="shrink-0" />
                <span className="hidden sm:inline">Profilga qaytish</span>
              </button>

              {/* Search */}
              <div className="flex-1 min-w-0 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-zinc-550">
                  <FaSearch size={11} className="text-zinc-400" />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Qidirish..."
                  className="w-full pl-7 pr-3 py-2 bg-zinc-850/60 border border-zinc-700/50 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent text-[11px] sm:text-xs text-white placeholder-zinc-550 transition-all duration-300"
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

              {/* Yangi Buyurtma button */}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-zinc-950 font-extrabold text-[11px] sm:text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-emerald-500/10 border-none"
              >
                <FaPlus size={11} className="shrink-0" />
                <span className="hidden sm:inline">Yangi buyurtma</span>
                <span className="sm:hidden">Yangi</span>
              </button>
            </div>

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
                  className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold border-b border-emerald-400/30 hover:border-emerald-300 cursor-pointer bg-transparent border-none"
                >
                  Birinchi buyurtmangizni yarating
                </button>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="py-12 border border-dashed border-white/5 rounded-2xl text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
                <FaInfoCircle size={24} className="text-zinc-650 animate-pulse" />
                <p className="text-sm">Hech qanday buyurtma topilmadi.</p>
              </div>
            ) : (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {filteredBookings.map((booking) => {
                  const glowingAccentColor = booking.status === 'pending'
                    ? 'bg-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : booking.status === 'confirmed'
                    ? 'bg-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    : 'bg-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.4)]';

                  return (
                    <div
                      key={booking._id || booking.id}
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
                          {booking.isFree && (
                            <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                              Bepul
                            </span>
                          )}

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
                            {booking.status === 'confirmed' && 'Tasdiqlangan'}
                            {booking.status === 'rejected' && 'Rad etilgan'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-zinc-500 font-medium">
                          <span className="font-bold text-emerald-400">
                            {booking.isFree ? '0' : Number(booking.servicePrice).toLocaleString()} so'm
                          </span>
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
                                <a
                                  href={booking.receipt}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-0.5"
                                >
                                  <FaPaperclip size={10} />
                                  <span>Chekni ko'rish</span>
                                </a>
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Locked Guest View */
          <div className="max-w-md w-full bg-zinc-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl mx-auto text-center space-y-6">
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
