import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaUserShield, FaSignOutAlt, FaHome, FaChartBar, FaCalendarCheck, FaUsers, FaUser, FaTachometerAlt } from 'react-icons/fa';
import AdminBottomNavigation from '../components/layout/AdminBottomNavigation';

const LayoutSkeleton = () => (
  <div className="min-h-screen bg-zinc-950 text-white flex flex-col lg:flex-row web-pattern animate-pulse">
    {/* Admin Sidebar Skeleton */}
    <aside className="hidden lg:flex w-full lg:w-64 bg-zinc-900/90 border-r border-emerald-500/20 flex-col justify-between shrink-0 p-4">
      <div>
        {/* Logo placeholder */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 w-24 bg-zinc-800 rounded"></div>
            <div className="h-3 w-16 bg-zinc-800 rounded"></div>
          </div>
        </div>

        {/* Nav Items placeholders */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/40">
              <div className="w-5 h-5 bg-zinc-800 rounded"></div>
              <div className="h-4 w-28 bg-zinc-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer details placeholder */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800"></div>
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-20 bg-zinc-800 rounded"></div>
            <div className="h-3 w-12 bg-zinc-800 rounded"></div>
          </div>
        </div>
        <div className="w-full h-9 bg-zinc-800/50 rounded-xl"></div>
      </div>
    </aside>

    {/* Main Content Area Skeleton */}
    <main className="flex-1 min-w-0 p-4 md:p-8 pb-24 lg:pb-8 space-y-8">
      {/* Title Header */}
      <div className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-zinc-800 rounded"></div>
          <div className="h-4 w-80 bg-zinc-800 rounded"></div>
        </div>
        <div className="h-10 w-24 bg-zinc-800 rounded-xl"></div>
      </div>

      {/* Grid Cards placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-6 flex items-center justify-between">
            <div className="space-y-3 flex-1 pr-4">
              <div className="h-3.5 w-1/2 bg-zinc-800 rounded"></div>
              <div className="h-7 w-3/4 bg-zinc-800 rounded"></div>
              <div className="h-2.5 w-2/3 bg-zinc-800 rounded"></div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-zinc-800/80 shrink-0"></div>
          </div>
        ))}
      </div>

      {/* Two columns placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-6 space-y-4">
          <div className="h-5 w-1/3 bg-zinc-800 rounded"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-zinc-950/20 border border-zinc-800/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                  <div className="h-3.5 w-32 bg-zinc-800 rounded"></div>
                </div>
                <div className="h-8 w-20 bg-zinc-800 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-6 space-y-4">
          <div className="h-5 w-1/2 bg-zinc-800 rounded"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between pb-2 border-b border-white/5">
                <div className="h-4 w-20 bg-zinc-800 rounded"></div>
                <div className="h-4 w-10 bg-zinc-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>

    {/* Bottom Nav Skeleton for mobile */}
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-900/90 border-t border-white/10 flex items-center justify-around px-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div className="w-5 h-5 bg-zinc-800 rounded"></div>
          <div className="h-2.5 w-10 bg-zinc-800 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const AdminLayout = () => {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <LayoutSkeleton />;
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <div className="max-w-md w-full text-center bg-zinc-900 border border-red-500/30 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/25 mx-auto mb-6 text-red-500 text-4xl">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Kirish taqiqlangan</h2>
          <p className="text-gray-400 mb-6 font-medium text-sm">Ushbu sahifa faqatgina sartarosh / administratorlar uchun mo'ljallangan.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col lg:flex-row web-pattern">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex w-full lg:w-64 bg-zinc-900/90 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-emerald-500/30 flex-col justify-between shrink-0">
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <img className="w-12 h-12 object-contain" src="/logo.png" alt="Logo" />
            <div>
              <h1 className="text-lg font-extrabold uppercase tracking-wider text-emerald-400">Web Barber</h1>
              <span className="text-xxs font-bold text-emerald-500/80 uppercase">Boshqaruv Paneli</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            <Link
              to="/admin?tab=dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm ${
                location.pathname === '/admin' && (new URLSearchParams(location.search).get('tab') || 'dashboard') === 'dashboard'
                  ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaTachometerAlt size={18} />
              <span>Boshqaruv Paneli</span>
            </Link>

            <Link
              to="/admin?tab=statistics"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm ${
                location.pathname === '/admin' && new URLSearchParams(location.search).get('tab') === 'statistics'
                  ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaChartBar size={18} />
              <span>Moliya & Statistika</span>
            </Link>

            <Link
              to="/admin?tab=bookings"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm ${
                location.pathname === '/admin' && new URLSearchParams(location.search).get('tab') === 'bookings'
                  ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaCalendarCheck size={18} />
              <span>Buyurtmalar & To'lovlar</span>
            </Link>

            <Link
              to="/admin?tab=users"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm ${
                location.pathname === '/admin' && new URLSearchParams(location.search).get('tab') === 'users'
                  ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaUsers size={18} />
              <span>Mijozlar Boshqaruvi</span>
            </Link>

            <Link
              to="/admin?tab=profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm ${
                location.pathname === '/admin' && new URLSearchParams(location.search).get('tab') === 'profile'
                  ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaUser size={18} />
              <span>Profil Boshqaruvi</span>
            </Link>
          </nav>
        </div>

        {/* Admin Footer details */}
        <div className="p-4 border-t border-white/10 bg-zinc-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold uppercase">
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-xs text-zinc-500 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-red-400 text-sm font-semibold py-2 px-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            <FaSignOutAlt size={14} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Dashboard Workspace */}
      <main className="flex-1 min-w-0 p-4 md:p-8 pb-24 lg:pb-8 overflow-y-auto">
        <Outlet />
      </main>

      <AdminBottomNavigation />
    </div>
  );
};

export default AdminLayout;
