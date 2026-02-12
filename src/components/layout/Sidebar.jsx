import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    {
      name: 'Buyurtma qilish',
      path: '/',
      icon: '📅',
    },
    {
      name: 'Soch va Soqol Stillari',
      path: '/stillar',
      icon: '✂️',
    },
  ];

  return (
    <aside className="w-64 bg-zinc-900/95 backdrop-blur-lg border-r border-emerald-500/30 min-h-screen sticky top-0">
      <div className="p-6">
        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/50'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="text-2xl" role="img" aria-hidden="true">
                {item.icon}
              </span>
              <span className="font-semibold">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-emerald-500/20">
          <p className="text-xs text-white/50 text-center">
            Professional Sartaroshxona
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;