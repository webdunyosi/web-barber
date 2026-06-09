import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
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
            : 'px-4 pt-3 md:pt-8 pb-24'
        }`}>
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;