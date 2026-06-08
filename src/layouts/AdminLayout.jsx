import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaUserShield, FaSignOutAlt, FaHome, FaChartBar, FaCalendarCheck, FaUsers, FaUser } from 'react-icons/fa';
import AdminBottomNavigation from '../components/layout/AdminBottomNavigation';

const AdminLayout = () => {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin"></div>
          <span className="text-lg font-semibold animate-pulse">Admin Panel yuklanmoqda...</span>
        </div>
      </div>
    );
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
              to="/admin?tab=statistics"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm ${
                location.pathname === '/admin' && (new URLSearchParams(location.search).get('tab') || 'statistics') === 'statistics'
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
