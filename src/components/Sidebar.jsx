import React from 'react';

const Sidebar = () => {
  const menuItems = [
    { icon: '🏠', label: 'Bosh sahifa', href: '#home' },
    { icon: '💈', label: 'Xizmatlar', href: '#services' },
    { icon: '📅', label: 'Bron qilish', href: '#booking' },
    { icon: '💼', label: 'Ustalar', href: '#barbers' },
    { icon: '📞', label: 'Aloqa', href: '#contact' },
  ];

  return (
    <aside className="w-64 bg-zinc-900/95 backdrop-blur-lg border-r border-zinc-800 shadow-lg sticky top-0 h-screen overflow-y-auto">
      <div className="p-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-800">
          <img className='w-16 h-16 rounded-lg' src="/logo.png" alt="Web Barber Logo" />
          <div>
            <h2 className="text-lg font-bold text-white">Web Barber</h2>
            <p className="text-xs text-emerald-500">Professional</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-zinc-800/80 transition-all duration-300 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-zinc-800">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <p className="text-xs text-emerald-400 font-semibold mb-2">Ish vaqti</p>
            <p className="text-white/70 text-sm">Du-Sh: 09:00 - 20:00</p>
            <p className="text-white/50 text-xs mt-1">Yakshanba dam olish</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
