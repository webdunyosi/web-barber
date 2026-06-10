// src/utils/api.js
import axios from 'axios';

const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : 'https://web-barber-backend.onrender.com/api';
const TELEGRAM_BOT_TOKEN = '8598199374:AAF2PC8uHwutdUg0VU9Q8jeypNzV3egcOXk';
const TELEGRAM_CHAT_ID = '5414733748';

// Set this to false when connecting to the real deployed backend
const MOCK_MODE = false;

// Utility to send messages to the Telegram Bot
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
        serviceName: 'Soch kesish (Classic)',
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
    
    let receiptUrl = '';
    if (!isCash) {
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
      servicePrice: bookingInfo.service.price,
      date: bookingInfo.date,
      time: bookingInfo.time,
      status: 'pending',
      paymentMethod: method,
      receipt: receiptUrl,
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    saveMockBookings(bookings);

    // Send Telegram Notification for new booking/payment
    const methodDisplay = isCash ? '💵 Sartaroshga (Joyida)' : '💳 Karta orqali (Online)';
    const message = `
🧾 *Yangi Buyurtma & To'lov!*

👤 *Mijoz:* ${bookingInfo.name}
📱 *Telefon:* ${bookingInfo.phone}
📱 *Telegram:* @${bookingInfo.telegram_user || 'mavjud emas'}
💳 *To'lov usuli:* ${methodDisplay}

💈 *Xizmat:* ${bookingInfo.service.name}
💰 *Narx:* ${bookingInfo.service.price.toLocaleString()} so'm
📅 *Sana:* ${bookingInfo.date}
🕐 *Vaqt:* ${bookingInfo.time}

${isCash ? '✅ _Joyida to\'lash tanlandi. Tasdiqlash uchun admin panelga kiring!_' : '⚠️ _To\'lov chekini tasdiqlash uchun admin panelga kiring!_'}
    `.trim();
    
    await sendTelegramNotification(message);

    return { message: "Buyurtma qabul qilindi. To'lov tasdiqlangach, Telegram orqali xabar olasiz.", booking: newBooking };
  }

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
  const headers = { 'Content-Type': 'multipart/form-data' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.post(`${API_URL}/appointments`, formData, { headers });
  
  return response.data;
};

// ================= AUTH API =================

// Login
export const loginApi = async (phone, password) => {
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
        status: user.status
      }
    };
  }

  const response = await axios.post(`${API_URL}/auth/login`, { phone, password });
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
        status: newUser.status
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
        status: user.status
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

// Get Statistics (Daily, Weekly, Monthly)
export const getStatisticsApi = async (token) => {
  if (MOCK_MODE) {
    const bookings = getMockBookings();
    const users = getMockUsers();

    // Helper calculations
    const now = new Date();
    
    // Revenue categories
    let dailyRevenue = 0;
    let weeklyRevenue = 0;
    let monthlyRevenue = 0;
    let totalRevenue = 0;

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    bookings.forEach(b => {
      if (b.status === 'confirmed') {
        const bookingDate = new Date(b.createdAt || b.date);
        const diff = now - bookingDate;
        
        totalRevenue += b.servicePrice;
        
        if (diff <= oneDay) {
          dailyRevenue += b.servicePrice;
        }
        if (diff <= oneWeek) {
          weeklyRevenue += b.servicePrice;
        }
        if (diff <= oneMonth) {
          monthlyRevenue += b.servicePrice;
        }
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
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * oneDay);
      const dayName = d.toLocaleDateString('uz-UZ', { weekday: 'short' });
      const dayDateStr = d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'numeric' });
      
      const dayRevenue = bookings
        .filter(b => b.status === 'confirmed' && new Date(b.createdAt || b.date).toDateString() === d.toDateString())
        .reduce((sum, b) => sum + b.servicePrice, 0);

      chartData.push({
        label: `${dayName} (${dayDateStr})`,
        value: dayRevenue
      });
    }

    return {
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      totalRevenue,
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
    
    saveMockUsers(users);
    
    return {
      user: {
        id: users[userIndex].id,
        name: users[userIndex].name,
        phone: users[userIndex].phone,
        telegram: users[userIndex].telegram,
        role: users[userIndex].role,
        status: users[userIndex].status
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

