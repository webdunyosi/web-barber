import React from 'react';
import { NavLink } from 'react-router-dom';
import menuItems from '../../data/menu.json';

const Sidebar = ({ isOpen, onClose }) => {

  return (
    <>
      {/* Overlay for mobile - clicking closes sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-auto
        w-64 bg-zinc-900/95 backdrop-blur-lg border-r border-emerald-500/30 min-h-screen
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Only close on mobile/tablet (< 1024px)
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
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
        </div>
      </aside>
    </>
  );
};

export default Sidebar;