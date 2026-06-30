import React, { useState } from 'react';
import { useBarber } from '../contexts/BarberContext';
import { FaCut, FaChevronRight, FaSignInAlt } from 'react-icons/fa';
import AuthModal from '../components/features/auth/AuthModal';

const BarberSelectorPage = () => {
  const { loadBarberBySlug } = useBarber();
  const [slugInput, setSlugInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slugInput.trim()) {
      setError('Sartarosh kodini kiriting');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await loadBarberBySlug(slugInput.trim().toLowerCase());
    } catch (err) {
      console.error(err);
      setError('Sartarosh topilmadi. Kodni qaytadan tekshirib ko\'ring.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between py-12 px-4 relative web-pattern font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md mx-auto w-full space-y-8 z-10 my-auto">
        {/* Header Branding */}
        <div className="text-center space-y-4 animate-fadeIn">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2 animate-bounce">
            <FaCut size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            WEB BARBER
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            Sartaroshxonangiz sahifasiga kirish uchun sartarosh tomonidan berilgan maxsus kodni kiriting.
          </p>
        </div>

        {/* Access Form Card */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6 relative overflow-hidden animate-slideUp">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm text-center font-medium animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group flex flex-col">
              <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-2 pl-1">
                Sartarosh Kodi (Login / Username)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300">
                  <FaCut size={14} />
                </span>
                <input
                  type="text"
                  value={slugInput}
                  onChange={(e) => {
                    setSlugInput(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="masalan: behruz"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 placeholder:text-white/20 text-sm hover:bg-white/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer disabled:bg-zinc-800 disabled:text-white/20 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-emerald-400/30 text-sm tracking-wide uppercase"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                  <span>Yuklanmoqda...</span>
                </>
              ) : (
                <>
                  <span>Davom etish</span>
                  <FaChevronRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-white/5 pt-4 text-center">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <FaSignInAlt size={12} />
              <span>Sartarosh & Admin kirishi</span>
            </button>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Footer copyright */}
      <div className="text-center text-[10px] text-zinc-600 font-medium z-10 pt-8">
        &copy; {new Date().getFullYear()} Web Barber Platform. Barcha huquqlar himoyalangan.
      </div>
    </div>
  );
};

export default BarberSelectorPage;
