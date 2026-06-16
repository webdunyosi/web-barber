import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaCut, FaUserTie, FaRobot, FaGift, FaCalendarCheck } from 'react-icons/fa';

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden h-[68px] flex items-end">
      {/* Background with Notch */}
      <div className="absolute inset-0 flex items-end h-[68px] -z-10 pointer-events-none">
        <div className="flex-1 h-full bg-zinc-950/95 border-t border-white/10 rounded-tl-2xl"></div>
        <div className="w-[90px] h-[68px] shrink-0 -mx-px">
          <svg className="w-full h-full text-zinc-950/95" viewBox="0 0 90 68" fill="currentColor">
            <path d="M 0 0.5 C 25 0.5, 25 35, 45 35 C 65 35, 65 0.5, 90 0.5 L 90 68 L 0 68 Z" />
            <path d="M 0 0.5 C 25 0.5, 25 35, 45 35 C 65 35, 65 0.5, 90 0.5" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <div className="flex-1 h-full bg-zinc-950/95 border-t border-white/10 rounded-tr-2xl"></div>
      </div>

      {/* Navigation Links */}
      <div className="relative w-full h-full flex items-center justify-between px-2">
        {/* Left Tabs */}
        <div className="flex-1 flex justify-around pr-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all duration-300 ${
                isActive && location.pathname === '/'
                  ? 'text-emerald-400 scale-105 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <FaCalendarAlt size={19} />
            <span className="text-[10px] tracking-wide">Buyurtma</span>
          </NavLink>

          <NavLink
            to="/stillar"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-emerald-400 scale-105 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <FaCut size={19} />
            <span className="text-[10px] tracking-wide">Stillar</span>
          </NavLink>

          <NavLink
            to="/buyurtmalarim"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-emerald-400 scale-105 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <FaCalendarCheck size={19} />
            <span className="text-[10px] tracking-wide">Tashriflar</span>
          </NavLink>
        </div>

        {/* Center notch space with Floating action button */}
        <div className="w-[90px] shrink-0 relative h-full">
          <NavLink
            to="/sartarosh"
            className={({ isActive }) =>
              `absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] border-2 ${
                isActive
                  ? 'bg-emerald-500 text-white border-emerald-400 scale-110 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                  : 'bg-zinc-900 text-emerald-400 border-emerald-500/40 hover:border-emerald-400 hover:bg-zinc-850'
              }`
            }
          >
            <FaUserTie size={22} />
          </NavLink>
        </div>

        {/* Right Tabs */}
        <div className="flex-1 flex justify-around pl-2">
          <NavLink
            to="/loyalty"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-emerald-400 scale-105 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <FaGift size={19} />
            <span className="text-[10px] tracking-wide">Karta</span>
          </NavLink>

          <NavLink
            to="/ai-chat"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-emerald-400 scale-105 font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <FaRobot size={19} />
            <span className="text-[10px] tracking-wide">AI bot</span>
          </NavLink>

          <NavLink
            to="/profil"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all duration-300 ${
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
    </div>
  );
};

export default BottomNavigation;
