import React, { useState, useEffect, useRef } from 'react';
import { getBookedTimes, getBlockedDaysApi } from '../../../utils/api';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const TimeSelection = ({ timeSlots, selectedDate, selectedTime, onSelectDate, onSelectTime }) => {
  const [bookedTimes, setBookedTimes] = useState([]);
  const [blockedDays, setBlockedDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Kalendar uchun state'lar
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentViewDate, setCurrentViewDate] = useState(selectedDate || new Date());
  
  const calendarRef = useRef(null);

  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  const daysOfWeek = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']; // Dushanbadan boshlanadi

  // Fetch blocked days from backend
  useEffect(() => {
    const fetchBlockedDays = async () => {
      try {
        const days = await getBlockedDaysApi();
        setBlockedDays(days || []);
      } catch (err) {
        console.error('Error fetching blocked days:', err);
      }
    };
    fetchBlockedDays();
  }, []);

  // YANGI QO'SHILGAN QISM: Boshlang'ich holatda bugungi sanani tanlab qo'yish
  useEffect(() => {
    if (!selectedDate) {
      onSelectDate(new Date());
    }
  }, []); // Bo'sh array - faqat sahifa ochilganda 1 marta ishlaydi

  // Tashqariga bosilganda kalendarni yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Backenddan band vaqtlarni tekshirib olish
  useEffect(() => {
    if (selectedDate) {
      const fetchTimes = async () => {
        setIsLoading(true);
        try {
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

  // Kalendar oynasi uchun kunlarni hisoblash
  const getCalendarDays = () => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Oydagi birinchi kun qaysi haftasiga to'g'ri kelishini topish (Dushanba = 0)
    let firstDayIndex = new Date(year, month, 1).getDay() - 1;
    if (firstDayIndex === -1) firstDayIndex = 6; // Yakshanba

    const days = [];
    // Bo'sh kataklar
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Oydagi kunlar
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (date) => {
    onSelectDate(date);
    onSelectTime(null); // Sana o'zgarganda vaqtni tozalaymiz
    setIsCalendarOpen(false); // Kalendarni yopamiz
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // O'tib ketgan kunlarni tanlab bo'lmaydi
    if (date < today) return true;

    // Sartarosh tomonidan blocklangan kunlarni tekshirish
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    return blockedDays.includes(formattedDate);
  };

  // Tanlangan sanani formatlash (tugmada ko'rsatish uchun)
  const formatSelectedDate = () => {
    if (!selectedDate) return "Sanani tanlang";
    return `${selectedDate.getDate()}-${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}-yil`;
  };

  const isTodaySelected = selectedDate && selectedDate.toDateString() === new Date().toDateString();
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const availableTimeSlots = timeSlots.filter((time) => {
    if (!isTodaySelected) return true;
    const [slotHour, slotMinute] = time.split(':').map(Number);
    return slotHour > currentHour || (slotHour === currentHour && slotMinute > currentMinute);
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-0 mt-4 md:mt-0">
      
      {/* 1. SANA TANLASH QISMI (Dropdown Calendar) */}
      <div className="mb-8 relative z-50" ref={calendarRef}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0">
            <FaCalendarAlt className="text-lg" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Sanani tanlang</h3>
        </div>
        
        {/* Toggle Button or Skeleton Loader */}
        {isLoading ? (
          <div className="w-full md:w-96 h-[58px] rounded-xl bg-zinc-800/30 border border-zinc-700/20 animate-pulse flex items-center justify-between px-4">
            <div className="w-32 h-5 bg-zinc-700/40 rounded"></div>
            <div className="w-5 h-5 bg-zinc-700/40 rounded-full"></div>
          </div>
        ) : (
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className={`w-full md:w-96 flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
              isCalendarOpen || selectedDate
                ? 'bg-zinc-800/90 border-emerald-500 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:border-emerald-500/50'
            }`}
          >
            <span className={`font-medium ${selectedDate ? 'text-white' : 'text-gray-400'}`}>
              {formatSelectedDate()}
            </span>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isCalendarOpen ? 'rotate-180' : ''}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {/* Calendar Popup */}
        {!isLoading && isCalendarOpen && (
          <div className="absolute top-full mt-2 w-full md:w-96 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl p-5 animate-fade-in-up backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h4 className="text-lg font-semibold text-white">
                {months[currentViewDate.getMonth()]} {currentViewDate.getFullYear()}
              </h4>
              <button onClick={handleNextMonth} className="p-2 hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-xs font-medium text-emerald-500/70 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {getCalendarDays().map((date, index) => {
                if (!date) return <div key={`empty-${index}`} className="h-10"></div>; // Bo'sh joylar

                const isDisabled = isDateDisabled(date);
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={index}
                    disabled={isDisabled}
                    onClick={() => handleDateSelect(date)}
                    className={`
                      h-10 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                      ${isDisabled ? 'text-zinc-600 cursor-not-allowed opacity-50' : 'hover:bg-emerald-500/20 hover:text-emerald-400'}
                      ${isSelected ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/40 hover:bg-emerald-400 hover:text-white' : ''}
                      ${isToday && !isSelected ? 'border border-emerald-500/50 text-emerald-400' : ''}
                      ${!isDisabled && !isSelected && !isToday ? 'text-gray-300' : ''}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. VAQT TANLASH QISMI */}
      {selectedDate && (
        <div className="animate-fade-in-up mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0">
              <FaClock className="text-lg" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Vaqtni tanlang</h3>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-pulse">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[46px] rounded-xl bg-zinc-800/30 border border-zinc-700/20 flex items-center justify-center"
                >
                  <div className="w-12 h-4 bg-zinc-700/40 rounded"></div>
                </div>
              ))}
            </div>
          ) : availableTimeSlots.length === 0 ? (
            <div className="w-full py-8 text-center text-zinc-300 font-medium border border-dashed border-zinc-800/80 rounded-2xl bg-zinc-900/30 px-4">
              Bugun uchun barcha ish soatlari o'tib ketgan. Iltimos, boshqa kunni tanlang.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableTimeSlots.map((time) => {
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