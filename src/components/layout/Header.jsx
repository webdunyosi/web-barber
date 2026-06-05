import React, { useState } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserShield } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from '../features/auth/AuthModal';
import { useStep } from '../../hooks/useStep';

const Header = ({ currentStep, toggleSidebar }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { setCurrentStep } = useStep();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="w-full lg:w-5/6 ml-auto bg-linear-to-r from-zinc-900/95 via-zinc-950/95 to-zinc-900/95 backdrop-blur-lg text-white shadow-md shadow-emerald-500 sticky top-0 z-[60]">
        <div className="container mx-auto pl-4 pr-7 py-0">
          <div className="flex items-center justify-between py-4">
            
            {/* Logo / Back Button */}
            <div className="flex items-center gap-3">
              {location.pathname === '/' && currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 border border-emerald-500/30 hover:border-emerald-500/60 text-white px-3.5 py-2 rounded-xl transition-all active:scale-[0.95] cursor-pointer shadow-md"
                >
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-semibold">Ortga</span>
                </button>
              ) : (
                <div className="flex lg:hidden items-center gap-3">
                  <img className="w-14" src="logo.png" alt="" />
                  <h1 className="text-xl font-bold uppercase text-emerald-500">Web Barber</h1>
                </div>
              )}
            </div>

            {/* Step Indicator - Centered (Hidden on Admin page) */}
            {location.pathname !== '/admin' ? (
              <div className="hidden md:flex items-center gap-3" role="navigation" aria-label="Booking progress">
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <div
                      role="status"
                      aria-current={step === currentStep ? 'step' : undefined}
                      aria-label={`Step ${step}${step < currentStep ? ' completed' : step === currentStep ? ' current' : ' upcoming'}`}
                      className={`group relative w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 backdrop-blur-xl border-2 shadow-lg ${
                        step === currentStep
                          ? 'bg-emerald-500/90 text-white border-emerald-400 shadow-emerald-500/50 scale-110 animate-pulse-glow'
                          : step < currentStep
                          ? 'bg-emerald-400/80 text-white border-emerald-300 shadow-emerald-400/40 hover:scale-105'
                          : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:border-white/30 hover:scale-105'
                      }`}
                    >
                      <span className={`relative z-10 transition-transform duration-300 ${
                        step === currentStep ? 'scale-110' : 'group-hover:scale-110'
                      }`} aria-hidden="true">
                        {step < currentStep ? '✓' : step}
                      </span>
                      {step === currentStep && (
                        <span className="absolute inset-0 rounded-2xl bg-emerald-400/30 animate-ping" aria-hidden="true"></span>
                      )}
                    </div>
                    {step < 4 && (
                      <div className="relative w-12 h-1 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm" aria-hidden="true">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            step < currentStep 
                              ? 'w-full bg-linear-to-r from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-400/50' 
                              : 'w-0 bg-gray-400'
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-4 py-1.5 rounded-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-sm font-extrabold uppercase tracking-wider text-emerald-400">
                  Sartarosh Boshqaruv Markazi
                </span>
              </div>
            )}

            {/* Auth section */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700 rounded-xl px-3 py-1.5 backdrop-blur-sm">
                  {isAdmin ? (
                    <Link to="/admin" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 text-sm font-semibold">
                      <FaUserShield size={16} />
                      <span className="hidden sm:inline">Admin Panel</span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1.5 text-zinc-300 text-sm">
                      <FaUserCircle size={16} className="text-emerald-500" />
                      <span className="max-w-[100px] truncate hidden sm:inline">{user?.name}</span>
                    </div>
                  )}
                  <span className="w-[1px] h-4 bg-zinc-700 hidden sm:inline"></span>
                  <button
                    onClick={logout}
                    className="text-zinc-400 hover:text-red-400 transition-colors flex items-center justify-center p-1 cursor-pointer"
                    title="Chiqish"
                  >
                    <FaSignOutAlt size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-linear-to-br from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-emerald-500/25 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all active:scale-[0.98] border border-emerald-400 flex items-center gap-2 cursor-pointer"
                >
                  <FaSignInAlt size={14} />
                  <span>Kirish</span>
                </button>
              )}

              {/* Burger Menu Icon - Right Side */}
              <button 
                onClick={toggleSidebar}
                className="block md:hidden text-white hover:text-emerald-500 transition-colors duration-300 ml-2"
                aria-label="Menu"
              >
                <HiMenuAlt3 className="w-8 h-8" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Auth Modal for Header */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;