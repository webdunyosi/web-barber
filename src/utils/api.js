// src/utils/api.js
import axios from 'axios';
import barberData from '../data/barber.json';

const getApiUrl = () => {
  if (typeof window === 'undefined') return 'https://web-barber-backend.onrender.com/api';
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || 
                  hostname === '127.0.0.1' || 
                  /^192\.168\./.test(hostname) || 
                  /^10\./.test(hostname) || 
                  /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname);
  if (isLocal) {
    return `http://${hostname}:5001/api`;
  }
  return 'https://web-barber-backend.onrender.com/api';
};

const API_URL = getApiUrl();

// Axios request interceptor to inject x-barber-id and Authorization headers
axios.interceptors.request.use(
  (config) => {
    // Inject x-barber-id header if available in local storage
    const activeBarberJson = localStorage.getItem('active_barber');
    if (activeBarberJson) {
      try {
        const activeBarber = JSON.parse(activeBarberJson);
        if (activeBarber && activeBarber._id) {
          config.headers['x-barber-id'] = activeBarber._id;
        }
      } catch (e) {
        console.error('Error parsing active barber for request header:', e);
      }
    }
    
    // Legacy Authorization header backup if token exists
    const token = localStorage.getItem('barber_token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

const TELEGRAM_BOT_TOKEN = '8598199374:AAEQ98hlQkG3IPtntC5LkqeQ5Pv2h27Yr_U';
const TELEGRAM_CHAT_ID = '-1004413936957';

// Set this to false when connecting to the real deployed backend
const MOCK_MODE = false;

// Utility to send text messages to Telegram channel
const sendTelegramNotification = async (text) => {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
};

// Utility to send photo (File object) with caption to Telegram channel
const sendTelegramPhoto = async (file, caption) => {
  try {
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', file);
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      { method: 'POST', body: formData }
    );
    const result = await response.json();
    if (!result.ok) {
      console.error('Telegram sendPhoto error:', result.description);
      // Rasm xato bo'lsa matn yuboramiz
      await sendTelegramNotification(caption + '\n\n\u26a0\ufe0f _(Chek rasmi yuborishda xatolik)_');
    }
  } catch (error) {
    console.error('Telegram photo error:', error);
    // Fallback: matn xabar
    try { await sendTelegramNotification(caption + '\n\n\u26a0\ufe0f _(Chek rasmi yuborishda xatolik)_'); } catch {}
  }
};


// MOCK DATABASE INITIALIZATION
const initMockDb = () => {
  if (!localStorage.getItem('barber_users')) {
    const initialUsers = [
      {
        id: 'user_admin',
        name: 'Alimardon (Admin)',
        phone: '+998 99 999 99 99',
        telegram: 'alimardon_barber',
        role: 'admin',
        status: 'active',
        password: 'admin',
        loyaltyStamps: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 'user_1',
        name: 'Jasur Aliyev',
        phone: '+998 90 123 45 67',
        telegram: 'jasur_ali',
        role: 'user',
        status: 'active',
        password: 'password123',
        loyaltyStamps: 3,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'user_2',
        name: 'Sardor Karimov',
        phone: '+998 91 234 56 78',
        telegram: 'sardor_k',
        role: 'user',
        status: 'blocked',
        password: 'password123',
        loyaltyStamps: 0,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem('barber_users', JSON.stringify(initialUsers));
  }

  if (!localStorage.getItem('barber_bookings')) {
    const initialBookings = [
      {
        id: 'booking_1',
        name: 'Jasur Aliyev',
        phone: '+998 90 123 45 67',
        telegram_user: 'jasur_ali',
        serviceName: 'Soch olish',
        servicePrice: 50000,
        date: '06.06.2026',
        time: '11:00',
        status: 'confirmed',
        receipt: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop&q=60',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'booking_2',
        name: 'Temur Olimov',
        phone: '+998 93 456 78 90',
        telegram_user: 'temur_o',
        serviceName: 'Soch & Soqol',
        servicePrice: 80000,
        date: '05.06.2026',
        time: '14:30',
        status: 'pending',
        receipt: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop&q=60',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('barber_bookings', JSON.stringify(initialBookings));
  }

  const defaultMockServices = [
    { id: 1, name: 'Soch olish', name_en: 'Haircut', price: 100000, duration: 30, image_url: '/styles/1.png' },
    { id: 2, name: 'Soqol olish', name_en: 'Beard Trim', price: 70000, duration: 20, image_url: '/styles/2.png' },
    { id: 3, name: 'Soch + Soqol', name_en: 'Haircut + Beard', price: 150000, duration: 45, image_url: '/styles/3.png' },
    { id: 4, name: 'Yuz tozalash', name_en: 'Face Massage', price: 150000, duration: 30, image_url: '/styles/4.png' },
    { id: 5, name: 'Massaj', name_en: 'Massage', price: 100000, duration: 30, image_url: '/styles/4.png' }
  ];

  if (!localStorage.getItem('barber_services')) {
    localStorage.setItem('barber_services', JSON.stringify(defaultMockServices));
  }
};

initMockDb();

// Helper to get items from Mock DB
const getMockUsers = () => JSON.parse(localStorage.getItem('barber_users') || '[]');
const saveMockUsers = (users) => localStorage.setItem('barber_users', JSON.stringify(users));
const getMockBookings = () => JSON.parse(localStorage.getItem('barber_bookings') || '[]');
const saveMockBookings = (bookings) => localStorage.setItem('barber_bookings', JSON.stringify(bookings));

// 1. Ma'lum bir sanadagi band qilingan vaqtlarni olish
export const getBookedTimes = async (date) => {
  if (MOCK_MODE) {
    const bookings = getMockBookings();
    return bookings
      .filter((b) => b.date === date && (b.status === 'confirmed' || b.status === 'pending'))
      .map((b) => b.time);
  }
  
  try {
    const response = await axios.get(`${API_URL}/appointments/booked`, { params: { date } });
    return response.data;
  } catch (error) {
    console.error("Vaqtlarni olishda xato:", error);
    return [];
  }
};

// 2. Buyurtmani va rasmni backendga yuborish
export const submitBooking = async (bookingInfo, paymentData) => {
  const method = paymentData.paymentMethod || 'card';
  const isCash = method === 'cash';

  if (MOCK_MODE) {
    const bookings = getMockBookings();
    
    // Check if current user has 9 loyalty stamps for a free booking in mock mode
    const token = localStorage.getItem('barber_token') || '';
    const userId = token.replace('mock-jwt-token-', '');
    const users = getMockUsers();
    const user = users.find(u => u.id === userId);
    const isFree = user && user.loyaltyStamps === 9;
    const finalPrice = isFree ? 0 : bookingInfo.service.price;
    const finalMethod = isFree ? 'cash' : method;

    let receiptUrl = '';
    if (!isCash && !isFree) {
      receiptUrl = 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop&q=60';
      if (paymentData.receipt && paymentData.receipt instanceof File) {
        receiptUrl = URL.createObjectURL(paymentData.receipt);
      }
    }

    const newBooking = {
      id: 'booking_' + Date.now(),
      name: bookingInfo.name,
      phone: bookingInfo.phone,
      telegram_user: bookingInfo.telegram_user || '',
      serviceName: bookingInfo.service.name,
      servicePrice: finalPrice,
      date: bookingInfo.date,
      time: bookingInfo.time,
      status: 'pending',
      paymentMethod: finalMethod,
      receipt: receiptUrl,
      isFree: isFree,
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    saveMockBookings(bookings);

    // Send Telegram Notification for new booking/payment
    let methodDisplay = isCash ? '\ud83d\udcb5 Sartaroshga (Joyida)' : '\ud83d\udcb3 Karta orqali (Online)';
    if (isFree) {
      methodDisplay = '\ud83c\udf81 Bepul (Loyalty Card)';
    }
    const message = `
\ud83e\uddfe *Yangi Buyurtma & To'lov!*

\ud83d\udc64 *Mijoz:* ${bookingInfo.name}
\ud83d\udcf1 *Telefon:* ${bookingInfo.phone}
\ud83d\udcf1 *Telegram:* @${bookingInfo.telegram_user || 'mavjud emas'}
\ud83d\udcb3 *To'lov usuli:* ${methodDisplay}

\ud83d\udc88 *Xizmat:* ${bookingInfo.service.name}
\ud83d\udcb0 *Narx:* ${isFree ? 'BEPUL \ud83c\udf81' : finalPrice.toLocaleString() + ' so\'m'}
\ud83d\udcc5 *Sana:* ${bookingInfo.date}
\ud83d\udd50 *Vaqt:* ${bookingInfo.time}

${isFree ? '\u2705 _Loyalty Card orqali 10-bepul xizmat! Tasdiqlash uchun admin panelga kiring!_' : (isCash ? '\u2705 _Joyida to\'lash tanlandi. Tasdiqlash uchun admin panelga kiring!_' : '\u26a0\ufe0f _To\'lov chekini tasdiqlash uchun admin panelga kiring!_')}
    `.trim();
    
    await sendTelegramNotification(message);

    return { message: "Buyurtma qabul qilindi. To'lov tasdiqlangach, Telegram orqali xabar olasiz.", booking: newBooking };
  }

  // ===== REAL MODE =====
  // 1. Telegram caption tayyorlaymiz
  const telegramCaption = [
    "\ud83e\uddfe *Yangi Buyurtma & To'lov!*",
    "",
    `\ud83d\udc64 *Mijoz:* ${bookingInfo.name}`,
    `\ud83d\udcf1 *Telefon:* ${bookingInfo.phone}`,
    `\u2708\ufe0f *Telegram:* ${bookingInfo.telegram_user ? '@' + bookingInfo.telegram_user : 'mavjud emas'}`,
    `\ud83d\udcb3 *To'lov:* ${isCash ? '\ud83d\udcb5 Joyida (Naqd)' : '\ud83d\udcb3 Karta (Online)'}`,
    "",
    `\ud83d\udc88 *Xizmat:* ${bookingInfo.service.name}`,
    `\ud83d\udcb0 *Narx:* ${Number(bookingInfo.service.price).toLocaleString('uz-UZ')} so'm`,
    `\ud83d\udcc5 *Sana:* ${bookingInfo.date}`,
    `\ud83d\udd50 *Vaqt:* ${bookingInfo.time}`,
    "",
    isCash
      ? "\u2705 _Joyida to'lash tanlandi. Admin panelga kiring!_"
      : "\u26a0\ufe0f _Chekni tasdiqlash uchun admin panelga kiring!_",
  ].join('\n');

  // 2. To'g'ridan-to'g'ri Telegram ga yuboramiz (frontend dan)
  if (!isCash && paymentData.receipt instanceof File) {
    // Karta to'lovi: chek rasmini yuboramiz
    await sendTelegramPhoto(paymentData.receipt, telegramCaption);
  } else {
    // Naqd to'lov: matn xabar
    await sendTelegramNotification(telegramCaption);
  }

  // 3. Backend ga ham yuboramiz (DB ga saqlash uchun)
  const formData = new FormData();
  formData.append('name', bookingInfo.name);
  formData.append('phone', bookingInfo.phone);
  formData.append('telegram_user', bookingInfo.telegram_user || '');
  formData.append('serviceName', bookingInfo.service.name);
  formData.append('servicePrice', bookingInfo.service.price);
  formData.append('date', bookingInfo.date);
  formData.append('time', bookingInfo.time);
  formData.append('paymentMethod', method);
  
  if (!isCash) {
    if (paymentData.receipt) {
      formData.append('receipt', paymentData.receipt); 
    } else {
      throw new Error("To'lov cheki yuklanmagan!");
    }
  }

  const token = localStorage.getItem('barber_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.post(`${API_URL}/appointments`, formData, { headers });
  
  return response.data;
};

// ================= AUTH API =================

// Login
export const loginApi = async (phone, password, barberSlug) => {
  if (MOCK_MODE) {
    const users = getMockUsers();
    const cleanPhone = phone.replace(/\s+/g, '');
    const user = users.find(u => u.phone.replace(/\s+/g, '') === cleanPhone);

    if (!user) {
      throw new Error("Ushbu telefon raqamli foydalanuvchi topilmadi!");
    }
    if (user.password !== password) {
      throw new Error("Parol noto'g'ri!");
    }
    if (user.status === 'blocked') {
      throw new Error("Sizning profilingiz bloklangan! Sartarosh bilan bog'laning.");
    }

    return {
      token: "mock-jwt-token-" + user.id,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        telegram: user.telegram,
        role: user.role,
        status: user.status,
        loyaltyStamps: user.loyaltyStamps || 0
      }
    };
  }

  const response = await axios.post(`${API_URL}/auth/login`, { phone, password, barberSlug });
  return response.data;
};

// Register
export const registerApi = async (userData) => {
  if (MOCK_MODE) {
    const users = getMockUsers();
    const cleanPhone = userData.phone.replace(/\s+/g, '');
    
    const exists = users.some(u => u.phone.replace(/\s+/g, '') === cleanPhone);
    if (exists) {
      throw new Error("Bu telefon raqami allaqachon ro'yxatdan o'tgan!");
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name: userData.name,
      phone: userData.phone,
      telegram: userData.telegram || '',
      password: userData.password,
      role: 'user',
      status: 'active',
      loyaltyStamps: 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveMockUsers(users);

    // Send notification to telegram bot as requested
    const message = `
👤 *Yangi Mijoz Ro'yxatdan O'tdi!*

📝 *Ismi:* ${userData.name}
📱 *Telefon:* ${userData.phone}
✈️ *Telegram:* @${userData.telegram || 'kiritilmagan'}
📅 *Sana:* ${new Date().toLocaleDateString('uz-UZ')}
    `.trim();

    await sendTelegramNotification(message);

    return {
      token: "mock-jwt-token-" + newUser.id,
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        telegram: newUser.telegram,
        role: newUser.role,
        status: newUser.status,
        loyaltyStamps: newUser.loyaltyStamps
      }
    };
  }

  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

// Get Current User (via token)
export const getCurrentUserApi = async (token) => {
  if (MOCK_MODE) {
    if (!token || !token.startsWith('mock-jwt-token-')) {
      throw new Error('Token topilmadi');
    }
    const userId = token.replace('mock-jwt-token-', '');
    const users = getMockUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error("Foydalanuvchi topilmadi");
    }
    if (user.status === 'blocked') {
      throw new Error("Foydalanuvchi bloklangan");
    }
    
    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        telegram: user.telegram,
        role: user.role,
        status: user.status,
        loyaltyStamps: user.loyaltyStamps || 0
      }
    };
  }

  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ================= ADMIN API =================

// Users list
export const getUsersApi = async (token) => {
  if (MOCK_MODE) {
    return getMockUsers();
  }
  
  const response = await axios.get(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Create user
export const createUserApi = async (token, userData) => {
  if (MOCK_MODE) {
    const users = getMockUsers();
    const cleanPhone = userData.phone.replace(/\s+/g, '');
    
    const exists = users.some(u => u.phone.replace(/\s+/g, '') === cleanPhone);
    if (exists) {
      throw new Error("Bu telefon raqami allaqachon ro'yxatdan o'tgan!");
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name: userData.name,
      phone: userData.phone,
      telegram: userData.telegram || '',
      password: userData.password,
      role: userData.role || 'user',
      status: userData.status || 'active',
      loyaltyStamps: userData.loyaltyStamps || 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveMockUsers(users);
    return newUser;
  }

  const response = await axios.post(`${API_URL}/admin/users`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Block/Unblock user
export const blockUserApi = async (token, userId, isBlocked) => {
  if (MOCK_MODE) {
    const users = getMockUsers();
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: isBlocked ? 'blocked' : 'active' };
      }
      return u;
    });
    saveMockUsers(updated);
    
    // Notify in telegram bot
    const user = users.find(u => u.id === userId);
    if (user) {
      await sendTelegramNotification(`🔒 *Foydalanuvchi holati o'zgardi!*\n\n👤 *Foydalanuvchi:* ${user.name}\n📱 *Telefon:* ${user.phone}\n🛑 *Holati:* ${isBlocked ? 'BLOKLANDI 🚫' : 'FAOL QILINDI ✅'}`);
    }
    return { success: true, message: `Foydalanuvchi muvaffaqiyatli ${isBlocked ? 'bloklandi' : 'faollashtirildi'}` };
  }

  const response = await axios.put(`${API_URL}/admin/users/${userId}/block`, { isBlocked }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Delete user
export const deleteUserApi = async (token, userId) => {
  if (MOCK_MODE) {
    let users = getMockUsers();
    const user = users.find(u => u.id === userId);
    users = users.filter(u => u.id !== userId);
    saveMockUsers(users);

    if (user) {
      await sendTelegramNotification(`🗑 *Foydalanuvchi tizimdan o'chirildi!*\n\n👤 *Ismi:* ${user.name}\n📱 *Telefon:* ${user.phone}`);
    }
    return { success: true, message: 'Foydalanuvchi o\'chirildi' };
  }

  const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Edit user details (Update Name, Phone, Telegram, LoyaltyStamps, Role, Status)
export const editUserApi = async (token, userId, userData) => {
  if (MOCK_MODE) {
    const users = getMockUsers();
    const userIndex = users.findIndex(u => u.id === userId || u._id === userId);
    if (userIndex === -1) {
      throw new Error("Foydalanuvchi topilmadi");
    }

    // Check phone number uniqueness if it is changing
    if (userData.phone && userData.phone !== users[userIndex].phone) {
      const cleanPhone = userData.phone.replace(/\s+/g, '');
      const exists = users.some(u => (u.id !== userId && u._id !== userId) && u.phone.replace(/\s+/g, '') === cleanPhone);
      if (exists) {
        throw new Error("Bu telefon raqami allaqachon ro'yxatdan o'tgan!");
      }
    }

    let cleanTelegram = userData.telegram || '';
    if (cleanTelegram.startsWith('@')) {
      cleanTelegram = cleanTelegram.substring(1);
    }

    users[userIndex] = {
      ...users[userIndex],
      ...userData,
      telegram: cleanTelegram
    };
    saveMockUsers(users);

    return { success: true, message: 'Foydalanuvchi muvaffaqiyatli tahrirlandi', user: users[userIndex] };
  }

  const response = await axios.put(`${API_URL}/admin/users/${userId}`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Bookings list
export const getBookingsApi = async (token) => {
  if (MOCK_MODE) {
    return getMockBookings();
  }

  const response = await axios.get(`${API_URL}/admin/bookings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update booking status (confirm / reject)
export const updateBookingStatusApi = async (token, bookingId, status) => {
  if (MOCK_MODE) {
    const bookings = getMockBookings();
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status };
      }
      return b;
    });
    saveMockBookings(updated);

    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      // Manage mock loyalty card points
      if (status === 'confirmed' && booking.status !== 'confirmed') {
        const users = getMockUsers();
        const userIndex = users.findIndex(u => u.phone === booking.phone);
        if (userIndex !== -1) {
          if (booking.isFree) {
            users[userIndex].loyaltyStamps = 0;
          } else {
            users[userIndex].loyaltyStamps = Math.min((users[userIndex].loyaltyStamps || 0) + 1, 9);
          }
          saveMockUsers(users);
        }
      } else if (status !== 'confirmed' && booking.status === 'confirmed') {
        const users = getMockUsers();
        const userIndex = users.findIndex(u => u.phone === booking.phone);
        if (userIndex !== -1) {
          if (booking.isFree) {
            users[userIndex].loyaltyStamps = 9;
          } else {
            users[userIndex].loyaltyStamps = Math.max((users[userIndex].loyaltyStamps || 0) - 1, 0);
          }
          saveMockUsers(users);
        }
      }

      // Notify in telegram bot
      const statusText = status === 'confirmed' ? 'TASDIQLANDI ✅' : 'RAD ETILDI ❌';
      const message = `
📢 *Buyurtma holati o'zgardi!*

👤 *Mijoz:* ${booking.name}
📱 *Telefon:* ${booking.phone}
💈 *Xizmat:* ${booking.serviceName}
📅 *Sana/Vaqt:* ${booking.date} soat ${booking.time}
🛑 *Holat:* *${statusText}*
      `.trim();
      await sendTelegramNotification(message);
    }

    return { success: true, message: `Buyurtma statusi ${status} ga o'zgartirildi` };
  }

  const response = await axios.put(`${API_URL}/admin/bookings/${bookingId}`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Delete booking
export const deleteBookingApi = async (token, bookingId) => {
  if (MOCK_MODE) {
    let bookings = getMockBookings();
    const booking = bookings.find(b => b.id === bookingId);
    bookings = bookings.filter(b => b.id !== bookingId);
    saveMockBookings(bookings);

    if (booking) {
      await sendTelegramNotification(`🗑 *Buyurtma o'chirildi!*\n\n👤 *Mijoz:* ${booking.name}\n📱 *Telefon:* ${booking.phone}\n💈 *Xizmat:* ${booking.serviceName}\n📅 *Sana/Vaqt:* ${booking.date} soat ${booking.time}`);
    }
    return { success: true, message: 'Buyurtma o\'chirildi' };
  }

  const response = await axios.delete(`${API_URL}/admin/bookings/${bookingId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get Statistics (Daily, Weekly, Monthly)
// Save daily offline income (cash register)
export const saveOfflineIncomeApi = async (token, date, amount) => {
  if (MOCK_MODE) {
    const mockOfflineIncomes = JSON.parse(localStorage.getItem('barber_offline_incomes') || '{}');
    mockOfflineIncomes[date] = Number(amount);
    localStorage.setItem('barber_offline_incomes', JSON.stringify(mockOfflineIncomes));
    return { success: true, message: 'Kassa muvaffaqiyatli saqlandi' };
  }

  const response = await axios.post(`${API_URL}/admin/offline-income`, { date, amount }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get daily offline income
export const getOfflineIncomeApi = async (token, date) => {
  if (MOCK_MODE) {
    const mockOfflineIncomes = JSON.parse(localStorage.getItem('barber_offline_incomes') || '{}');
    return { date, amount: mockOfflineIncomes[date] || 0 };
  }

  const response = await axios.get(`${API_URL}/admin/offline-income/${date}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getStatisticsApi = async (token) => {
  if (MOCK_MODE) {
    const bookings = getMockBookings();
    const users = getMockUsers();

    // Helper calculations
    const now = new Date();
    
    // Online Revenue categories
    let onlineDailyRevenue = 0;
    let onlineWeeklyRevenue = 0;
    let onlineMonthlyRevenue = 0;
    let onlineTotalRevenue = 0;

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    bookings.forEach(b => {
      if (b.status === 'confirmed') {
        const bookingDate = new Date(b.createdAt || b.date);
        const diff = now - bookingDate;
        
        onlineTotalRevenue += b.servicePrice;
        
        if (diff <= oneDay) {
          onlineDailyRevenue += b.servicePrice;
        }
        if (diff <= oneWeek) {
          onlineWeeklyRevenue += b.servicePrice;
        }
        if (diff <= oneMonth) {
          onlineMonthlyRevenue += b.servicePrice;
        }
      }
    });

    // Offline calculations in mock mode
    const mockOfflineIncomes = JSON.parse(localStorage.getItem('barber_offline_incomes') || '{}');
    
    // Helper to parse date key "DD.MM.YYYY"
    const parseKeyDate = (keyStr) => {
      const parts = keyStr.split('.');
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
      return new Date(0);
    };

    let offlineDailyRevenue = 0;
    let offlineWeeklyRevenue = 0;
    let offlineMonthlyRevenue = 0;
    let offlineTotalRevenue = 0;

    Object.keys(mockOfflineIncomes).forEach(key => {
      const amt = Number(mockOfflineIncomes[key]) || 0;
      const keyDate = parseKeyDate(key);
      const diff = now - keyDate;

      offlineTotalRevenue += amt;

      if (keyDate.toDateString() === now.toDateString()) {
        offlineDailyRevenue += amt;
      }
      if (diff <= oneWeek) {
        offlineWeeklyRevenue += amt;
      }
      if (diff <= oneMonth) {
        offlineMonthlyRevenue += amt;
      }
    });

    // Popular services counter
    const serviceCounts = {};
    bookings.forEach(b => {
      serviceCounts[b.serviceName] = (serviceCounts[b.serviceName] || 0) + 1;
    });

    const popularServices = Object.keys(serviceCounts).map(name => ({
      name,
      count: serviceCounts[name],
      revenue: bookings.filter(b => b.serviceName === name && b.status === 'confirmed').reduce((sum, b) => sum + b.servicePrice, 0)
    })).sort((a, b) => b.count - a.count);

    // Dynamic data for charts (last 7 days)
    const chartData = [];
    const dayNamesUz = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * oneDay);
      const dayName = dayNamesUz[d.getDay()];
      
      const dayStr = String(d.getDate()).padStart(2, '0');
      const monthStr = String(d.getMonth() + 1).padStart(2, '0');
      const dbDateString = `${dayStr}.${monthStr}.${d.getFullYear()}`;
      
      const dayLabel = `${dayName} ${dayStr}.${monthStr}`;
      
      const onlineValue = bookings
        .filter(b => b.status === 'confirmed' && new Date(b.createdAt || b.date).toDateString() === d.toDateString())
        .reduce((sum, b) => sum + b.servicePrice, 0);

      const offlineValue = mockOfflineIncomes[dbDateString] || 0;

      chartData.push({
        label: dayLabel,
        value: onlineValue + offlineValue,
        onlineValue,
        offlineValue
      });
    }

    return {
      dailyRevenue: onlineDailyRevenue + offlineDailyRevenue,
      weeklyRevenue: onlineWeeklyRevenue + offlineWeeklyRevenue,
      monthlyRevenue: onlineMonthlyRevenue + offlineMonthlyRevenue,
      totalRevenue: onlineTotalRevenue + offlineTotalRevenue,
      onlineDailyRevenue,
      onlineWeeklyRevenue,
      onlineMonthlyRevenue,
      onlineTotalRevenue,
      offlineDailyRevenue,
      offlineWeeklyRevenue,
      offlineMonthlyRevenue,
      offlineTotalRevenue,
      totalUsers: users.filter(u => u.role !== 'admin').length,
      blockedUsersCount: users.filter(u => u.status === 'blocked').length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
      popularServices,
      chartData
    };
  }

  const response = await axios.get(`${API_URL}/admin/statistics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = response.data;
  return {
    dailyRevenue: data.revenues?.daily ?? 0,
    weeklyRevenue: data.revenues?.weekly ?? 0,
    monthlyRevenue: data.revenues?.monthly ?? 0,
    totalRevenue: data.revenues?.total ?? 0,
    onlineDailyRevenue: data.onlineRevenues?.daily ?? 0,
    onlineWeeklyRevenue: data.onlineRevenues?.weekly ?? 0,
    onlineMonthlyRevenue: data.onlineRevenues?.monthly ?? 0,
    onlineTotalRevenue: data.onlineRevenues?.total ?? 0,
    offlineDailyRevenue: data.offlineRevenues?.daily ?? 0,
    offlineWeeklyRevenue: data.offlineRevenues?.weekly ?? 0,
    offlineMonthlyRevenue: data.offlineRevenues?.monthly ?? 0,
    offlineTotalRevenue: data.offlineRevenues?.total ?? 0,
    totalUsers: data.counts?.totalUsers ?? 0,
    blockedUsersCount: data.counts?.blockedUsers ?? 0,
    totalBookings: data.counts?.totalBookings ?? 0,
    pendingBookings: data.counts?.pendingBookings ?? 0,
    confirmedBookings: data.counts?.confirmedBookings ?? 0,
    popularServices: (data.popularServices || []).map(s => ({
      name: s.serviceName,
      count: s.bookingCount,
      revenue: s.totalConfirmedRevenue
    })),
    chartData: data.chartData || []
  };
};

// Get my bookings
export const getMyBookingsApi = async (token) => {
  if (MOCK_MODE) {
    const bookings = getMockBookings();
    return bookings;
  }

  const response = await axios.get(`${API_URL}/appointments/my`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update profile details
export const updateProfileApi = async (token, userData) => {
  if (MOCK_MODE) {
    const users = getMockUsers();
    // In mock mode, the token is e.g. "mock-jwt-token-user_1"
    const userId = token.replace('mock-jwt-token-', '');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error("Foydalanuvchi topilmadi");
    }
    
    users[userIndex].name = userData.name;
    // Strip @ from telegram if present
    let cleanTelegram = userData.telegram || '';
    if (cleanTelegram.startsWith('@')) {
      cleanTelegram = cleanTelegram.substring(1);
    }
    users[userIndex].telegram = cleanTelegram.trim();
    
    if (userData.password && userData.password.trim() !== '') {
      users[userIndex].password = userData.password;
    }
    
    saveMockUsers(users);
    
    return {
      user: {
        id: users[userIndex].id,
        name: users[userIndex].name,
        phone: users[userIndex].phone,
        telegram: users[userIndex].telegram,
        role: users[userIndex].role,
        status: users[userIndex].status,
        loyaltyStamps: users[userIndex].loyaltyStamps || 0
      }
    };
  }

  const response = await axios.put(`${API_URL}/auth/profile`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ================= CHATBOT AI API =================
export const sendChatMessageApi = async (message, chatHistory = []) => {
  if (MOCK_MODE) {
    return {
      reply: "MOCK REJIM: Tizim hozirda o'rganish rejimida. Haqiqiy AI ga ulanish uchun `MOCK_MODE` ni `false` qiling va serverni ishga tushiring.",
      action: "none"
    };
  }

  const token = localStorage.getItem('barber_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.post(`${API_URL}/chat`, { message, history: chatHistory }, { headers });
  return response.data;
};

// ================= NOTIFICATIONS API =================
export const getNotificationsApi = async () => {
  if (MOCK_MODE) {
    const mockNotifs = JSON.parse(localStorage.getItem('barber_notifications') || '[]');
    if (mockNotifs.length === 0) {
      const defaultNotifs = [
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
      localStorage.setItem('barber_notifications', JSON.stringify(defaultNotifs));
      return defaultNotifs;
    }
    return mockNotifs;
  }

  const response = await axios.get(`${API_URL}/notifications`);
  return response.data;
};

export const createNotificationApi = async (token, notificationData) => {
  if (MOCK_MODE) {
    const mockNotifs = JSON.parse(localStorage.getItem('barber_notifications') || '[]');
    const newNotif = {
      id: 'notif_' + Date.now(),
      title: notificationData.title,
      description: notificationData.description,
      content: notificationData.content || notificationData.description,
      type: notificationData.type || 'system',
      linkType: notificationData.linkType || 'none',
      linkUrl: notificationData.linkUrl || '',
      imageUrl: notificationData.imageUrl || '',
      createdAt: new Date().toISOString()
    };
    mockNotifs.unshift(newNotif);
    localStorage.setItem('barber_notifications', JSON.stringify(mockNotifs));
    return { success: true, notification: newNotif };
  }

  const response = await axios.post(`${API_URL}/notifications`, notificationData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteNotificationApi = async (token, notificationId) => {
  if (MOCK_MODE) {
    let mockNotifs = JSON.parse(localStorage.getItem('barber_notifications') || '[]');
    mockNotifs = mockNotifs.filter(n => n.id !== notificationId && n._id !== notificationId);
    localStorage.setItem('barber_notifications', JSON.stringify(mockNotifs));
    return { success: true, message: 'Bildirishnoma o\'chirildi' };
  }

  const response = await axios.delete(`${API_URL}/notifications/${notificationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateNotificationApi = async (token, notificationId, notificationData) => {
  if (MOCK_MODE) {
    const mockNotifs = JSON.parse(localStorage.getItem('barber_notifications') || '[]');
    const index = mockNotifs.findIndex(n => n.id === notificationId || n._id === notificationId);
    if (index !== -1) {
      mockNotifs[index] = {
        ...mockNotifs[index],
        title: notificationData.title,
        description: notificationData.description,
        content: notificationData.content || notificationData.description,
        type: notificationData.type || 'system',
        linkType: notificationData.linkType || 'none',
        linkUrl: notificationData.linkUrl || '',
        imageUrl: notificationData.imageUrl || '',
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('barber_notifications', JSON.stringify(mockNotifs));
      return { success: true, notification: mockNotifs[index] };
    }
    throw new Error('Bildirishnoma topilmadi');
  }

  const response = await axios.put(`${API_URL}/notifications/${notificationId}`, notificationData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ================= BLOCKED SCHEDULES API =================
export const getBlockedSchedulesApi = async (token) => {
  if (MOCK_MODE) {
    return JSON.parse(localStorage.getItem('barber_blocked_schedules') || '[]');
  }

  const response = await axios.get(`${API_URL}/admin/blocked-schedules`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const saveBlockedScheduleApi = async (token, scheduleData) => {
  if (MOCK_MODE) {
    const schedules = JSON.parse(localStorage.getItem('barber_blocked_schedules') || '[]');
    const index = schedules.findIndex(s => s.date === scheduleData.date);
    const newSchedule = {
      _id: 'block_' + Date.now(),
      date: scheduleData.date,
      blockedTimes: scheduleData.blockedTimes,
      reason: scheduleData.reason || '',
      createdAt: new Date().toISOString()
    };
    if (index !== -1) {
      schedules[index] = newSchedule;
    } else {
      schedules.push(newSchedule);
    }
    localStorage.setItem('barber_blocked_schedules', JSON.stringify(schedules));
    return { success: true, schedule: newSchedule };
  }

  const response = await axios.post(`${API_URL}/admin/blocked-schedules`, scheduleData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteBlockedScheduleApi = async (token, date) => {
  if (MOCK_MODE) {
    let schedules = JSON.parse(localStorage.getItem('barber_blocked_schedules') || '[]');
    schedules = schedules.filter(s => s.date !== date);
    localStorage.setItem('barber_blocked_schedules', JSON.stringify(schedules));
    return { success: true, message: 'Sana blokdan chiqarildi' };
  }

  const response = await axios.delete(`${API_URL}/admin/blocked-schedules/by-date/${date}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getBlockedDaysApi = async (barberId) => {
  if (MOCK_MODE) {
    const schedules = JSON.parse(localStorage.getItem('barber_blocked_schedules') || '[]');
    return schedules
      .filter(s => s.blockedTimes.includes('ALL'))
      .map(s => s.date);
  }

  const response = await axios.get(`${API_URL}/appointments/blocked-days`, { params: { barberId } });
  return response.data;
};

// ================= SERVICES API =================

export const getServicesApi = async (barberId) => {
  if (MOCK_MODE) {
    const defaultMockServices = [
      { id: 1, name: 'Soch olish', name_en: 'Haircut', price: 100000, duration: 30, image_url: '/styles/1.png' },
      { id: 2, name: 'Soqol olish', name_en: 'Beard Trim', price: 70000, duration: 20, image_url: '/styles/2.png' },
      { id: 3, name: 'Soch + Soqol', name_en: 'Haircut + Beard', price: 150000, duration: 45, image_url: '/styles/3.png' },
      { id: 4, name: 'Yuz tozalash', name_en: 'Face Massage', price: 150000, duration: 30, image_url: '/styles/4.png' },
      { id: 5, name: 'Massaj', name_en: 'Massage', price: 100000, duration: 30, image_url: '/styles/4.png' }
    ];

    if (!localStorage.getItem('barber_services')) {
      localStorage.setItem('barber_services', JSON.stringify(defaultMockServices));
    }
    return JSON.parse(localStorage.getItem('barber_services') || '[]');
  }

  const response = await axios.get(`${API_URL}/services`, { params: { barberId } });
  return response.data;
};

export const addServiceApi = async (token, serviceData, file) => {
  if (MOCK_MODE) {
    const services = JSON.parse(localStorage.getItem('barber_services') || '[]');
    const nextId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    const newService = {
      id: nextId,
      name: serviceData.name,
      name_en: serviceData.name_en || '',
      price: Number(serviceData.price),
      duration: Number(serviceData.duration),
      image_url: file ? URL.createObjectURL(file) : (serviceData.image_url || '/styles/1.png')
    };
    services.push(newService);
    localStorage.setItem('barber_services', JSON.stringify(services));
    return newService;
  }

  const formData = new FormData();
  formData.append('name', serviceData.name);
  formData.append('name_en', serviceData.name_en || '');
  formData.append('price', serviceData.price);
  formData.append('duration', serviceData.duration);
  if (file) {
    formData.append('image', file);
  } else if (serviceData.image_url) {
    formData.append('image_url', serviceData.image_url);
  }

  const response = await axios.post(`${API_URL}/admin/services`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateServiceApi = async (token, serviceId, serviceData, file) => {
  if (MOCK_MODE) {
    const services = JSON.parse(localStorage.getItem('barber_services') || '[]');
    const index = services.findIndex(s => s.id === serviceId || s._id === serviceId);
    if (index === -1) throw new Error("Xizmat topilmadi");
    services[index] = {
      ...services[index],
      name: serviceData.name,
      name_en: serviceData.name_en || '',
      price: Number(serviceData.price),
      duration: Number(serviceData.duration),
      image_url: file ? URL.createObjectURL(file) : (serviceData.image_url || services[index].image_url)
    };
    localStorage.setItem('barber_services', JSON.stringify(services));
    return services[index];
  }

  const formData = new FormData();
  formData.append('name', serviceData.name);
  formData.append('name_en', serviceData.name_en || '');
  formData.append('price', serviceData.price);
  formData.append('duration', serviceData.duration);
  if (file) {
    formData.append('image', file);
  } else if (serviceData.image_url) {
    formData.append('image_url', serviceData.image_url);
  }

  const response = await axios.put(`${API_URL}/admin/services/${serviceId}`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteServiceApi = async (token, serviceId) => {
  if (MOCK_MODE) {
    let services = JSON.parse(localStorage.getItem('barber_services') || '[]');
    services = services.filter(s => s.id !== serviceId && s._id !== serviceId);
    localStorage.setItem('barber_services', JSON.stringify(services));
    return { success: true, message: 'Xizmat muvaffaqiyatli o\'chirildi' };
  }

  const response = await axios.delete(`${API_URL}/admin/services/${serviceId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ================= SUPER ADMIN & MULTI-TENANT BARBER API =================

export const getBarbersApi = async (token) => {
  const response = await axios.get(`${API_URL}/superadmin/barbers`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createBarberApi = async (token, barberData) => {
  const response = await axios.post(`${API_URL}/superadmin/barbers`, barberData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateBarberApi = async (token, barberId, barberData) => {
  const response = await axios.put(`${API_URL}/superadmin/barbers/${barberId}`, barberData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteBarberApi = async (token, barberId) => {
  const response = await axios.delete(`${API_URL}/superadmin/barbers/${barberId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getSuperadminStatsApi = async (token) => {
  const response = await axios.get(`${API_URL}/superadmin/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getPublicBarbersApi = async () => {
  const response = await axios.get(`${API_URL}/barbers`);
  return response.data;
};

export const getBarberBySlugApi = async (slug) => {
  const response = await axios.get(`${API_URL}/barbers/info/${slug}`);
  return response.data;
};

export const getPaymentsApi = async (token) => {
  const response = await axios.get(`${API_URL}/superadmin/payments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createPaymentApi = async (token, paymentData) => {
  const response = await axios.post(`${API_URL}/superadmin/payments`, paymentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updatePaymentApi = async (token, paymentId, paymentData) => {
  const response = await axios.put(`${API_URL}/superadmin/payments/${paymentId}`, paymentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deletePaymentApi = async (token, paymentId) => {
  const response = await axios.delete(`${API_URL}/superadmin/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

