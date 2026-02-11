import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      name: 'Bron qilish',
      icon: '📅',
      description: 'Navbat band qilish'
    },
    {
      path: '/styles',
      name: 'Soch stillari',
      icon: '✂️',
      description: 'Narxlar va rasmlar'
    },
    {
      path: '/videos',
      name: 'Videolar',
      icon: '🎬',
      description: 'Ish jarayonlari'
    },
    {
      path: '/about',
      name: 'Ustoz haqida',
      icon: '👨‍💼',
      description: 'Tajriba va kontaktlar'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 
          border-r border-emerald-500/20 shadow-2xl shadow-emerald-500/10 z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-72
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-emerald-500/20">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="Web Barber" 
                className="w-16 h-16 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
              <div>
                <h2 className="text-xl font-bold text-white uppercase">Web Barber</h2>
                <p className="text-xs text-emerald-400">Professional Sartaroshxona</p>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  group relative flex items-center gap-4 p-4 rounded-xl
                  transition-all duration-300 overflow-hidden
                  ${isActive(item.path)
                    ? 'bg-emerald-500/20 border-l-4 border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'hover:bg-white/5 border-l-4 border-transparent hover:border-emerald-500/50'
                  }
                `}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <div className="flex-1">
                  <p className={`font-semibold ${isActive(item.path) ? 'text-emerald-400' : 'text-white'}`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.description}
                  </p>
                </div>
                {isActive(item.path) && (
                  <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-emerald-500/20">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Ish vaqti</p>
              <p className="text-white font-semibold">Dush - Shan: 09:00 - 19:00</p>
              <p className="text-emerald-400 text-sm mt-2">Yakshanba dam olish</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
