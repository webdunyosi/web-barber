import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-950 web-pattern">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="lg:ml-72 min-h-screen">
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
