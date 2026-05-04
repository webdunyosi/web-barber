// src/utils/api.js
import axios from 'axios';

const API_URL = 'https://web-barber-backend.onrender.com/api';

// 1. Ma'lum bir sanadagi band qilingan vaqtlarni olish
export const getBookedTimes = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/appointments/booked`, { params: { date } });
    return response.data; // ['10:30', '15:00', ...] kabi array qaytadi
  } catch (error) {
    console.error("Vaqtlarni olishda xato:", error);
    return [];
  }
};

// 2. Buyurtmani va rasmni backendga yuborish
export const submitBooking = async (bookingInfo, paymentData) => {
  const formData = new FormData();
  formData.append('name', bookingInfo.name);
  formData.append('phone', bookingInfo.phone);
  formData.append('telegram_user', bookingInfo.telegram_user || '');
  formData.append('serviceName', bookingInfo.service.name);
  formData.append('servicePrice', bookingInfo.service.price);
  formData.append('date', bookingInfo.date);
  formData.append('time', bookingInfo.time);
  
  if (paymentData.receipt) {
    formData.append('receipt', paymentData.receipt); 
  } else {
    throw new Error("To'lov cheki yuklanmagan!");
  }

  const response = await axios.post(`${API_URL}/appointments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data;
};