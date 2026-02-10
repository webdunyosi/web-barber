import React, { useState } from 'react';

const TimeSelection = ({ timeSlots, selectedDate, selectedTime, onSelectDate, onSelectTime }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }
    
    return days;
  };

  const days = generateCalendarDays();
  const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];
  const dayNames = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Exclude Sundays (day 0) - shop is closed and past dates
    return date >= today && date.getDay() !== 0;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    return formatDate(date1) === formatDate(date2);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const today = new Date();
    const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prevMonthDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prevMonthDate);
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Calendar */}
      <div className="bg-zinc-800/70 border border-green-500/50 rounded-xl p-8 mb-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="group p-3 rounded-lg bg-zinc-700/50 hover:bg-emerald-500/20 transition-all duration-300 text-white hover:scale-110 active:scale-95 border border-zinc-600 hover:border-emerald-500/50 backdrop-blur-sm"
          >
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-xl font-semibold text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={nextMonth}
            className="group p-3 rounded-lg bg-zinc-700/50 hover:bg-emerald-500/20 transition-all duration-300 text-white hover:scale-110 active:scale-95 border border-zinc-600 hover:border-emerald-500/50 backdrop-blur-sm"
          >
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-semibold text-gray-300 py-2">
              {day}
            </div>
          ))}
          
          {days.map((date, index) => {
            const available = isDateAvailable(date);
            const selected = isSameDate(date, selectedDate);
            
            return (
              <div key={index} className="aspect-square">
                {date && (
                  <button
                    onClick={() => available && onSelectDate(date)}
                    disabled={!available}
                    className={`w-full h-full rounded-lg font-medium transition-all duration-300 backdrop-blur-sm ${
                      selected
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 scale-105'
                        : available
                        ? 'bg-gray-700 text-white hover:bg-emerald-500/30 hover:text-green-300 hover:scale-105 hover:shadow-md border border-transparent hover:border-emerald-500/50'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="bg-zinc-800/70 border border-green-500/50 rounded-xl p-8 backdrop-blur-md">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Vaqtni tanlang ({formatDate(selectedDate)})
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => onSelectTime(time)}
                className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm ${
                  selectedTime === time
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 scale-105'
                    : 'bg-gray-700 text-white hover:bg-emerald-500/30 hover:text-green-300 hover:scale-105 hover:shadow-md border border-transparent hover:border-emerald-500/50'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSelection;