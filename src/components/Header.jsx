import React from 'react';

const Header = ({ currentStep }) => {
  return (
    <header className="bg-linear-to-r from-zinc-900/95 via-zinc-950/95 to-zinc-900/95 backdrop-blur-lg text-white shadow-md shadow-emerald-500 sticky top-0 z-40">
      <div className="container mx-auto pl-4 pr-7 py-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className='w-20' src="logo.png" alt="" />
            <div>
              <h1 className="text-2xl font-bold uppercase">Web Barber</h1>
              <p className="text-sm text-emerald-500">Professional Sartaroshxona</p>
            </div>
          </div>
          {/* Step Indicator */}
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
        </div>
      </div>
    </header>
  );
};

export default Header;