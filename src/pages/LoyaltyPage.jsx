import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoyaltyCard from '../components/features/loyalty/LoyaltyCard';
import AuthModal from '../components/features/auth/AuthModal';
import { FaInfoCircle, FaLock, FaSignInAlt, FaAward, FaQuestionCircle } from 'react-icons/fa';

const LoyaltyPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const stampsCount = user?.loyaltyStamps || 0;
  const remaining = 9 - stampsCount;

  return (
    <div className="w-full lg:w-5/6 ml-auto text-white px-4 py-6 pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Sadoqat Kartasi
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Har bir xizmatimizdan foydalanganingizda ball yig'ing va bepul sovg'aga ega bo'ling!
          </p>
        </div>

        {isAuthenticated ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Loyalty Card component */}
            <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-center">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2 self-start">
                <FaAward size={18} className="text-emerald-400" />
                Sizning Sadoqat Kartangiz
              </h3>
              <LoyaltyCard stampsCount={stampsCount} />
              
              {/* Status Message */}
              <div className="mt-6 text-center space-y-1">
                {stampsCount === 9 ? (
                  <p className="text-emerald-400 font-bold text-sm sm:text-base animate-pulse">
                    Tabriklaymiz! Keyingi 10-tashrifingiz mutlaqo BEPUL! 🎁
                  </p>
                ) : (
                  <p className="text-zinc-300 text-sm">
                    Yana <span className="text-emerald-400 font-bold text-base">{remaining} ta</span> tasdiqlangan tashrifdan so'ng 10-si bepul bo'ladi.
                  </p>
                )}
              </div>
            </div>

            {/* Loyalty Info & Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* How it works */}
              <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-sm sm:text-base flex items-center gap-2 text-emerald-400">
                  <FaQuestionCircle size={16} />
                  Dastur qoidalari
                </h4>
                <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4 leading-relaxed">
                  <li>Har safar sayt orqali joy band qilganingizda va tashrif tasdiqlanganda 1 ball olasiz.</li>
                  <li>Sartarosh joyida yoki karta orqali to'lovni qabul qilib, buyurtmani tasdiqlashi shart.</li>
                  <li>Loyalty ballari 9 taga yetganda, keyingi (10-chi) buyurtma bepul taqdim etiladi.</li>
                  <li>10-bepul xizmat yakunlangach, ballar 0 ga qaytadi va yangi sikl boshlanadi.</li>
                </ul>
              </div>

              {/* Rules and Notice */}
              <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-sm sm:text-base flex items-center gap-2 text-emerald-400">
                  <FaInfoCircle size={16} />
                  Eslatmalar
                </h4>
                <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4 leading-relaxed">
                  <li>Bepul tashrif doirasida faqat tanlangan soch/soqol xizmati narxi chegirib tashlanadi.</li>
                  <li>Agar bepul buyurtmangiz rad etilsa yoki bekor qilinsa, 9 ta ballingiz hisobingizga qaytadi.</li>
                  <li>Ballarni boshqa shaxslarga o'tkazish yoki naqd pulga almashtirish imkoniyati yo'q.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* Locked Guest View */
          <div className="max-w-md w-full bg-zinc-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mx-auto text-zinc-400">
              <FaLock size={24} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Karta qulflangan</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sadoqat kartangizni ko'rish, ballaringizni kuzatish va bepul tashriflarga ega bo'lish uchun profilingizga kiring.
              </p>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-linear-to-br from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-emerald-500/30 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98] border border-emerald-400 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <FaSignInAlt size={16} />
              <span>Tizimga kirish</span>
            </button>
            
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          </div>
        )}

      </div>
    </div>
  );
};

export default LoyaltyPage;
