import React, { useState } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Menu Button - Fixed on the right side */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <IoClose className="w-6 h-6" />
        ) : (
          <HiMenuAlt3 className="w-6 h-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-emerald-500/30 shadow-2xl shadow-emerald-500/20 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
      >
        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* Center Content with "1234" */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-6xl font-bold text-emerald-500 tracking-wider animate-pulse-glow">
                1234
              </h2>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
