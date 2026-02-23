import React from 'react';

const Header = ({ currentStep, toggleSidebar }) => {
  return (
    <header className="w-full lg:w-5/6 ml-auto bg-linear-to-r from-zinc-900/95 via-zinc-950/95 to-zinc-900/95 backdrop-blur-lg text-white shadow-md shadow-emerald-500 sticky top-0 z-40">
      <div className="container mx-auto pl-4 pr-7 py-0">
        <div className="flex items-center justify-between lg:justify-end py-4">
          {/* Logo */}
          <div className="flex lg:hidden items-center gap-3">
            <img className="w-14" src="logo.png" alt="" />
            <h1 className="text-xl font-bold uppercase text-emerald-500">Web Barber</h1>
          </div>

          {/* Step Indicator - Centered */}
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
          
          {/* Burger Menu Icon - Right Side */}
          <button 
            onClick={toggleSidebar}
            className="block md:hidden text-white hover:text-emerald-500 transition-colors duration-300"
            aria-label="Menu"
          >
            <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;