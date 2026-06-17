import React, { useState } from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import BottomNavigation from '../components/layout/BottomNavigation';
import { useStep } from '../hooks/useStep';
import { useAuth } from '../hooks/useAuth';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentStep } = useStep();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (!loading && isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 web-pattern">
      {/* Header */}
      <Header currentStep={currentStep} toggleSidebar={toggleSidebar} />
      
      {/* Main Content with Sidebar */}
      <div className="flex relative">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        
        {/* Page Content */}
        <main className={`flex-1 container mx-auto lg:pb-8 ${
          location.pathname === '/ai-chat' 
            ? 'px-0 pt-0 pb-[68px]' 
            : location.pathname === '/bildirishnomalar'
            ? 'px-2 pt-1.5 md:pt-6 pb-[80px]'
            : 'px-4 pt-3 md:pt-8 pb-[80px]'
        }`}>
          <Outlet />
        </main>
      </div>
      
      {/* Floating AI Bot Button */}
      {location.pathname !== '/ai-chat' && (
        <Link
          to="/ai-chat"
          className="fixed bottom-[84px] md:bottom-6 right-4 md:right-6 z-40 flex items-center justify-center group cursor-pointer"
        >
          {/* Glowing background pulse */}
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-40 group-hover:opacity-75 group-hover:scale-110 transition-all duration-300 animate-pulse"></div>
          
          {/* Main button container */}
          <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white w-14 h-14 rounded-full flex items-center justify-center border border-emerald-400 shadow-[0_8px_30px_rgba(16,185,129,0.3)] group-hover:shadow-[0_8px_30px_rgba(16,185,129,0.5)] group-hover:scale-105 active:scale-95 transition-all duration-300">
            {/* Robot Icon */}
            <FaRobot size={22} className="relative z-10 transition-transform duration-500 group-hover:rotate-12" />
            
            {/* Indicator Notification Ping */}
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-zinc-950"></span>
            </span>
          </div>

          {/* Mini bubble tool-tip showing "AI Yordamchi" (visible on hover) */}
          <div className="absolute right-16 bg-zinc-950/90 border border-emerald-500/30 text-white text-[11px] font-semibold py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none whitespace-nowrap backdrop-blur-md">
            AI Yordamchi 💬
          </div>
        </Link>
      )}

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;