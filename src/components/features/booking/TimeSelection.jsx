import React, { useState, useEffect } from 'react';
import { getBookedTimes } from '../../../utils/api';

const TimeSelection = ({ timeSlots, selectedDate, selectedTime, onSelectDate, onSelectTime }) => {
  const [bookedTimes, setBookedTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Bugungi va keyingi 7 kunni yaratish
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

  useEffect(() => {
    if (selectedDate) {
      const fetchTimes = async () => {
        setIsLoading(true);
        try {
          // Tanlangan sanani "DD.MM.YYYY" formatiga o'tkazish
          const day = selectedDate.getDate().toString().padStart(2, '0');
          const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
          const year = selectedDate.getFullYear();
          const formattedDate = `${day}.${month}.${year}`;

          const times = await getBookedTimes(formattedDate);
          setBookedTimes(times);
        } catch (error) {
          console.error("Vaqtlarni yuklashda xatolik:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTimes();
    }
  }, [selectedDate]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      
      {/* 1. SANA TANLASH QISMI */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📅</span>
          Sanani tanlang
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-emerald-500/30 scrollbar-track-transparent">
          {dates.map((date, index) => {
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            return (
              <button
                key={index}
                onClick={() => {
                  onSelectDate(date);
                  onSelectTime(null); // Sana o'zgarganda vaqtni tozalash
                }}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? 'bg-linear-to-br from-emerald-500 via-emerald-600 to-green-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30 scale-105'
                    : 'bg-zinc-800/80 border-zinc-700/50 text-gray-400 hover:border-emerald-500/50 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span className={`text-sm font-medium mb-1 ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                  {days[date.getDay()]}
                </span>
                <span className="text-2xl font-bold mb-1">
                  {date.getDate()}
                </span>
                <span className={`text-xs font-medium ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                  {months[date.getMonth()]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. VAQT TANLASH QISMI */}
      {selectedDate && (
        <div className="animate-fade-in-up">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            Vaqtni tanlang
          </h3>
          
          {isLoading ? (
            <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Vaqtlar tekshirilmoqda...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((time) => {
                const isBooked = bookedTimes.includes(time);
                const isSelected = selectedTime === time;
                
                return (
                  <button
                    key={time}
                    disabled={isBooked}
                    onClick={() => onSelectTime(time)}
                    className={`
                      relative py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden
                      ${
                        isSelected
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400 scale-105'
                          : isBooked
                          ? 'bg-zinc-900/50 text-zinc-600 border border-zinc-800/50 cursor-not-allowed'
                          : 'bg-zinc-800/80 text-gray-300 border border-zinc-700/50 hover:border-emerald-500/50 hover:bg-zinc-800 hover:text-white hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {isBooked && (
                       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-50"></div>
                    )}
                    <span className="relative z-10">{time}</span>
                    {isBooked && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] uppercase text-zinc-500 font-bold z-10">Band</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSelection;