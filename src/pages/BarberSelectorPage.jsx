import React from 'react';
import { useBarber } from '../contexts/BarberContext';
import { FaCut, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';

const BarberSelectorPage = () => {
  const { barbersList, selectBarber, loadingBarbers } = useBarber();

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between py-12 px-4 relative web-pattern">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full space-y-12 z-10 my-auto">
        {/* Header Branding */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2 animate-bounce">
            <FaCut size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            WEB BARBER PLATFORMASI
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            O'zingizga ma'qul bo'lgan sartaroshni tanlang va qulay onlayn navbat olish hamda sadoqat kartalaridan foydalanish imkoniyatini qo'lga kiriting.
          </p>
        </div>

        {/* Barbers list */}
        {loadingBarbers ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin"></div>
            <span className="text-xs text-emerald-400 font-extrabold tracking-widest uppercase animate-pulse">Sartaroshlar yuklanmoqda...</span>
          </div>
        ) : barbersList.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm max-w-md mx-auto">
            <span className="text-4xl block mb-3">📭</span>
            <h3 className="text-lg font-bold text-white mb-1">Hozircha sartaroshlar yo'q</h3>
            <p className="text-sm text-zinc-500">Tizimda hech qanday sartarosh ro'yxatdan o'tmagan. Iltimos, keyinroq qayta urunib ko'ring.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {barbersList.map((barber) => (
              <div
                key={barber._id}
                onClick={() => selectBarber(barber)}
                className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 rounded-3xl p-5 backdrop-blur-md shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.02] active:scale-[0.99]"
              >
                {/* Decorative border glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="flex gap-4">
                  <img
                    src={barber.avatar || "/avatar/men.png"}
                    alt={barber.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-zinc-800 group-hover:border-emerald-500/30 transition-colors"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                      {barber.shopName || barber.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 h-8 leading-relaxed">
                      {barber.description || "Ushbu sartarosh shaxsiy salon ma'lumotlarini kiritmagan."}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-2.5">
                      <FaMapMarkerAlt className="text-emerald-500" />
                      <span>Toshkent, O'zbekiston</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-850 mt-5 pt-3.5 flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Faol
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    <span>Kirish</span>
                    <FaChevronRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[10px] text-zinc-600 font-medium z-10 pt-8">
        &copy; {new Date().getFullYear()} Web Barber Platform. Barcha huquqlar himoyalangan.
      </div>
    </div>
  );
};

export default BarberSelectorPage;
