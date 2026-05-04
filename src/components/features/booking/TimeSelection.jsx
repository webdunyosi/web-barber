import React, { useState, useEffect } from 'react';
import { getBookedTimes } from '../../../utils/api'; // api.js dan chaqiramiz

const TimeSelection = ({ selectedDate, selectedTime, onSelectTime }) => {
  const [bookedTimes, setBookedTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Foydalanuvchi sanani tanlaganda, backenddan band vaqtlarni tekshirib olamiz
  useEffect(() => {
    if (selectedDate) {
      // Alohida asinxron funksiya yaratamiz
      const fetchTimes = async () => {
        setIsLoading(true); // Endi xato bermaydi, chunki asinxron funksiya ichida
        try {
          const times = await getBookedTimes(selectedDate);
          setBookedTimes(times);
        } catch (error) {
          console.error("Vaqtlarni yuklashda xatolik:", error);
        } finally {
          setIsLoading(false);
        }
      };

      // Funksiyani ishga tushiramiz
      fetchTimes();
    }
  }, [selectedDate]);

  // Vaqtlar ro'yxati (bu sizning data.json faylingizdan yoki qandaydir arraydan kelishi mumkin)
  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", /* ... qolgan vaqtlar */];

  return (
    <div>
       {isLoading ? (
          <p className="text-white">Vaqtlar tekshirilmoqda...</p>
       ) : (
          <div className="grid grid-cols-4 gap-4">
            {timeSlots.map((time) => {
              // Shu vaqt backenddan kelgan band vaqtlar ichida bormi?
              const isBooked = bookedTimes.includes(time); 

              return (
                <button
                  key={time}
                  onClick={() => onSelectTime(time)}
                  disabled={isBooked} // Agar band bo'lsa, tugmani o'chirib qo'yamiz
                  className={`
                    p-3 rounded-lg border transition-all
                    ${selectedTime === time ? 'bg-green-500 border-green-400 text-white' : ''}
                    ${isBooked ? 'bg-gray-700 opacity-50 cursor-not-allowed border-gray-600' : 'bg-zinc-800 hover:border-green-500'}
                  `}
                >
                  {time}
                </button>
              );
            })}
          </div>
       )}
    </div>
  );
};

export default TimeSelection;