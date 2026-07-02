import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaCalendarCheck, FaUser, FaTachometerAlt, FaCut, FaLock } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const AdminBottomNavigation = () => {
  const location = useLocation();
  const { getBookings, user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'dashboard';

  const isSubscriptionExpired = user?.role === 'admin' && (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) < new Date());

  const renderTabLink = (tabName, label, icon) => {
    const isLocked = isSubscriptionExpired && tabName !== 'profile';
    const isActive = currentTab === tabName;

    if (isLocked) {
      return (
        <button
          key={tabName}
          onClick={() => toast.error("Obuna muddati tugaganligi sababli ushbu bo'lim bloklangan. Iltimos, obunani faollashtiring.")}
          className="flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl transition-all duration-300 text-zinc-650 cursor-not-allowed border-none bg-transparent"
        >
          <div className="relative">
            {icon}
            <FaLock size={8} className="absolute -top-1 -right-1 text-red-500 bg-zinc-950 rounded-full" />
          </div>
          <span className="text-[9.5px] min-[360px]:text-[10px] tracking-tight font-medium text-zinc-600">{label}</span>
        </button>
      );
    }

    return (
      <Link
        key={tabName}
        to={`/admin?tab=${tabName}`}
        className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl transition-all duration-300 ${
          isActive
            ? 'text-emerald-400 scale-105 font-semibold'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        {icon}
        <span className="text-[9.5px] min-[360px]:text-[10px] tracking-tight font-medium">{label}</span>
      </Link>
    );
  };

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
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden h-[68px] flex items-end admin-bottom-nav">
      {/* Background with Notch */}
      <div className="absolute inset-0 flex items-end h-[68px] -z-10 pointer-events-none">
        <div className="flex-1 h-full bg-zinc-950/95 border-t border-white/10 rounded-tl-2xl"></div>
        <div className="w-[64px] h-[68px] shrink-0 -mx-px">
          <svg className="w-full h-full text-zinc-950/95" viewBox="0 0 64 68" fill="currentColor">
            <path d="M 0 0.5 C 18 0.5, 18 35, 32 35 C 46 35, 46 0.5, 64 0.5 L 64 68 L 0 68 Z" />
            <path d="M 0 0.5 C 18 0.5, 18 35, 32 35 C 46 35, 46 0.5, 64 0.5" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <div className="flex-1 h-full bg-zinc-950/95 border-t border-white/10 rounded-tr-2xl"></div>
      </div>

      {/* Navigation Links */}
      <div className="relative w-full h-full flex items-center justify-between px-1">
        {/* Left Tabs */}
        <div className="flex-1 flex justify-around pr-0">
          {renderTabLink('dashboard', 'Boshqaruv', <FaTachometerAlt size={19} />)}
          {renderTabLink('statistics', 'Statistika', <FaChartBar size={19} />)}
        </div>

        {/* Center notch space with Floating action button (Bookings) */}
        <div className="w-[64px] shrink-0 relative h-full">
          {isSubscriptionExpired ? (
            <button
              onClick={() => toast.error("Obuna muddati tugaganligi sababli ushbu bo'lim bloklangan. Iltimos, obunani faollashtiring.")}
              className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed border-2"
            >
              <div className="relative">
                <FaCalendarCheck size={22} />
                <FaLock size={10} className="absolute -top-1 -right-1 text-red-500 bg-zinc-950 rounded-full" />
              </div>
            </button>
          ) : (
            <Link
              to="/admin?tab=bookings"
              className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] border-2 ${
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
          )}
        </div>

        {/* Right Tabs */}
        <div className="flex-1 flex justify-around pl-0">
          {renderTabLink('services', 'Xizmatlar', <FaCut size={19} />)}
          {renderTabLink('profile', 'Profil', <FaUser size={19} />)}
        </div>
      </div>
    </div>
  );
};

export default AdminBottomNavigation;
