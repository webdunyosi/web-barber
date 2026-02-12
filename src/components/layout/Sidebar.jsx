import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isMobileMenuOpen, closeMobileMenu }) => {
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
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        w-64 bg-zinc-900/95 backdrop-blur-lg border-r border-emerald-500/30 min-h-screen 
        fixed left-0 top-0 z-50 md:sticky
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Mobile Menu Header */}
          <div className="md:hidden mb-6 pb-6 border-b border-emerald-500/30">
            <div className="flex items-center gap-3">
              <img className='w-16' src="logo.png" alt="Web Barber Logo" />
              <div>
                <h2 className="text-xl font-bold text-white">Web Barber</h2>
                <p className="text-xs text-emerald-500">Menyu</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
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