
// Telegram Bot API integration
// Note: Credentials are hardcoded as per configuration requirements
// For better security in production, consider using environment variables or backend implementation

import { formatPrice } from './format';

const TELEGRAM_BOT_TOKEN = '8598199374:AAEQ98hlQkG3IPtntC5LkqeQ5Pv2h27Yr_U';
const TELEGRAM_CHAT_ID = '-1004413936957';

// Check if credentials are configured
const isTelegramConfigured = () => {
  return TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID;
};

export const sendBookingToTelegram = async (bookingData) => {
  try {
    if (!isTelegramConfigured()) {
      console.warn('Telegram credentials not configured. Set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in .env file');
    }
    
    const message = `
🎉 *Yangi buyurtma!*

👤 *Mijoz:* ${bookingData.name}
📱 *Telefon:* ${bookingData.phone}

💈 *Xizmat:* ${bookingData.service.name}
💰 *Narx:* ${formatPrice(bookingData.service.price)} so'm

📅 *Sana:* ${bookingData.date}
🕐 *Vaqt:* ${bookingData.time}

✅ *Buyurtma tasdiqlandi!*
    `.trim();

    // Send message to Telegram
    console.log('Sending to Telegram:', message);
    
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Telegram error:', error);
    throw error;
  }
};

export const sendPaymentReceiptToTelegram = async (paymentData) => {
  try {
    if (!isTelegramConfigured()) {
      console.warn('Telegram credentials not configured. Set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in .env file');
    }
    
    if (!paymentData.receipt) {
      throw new Error('To\'lov cheki yuklanmagan');
    }
    
    const message = `
🧾 *To'lov cheki*

👤 *Mijoz:* ${paymentData.name}
📱 *Telefon:* ${paymentData.phone}

💈 *Xizmat:* ${paymentData.service.name}
💰 *To'langan summa:* ${formatPrice(paymentData.service.price)} so'm

📅 *Sana:* ${paymentData.date}
🕐 *Vaqt:* ${paymentData.time}

✅ *To'lov muvaffaqiyatli amalga oshirildi!*
🎉 *Buyurtma tasdiqlandi!*

Sizni kutib qolamiz! 💈
    `.trim();

    console.log('Sending receipt to Telegram:', message);
    
    // Send photo with caption
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('caption', message);
    formData.append('parse_mode', 'Markdown');
    formData.append('photo', paymentData.receipt);
    
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Telegram error:', error);
    throw error;
  }
};