import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBell, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaGift, 
  FaTrash, 
  FaEnvelopeOpen,
  FaCalendarAlt,
  FaChevronRight
} from 'react-icons/fa';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('barber_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing notifications:', e);
      }
    }
    
    // Default initial notifications if none exist
    return [
      {
        id: 1,
        title: "Xush kelibsiz! 🎉",
        description: "Web Barber shaxsiy kabinetiga xush kelibsiz! Bu yerda siz soch stillarini ko'rishingiz, navbatga yozilishingiz va cashback ballaringizni kuzatib borishingiz mumkin.",
        time: "Bugun, 10:00",
        type: "welcome",
        read: false
      },
      {
        id: 2,
        title: "Loyallik dasturi faol 💳",
        description: "Har bir to'lovingiz uchun sadoqat kartangizga bonus ballar qo'shib boriladi. Bevosita sartaroshxonamizda foydalaning!",
        time: "Bugun, 09:15",
        type: "loyalty",
        read: false
      },
      {
        id: 3,
        title: "Yozgi yangi stillar qo'shildi! 💈",
        description: "Bizning soch va soqol stillari katalogimizga yangi dizaynlar yuklandi. 'Stillar' bo'limida o'zingizga mosini tanlang.",
        time: "Kecha, 14:30",
        type: "system",
        read: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('barber_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation(); // Prevent toggling read status
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Barcha bildirishnomalarni o'chirishni xohlaysizmi?")) {
      setNotifications([]);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'welcome':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FaCheckCircle size={18} />
          </div>
        );
      case 'loyalty':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FaGift size={18} />
          </div>
        );
      case 'appointment':
        return (
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <FaCalendarAlt size={18} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <FaInfoCircle size={18} />
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full lg:w-5/6 ml-auto text-white px-0 sm:px-4 pt-2 pb-4 lg:pt-6 lg:pb-8">
      <div className="max-w-xl mx-auto space-y-5">
        
        {/* Header Card */}
        <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button 
              onClick={() => navigate(-1)} 
              className="p-2.5 rounded-xl border border-white/10 bg-zinc-800/50 hover:bg-zinc-850 hover:border-emerald-500/30 text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0 shadow-sm"
              title="Ortga"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight">Bildirishnomalar</h3>
              <p className="text-emerald-400 text-xs font-semibold mt-0.5">
                {unreadCount > 0 ? `${unreadCount} ta yangi xabar` : 'Barcha xabarlar o\'qilgan'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <>
                {/* Mark as read */}
                <button 
                  onClick={markAllAsRead}
                  className="p-2 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all cursor-pointer text-xs flex items-center gap-1.5 font-semibold"
                  title="Hammasini o'qildi qilish"
                  disabled={unreadCount === 0}
                >
                  <FaEnvelopeOpen size={13} />
                  <span className="hidden sm:inline">O'qilgan</span>
                </button>

                {/* Clear all */}
                <button 
                  onClick={clearAll}
                  className="p-2 rounded-lg border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer"
                  title="Barchasini o'chirish"
                >
                  <FaTrash size={13} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center p-6 space-y-3 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 border border-white/5">
                <FaBell size={28} className="opacity-50" />
              </div>
              <h4 className="text-zinc-300 font-bold text-sm sm:text-base">Bildirishnomalar yo'q</h4>
              <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
                Hozircha sizda hech qanday yangi bildirishnomalar mavjud emas.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-3.5 items-start ${
                    notif.read 
                      ? 'bg-zinc-950/20 border-white/5 hover:bg-zinc-900/50' 
                      : 'bg-zinc-850/40 border-emerald-500/15 shadow-sm shadow-emerald-500/5 hover:bg-zinc-800/50'
                  }`}
                >
                  {/* Read/Unread dot indicator */}
                  {!notif.read && (
                    <span className="absolute top-4 right-4 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                  )}

                  {/* Left Icon */}
                  <div className="shrink-0 animate-fadeIn">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className={`text-xs sm:text-sm font-bold leading-snug ${notif.read ? 'text-zinc-350' : 'text-white'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed mt-1">
                      {notif.description}
                    </p>
                    <span className="text-[10px] text-zinc-500 mt-2 block font-medium">
                      {notif.time}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button 
                    onClick={(e) => deleteNotification(notif.id, e)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer active:scale-90"
                    title="O'chirish"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NotificationsPage;
