import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, currentStep }) => {
  return (
    <div className="flex min-h-screen bg-zinc-950 web-pattern">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header currentStep={currentStep} />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
