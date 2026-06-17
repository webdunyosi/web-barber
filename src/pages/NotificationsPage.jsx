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
  FaSpinner
} from 'react-icons/fa';
import { getNotificationsApi } from '../utils/api';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [dbNotifications, setDbNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Read and local deletion states tracked client-side via localStorage arrays
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('barber_read_notif_ids') || '[]');
    } catch (e) {
      return [];
    }
  });

  const [deletedIds, setDeletedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('barber_deleted_notif_ids') || '[]');
    } catch (e) {
      return [];
    }
  });

  const loadNotificationsData = async () => {
    setLoading(true);
    try {
      const data = await getNotificationsApi();
      setDbNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotificationsData();
  }, []);

  const markAllAsRead = () => {
    const allIds = dbNotifications.map(n => n._id || n.id);
    const updated = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updated);
    localStorage.setItem('barber_read_notif_ids', JSON.stringify(updated));
  };

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      localStorage.setItem('barber_read_notif_ids', JSON.stringify(updated));
    }
  };

  const deleteNotificationLocally = (id, e) => {
    e.stopPropagation(); // Prevent opening/marking read
    if (!deletedIds.includes(id)) {
      const updated = [...deletedIds, id];
      setDeletedIds(updated);
      localStorage.setItem('barber_deleted_notif_ids', JSON.stringify(updated));
      if (selectedNotification && (selectedNotification._id === id || selectedNotification.id === id)) {
        setSelectedNotification(null);
      }
    }
  };

  const clearAllLocally = () => {
    if (window.confirm("Barcha bildirishnomalarni o'chirishni xohlaysizmi?")) {
      const allIds = dbNotifications.map(n => n._id || n.id);
      const updated = Array.from(new Set([...deletedIds, ...allIds]));
      setDeletedIds(updated);
      localStorage.setItem('barber_deleted_notif_ids', JSON.stringify(updated));
      setSelectedNotification(null);
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

  // Filter visible notifications
  const visibleNotifications = dbNotifications.filter(n => {
    const id = n._id || n.id;
    return !deletedIds.includes(id);
  });

  const unreadCount = visibleNotifications.filter(n => {
    const id = n._id || n.id;
    return !readIds.includes(id);
  }).length;

  // Render detail view if a notification is selected
  if (selectedNotification) {
    const isLinked = selectedNotification.linkType && selectedNotification.linkType !== 'none';
    
    const getActionButtonLabel = () => {
      switch (selectedNotification.linkType) {
        case 'booking':
          return 'Hoziroq Navbat Olish 📅';
        case 'styles':
          return "Soch Stillarini Ko'rish 💈";
        case 'loyalty':
          return "Sadoqat Kartasiga O'tish 💳";
        case 'external':
        default:
          return 'Batafsil ma\'lumot 🔗';
      }
    };

    const handleActionClick = () => {
      switch (selectedNotification.linkType) {
        case 'booking':
          navigate('/');
          break;
        case 'styles':
          navigate('/stillar');
          break;
        case 'loyalty':
          navigate('/loyalty');
          break;
        case 'external':
          if (selectedNotification.linkUrl) {
            window.open(selectedNotification.linkUrl, '_blank');
          }
          break;
        default:
          break;
      }
    };

    return (
      <div className="w-full lg:w-5/6 ml-auto text-white px-2 sm:px-4 pt-1 pb-4 lg:pt-2 lg:pb-8 animate-fadeIn">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Detail Header Bar */}
          <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedNotification(null)} 
                className="p-2.5 rounded-xl border border-white/10 bg-zinc-800/50 hover:bg-zinc-850 hover:border-emerald-500/30 text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0 shadow-sm"
                title="Ortga"
              >
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h3 className="text-base sm:text-lg font-bold leading-tight">Batafsil ma'lumot</h3>
                <p className="text-emerald-400 text-xs font-semibold mt-0.5">Xabarni o'qish</p>
              </div>
            </div>
            
            <button 
              onClick={(e) => deleteNotificationLocally(selectedNotification._id || selectedNotification.id, e)}
              className="p-2.5 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer"
              title="O'chirish"
            >
              <FaTrash size={13} />
            </button>
          </div>

          {/* Detail Card Container */}
          <div className="bg-zinc-900/70 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl animate-fadeIn">
            {/* Banner Image */}
            {selectedNotification.imageUrl ? (
              <div className="w-full h-48 sm:h-64 md:h-72 relative">
                <img
                  src={selectedNotification.imageUrl}
                  alt={selectedNotification.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent"></div>
              </div>
            ) : (
              <div className="w-full h-16 bg-gradient-to-r from-emerald-950/20 via-zinc-900/50 to-teal-950/20 border-b border-white/5"></div>
            )}

            {/* Detail Content Area */}
            <div className="p-5 sm:p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                    selectedNotification.type === 'welcome'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                      : selectedNotification.type === 'loyalty'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                      : selectedNotification.type === 'appointment'
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/25'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                  }`}>
                    {selectedNotification.type === 'welcome' && 'Xush kelibsiz'}
                    {selectedNotification.type === 'loyalty' && 'Sadoqat dasturi'}
                    {selectedNotification.type === 'appointment' && 'Navbat / Tashrif'}
                    {selectedNotification.type === 'system' && 'Tizim'}
                  </span>
                  
                  <span className="text-xs text-zinc-500 font-semibold">
                    ⏱ {new Date(selectedNotification.createdAt || Date.now()).toLocaleString('uz-UZ', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {selectedNotification.title}
                </h1>
              </div>

              <div className="border-b border-white/10"></div>

              <div className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                {selectedNotification.content || selectedNotification.description}
              </div>

              {isLinked && (
                <div className="pt-4 border-t border-white/5 animate-bounce-in">
                  <button
                    onClick={handleActionClick}
                    className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all duration-300 active:scale-95 shadow-lg shadow-emerald-500/20 border-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    {getActionButtonLabel()}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-5/6 ml-auto text-white px-2 sm:px-4 pt-1 pb-4 lg:pt-2 lg:pb-8">
      <div className="max-w-3xl mx-auto space-y-4 animate-fadeIn">
        
        {/* Main Header Card */}
        <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            {visibleNotifications.length > 0 && (
              <>
                <button 
                  onClick={markAllAsRead}
                  className="p-2 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all cursor-pointer text-xs flex items-center gap-1.5 font-semibold"
                  title="Hammasini o'qildi qilish"
                  disabled={unreadCount === 0}
                >
                  <FaEnvelopeOpen size={13} />
                  <span className="hidden sm:inline">Hammasi o'qildi</span>
                </button>

                <button 
                  onClick={clearAllLocally}
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
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <FaSpinner className="animate-spin text-emerald-500 text-3xl" />
              <span className="text-sm font-semibold text-zinc-400">Bildirishnomalar yuklanmoqda...</span>
            </div>
          ) : visibleNotifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 border border-white/5">
                <FaBell size={28} className="opacity-50" />
              </div>
              <h4 className="text-zinc-300 font-bold text-sm sm:text-base">Bildirishnomalar yo'q</h4>
              <p className="text-zinc-550 text-xs max-w-xs leading-relaxed">
                Hozircha sizda hech qanday bildirishnomalar mavjud emas.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleNotifications.map((notif) => {
                const notifId = notif._id || notif.id;
                const isRead = readIds.includes(notifId);
                
                return (
                  <div 
                    key={notifId}
                    onClick={() => {
                      markAsRead(notifId);
                      setSelectedNotification(notif);
                    }}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-3.5 items-start ${
                      isRead 
                        ? 'bg-zinc-950/25 border-white/5 opacity-70 hover:opacity-100 hover:bg-zinc-900/50' 
                        : 'bg-zinc-850/45 border-emerald-500/20 shadow-sm shadow-emerald-500/5 hover:bg-zinc-800/50'
                    }`}
                  >
                    {/* Pulsating unread dot indicator */}
                    {!isRead && (
                      <span className="absolute top-4 right-4 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                    )}

                    {/* Left Category Icon */}
                    <div className="shrink-0">
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* Title and Short Description */}
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className={`text-xs sm:text-sm font-bold leading-snug ${isRead ? 'text-zinc-400' : 'text-white'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed mt-1 line-clamp-2">
                        {notif.description}
                      </p>
                      <span className="text-[9px] text-zinc-500 mt-2 block font-medium">
                        {new Date(notif.createdAt || Date.now()).toLocaleString('uz-UZ', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Delete button */}
                    <button 
                      onClick={(e) => deleteNotificationLocally(notifId, e)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer active:scale-90"
                      title="O'chirish"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NotificationsPage;
