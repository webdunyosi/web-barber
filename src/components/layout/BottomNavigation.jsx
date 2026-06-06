import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaCut, FaUserTie } from 'react-icons/fa';

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4 pt-2">
      <div className="flex justify-around items-center max-w-md mx-auto bg-zinc-900/90 border border-white/10 rounded-2xl p-2.5 backdrop-blur-md shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
        {/* Booking Tab */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all duration-300 ${
              isActive && location.pathname === '/'
                ? 'text-emerald-400 scale-105 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`
          }
        >
          <FaCalendarAlt size={19} />
          <span className="text-[10px] tracking-wide">Buyurtma</span>
        </NavLink>

        {/* Styles Tab */}
        <NavLink
          to="/stillar"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-emerald-400 scale-105 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`
          }
        >
          <FaCut size={19} />
          <span className="text-[10px] tracking-wide">Stillar</span>
        </NavLink>

        {/* Barber Info Tab */}
        <NavLink
          to="/sartarosh"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-emerald-400 scale-105 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`
          }
        >
          <FaUserTie size={19} />
          <span className="text-[10px] tracking-wide">Sartarosh</span>
        </NavLink>

        {/* Profil Tab */}
        <NavLink
          to="/profil"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-emerald-400 scale-105 font-semibold'
                : 'text-gray-400 hover:text-white'
            }`
          }
        >
          <img 
            src="/avatar/men.png" 
            alt="Profile" 
            className={`w-5 h-5 rounded-full object-cover border transition-all ${
              location.pathname === '/profil' ? 'border-emerald-400' : 'border-zinc-700'
            }`} 
          />
          <span className="text-[10px] tracking-wide">Profil</span>
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavigation;
