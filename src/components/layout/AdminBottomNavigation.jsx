import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaCalendarCheck, FaUsers, FaUser } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const AdminBottomNavigation = () => {
  const location = useLocation();
  const { getBookings } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'statistics';

  const fetchPendingCount = async () => {
    try {
      const bookings = await getBookings();
      if (Array.isArray(bookings)) {
        const pending = bookings.filter(b => b.status === 'pending').length;
        setPendingCount(pending);
      }
    } catch (error) {
      console.error('Error fetching bookings count:', error);
    }
  };

  useEffect(() => {
    fetchPendingCount();
    // Poll every 30 seconds to update count
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden h-[68px] flex items-end">
      {/* Background with Notch */}
      <div className="absolute inset-0 flex items-end h-[68px] -z-10 pointer-events-none">
        <div className="flex-1 h-full bg-zinc-950/95 border-t border-white/10 rounded-tl-2xl"></div>
        <div className="w-[90px] h-[68px] shrink-0">
          <svg className="w-full h-full text-zinc-950/95" viewBox="0 0 90 68" fill="currentColor">
            <path d="M 0 0.5 C 25 0.5, 25 35, 45 35 C 65 35, 65 0.5, 90 0.5 L 90 68 L 0 68 Z" />
            <path d="M 0 0.5 C 25 0.5, 25 35, 45 35 C 65 35, 65 0.5, 90 0.5" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <div className="flex-1 h-full bg-zinc-950/95 border-t border-white/10 rounded-tr-2xl"></div>
      </div>

      {/* Navigation Links */}
      <div className="relative w-full h-full flex items-center justify-between px-4">
        {/* Left Tab - Statistics */}
        <div className="flex-1 flex justify-center">
          <Link
            to="/admin?tab=statistics"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-4 rounded-xl transition-all duration-300 ${
              currentTab === 'statistics'
                ? 'text-emerald-400 scale-105 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FaChartBar size={19} />
            <span className="text-[10px] tracking-wide">Statistika</span>
          </Link>
        </div>

        {/* Center notch space with Floating action button (Bookings) */}
        <div className="w-[90px] shrink-0 relative h-full">
          <Link
            to="/admin?tab=bookings"
            className={`absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] border-2 ${
              currentTab === 'bookings'
                ? 'bg-emerald-500 text-white border-emerald-400 scale-110 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                : 'bg-zinc-900 text-emerald-400 border-emerald-500/40 hover:border-emerald-400 hover:bg-zinc-850'
            }`}
          >
            <FaCalendarCheck size={22} />
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-zinc-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-zinc-950 animate-pulse">
                {pendingCount}
              </span>
            )}
          </Link>
        </div>

        {/* Right Tab - Users & Profile */}
        <div className="flex-1 flex justify-around pl-2">
          <Link
            to="/admin?tab=users"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all duration-300 ${
              currentTab === 'users'
                ? 'text-emerald-400 scale-105 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FaUsers size={19} />
            <span className="text-[10px] tracking-wide">Mijozlar</span>
          </Link>

          <Link
            to="/admin?tab=profile"
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all duration-300 ${
              currentTab === 'profile'
                ? 'text-emerald-400 scale-105 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FaUser size={19} />
            <span className="text-[10px] tracking-wide">Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminBottomNavigation;
