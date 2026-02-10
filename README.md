# Barber Shop - Online Booking System 💈

A modern, responsive barber shop booking system built with React and TailwindCSS. Customers can book appointments, select services, and make payments online. Booking confirmations and payment receipts are automatically sent to Telegram.

## ✨ Features

- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations
- 📅 **Smart Scheduling** - Interactive calendar with available time slots
- 💳 **Payment Processing** - Secure payment form with auto-formatting
- 📱 **Telegram Integration** - Automatic booking confirmations and receipts
- 🌐 **Uzbek Language** - Fully localized for Uzbek-speaking customers
- ✅ **Form Validation** - Real-time validation on all inputs
- 📲 **Auto-formatting** - Phone numbers and card details auto-format
- 🚫 **Smart Availability** - Excludes Sundays and past dates

## 🎬 Demo Screenshots

| Service Selection | Time Selection |
|-------------------|----------------|
| ![Service Selection](https://github.com/user-attachments/assets/4b7ce423-c8ce-4093-abd9-1cecb493ab1a) | ![Time Selection](https://github.com/user-attachments/assets/0e7f7fdd-fdad-4898-8d35-e958610f5112) |

| Personal Info | Payment Form | Success Modal |
|---------------|--------------|---------------|
| ![Personal Info](https://github.com/user-attachments/assets/98ab8dec-ad68-4d82-a670-f10d2dd54933) | ![Payment Form](https://github.com/user-attachments/assets/4f9fef40-5876-46a8-85f8-76ea55678d2c) | ![Success](https://github.com/user-attachments/assets/2df91ce1-a86b-422b-a85b-b8ecd9702b45) |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Telegram bot (for notifications)

### Installation

```bash
# Clone the repository
git clone https://github.com/webdunyosi/barber-shop.git
cd barber-shop

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Telegram credentials
```

### Running the Application

**Important:** This application requires both a frontend and backend server to work properly.

**Option 1: Run both servers together (Recommended)**
```bash
npm run dev:all
```

**Option 2: Run servers separately**

In one terminal, start the backend server:
```bash
npm run server
```
Backend will run on `http://localhost:3001`

In another terminal, start the frontend:
```bash
npm run dev
```
Frontend will be available at `http://localhost:5173`

### Why Two Servers?

The backend server is required to avoid CORS (Cross-Origin Resource Sharing) errors when calling the Telegram Bot API. Telegram doesn't allow direct API calls from browsers for security reasons.

**Architecture:**
```
Browser → Backend Server (port 3001) → Telegram API
                ↓
           Frontend (port 5173)
```

## 🔧 Configuration

### Telegram Bot Setup (Optional)

1. Create a bot via [@BotFather](https://t.me/botfather):
   - Send `/newbot` to BotFather
   - Follow the instructions to get your bot token

2. Get your chat ID:
   - Send a message to [@userinfobot](https://t.me/userinfobot)
   - Copy your chat ID

3. Update `.env` file:
   ```env
   VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
   VITE_TELEGRAM_CHAT_ID=your_chat_id_here
   VITE_API_URL=http://localhost:3001
   ```

4. The Telegram integration is now automatically enabled through the backend server.

### Customize Services

Edit `src/data/barber.json` to customize:
- Services and prices
- Available time slots
- Working days

## 📋 Available Scripts

```bash
# Start both frontend and backend
npm run dev:all

# Start backend server only (port 3001)
npm run server

# Start frontend only (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ServiceSelection.jsx       # Service selection cards
│   ├── TimeSelection.jsx          # Calendar and time slots
│   ├── PersonalInfoForm.jsx       # Customer information form
│   ├── PaymentForm.jsx            # Payment card details
│   └── SuccessModal.jsx           # Success confirmation modal
├── utils/
│   ├── format.js                  # Formatting utilities
│   └── telegram.js                # Frontend Telegram API calls
├── data/
│   └── barber.json                # Services and configuration
├── App.jsx                        # Main application
├── main.jsx                       # Entry point
└── index.css                      # Styles and animations
server.js                           # Backend Express server
```

## 📱 Telegram Messages

The system sends two types of messages:

### Booking Confirmation
```
🎉 *Yangi buyurtma!*

👤 *Mijoz:* Javohir Aliyev
📱 *Telefon:* +998 90 123 45 67

💈 *Xizmat:* Klassik soch olish
💰 *Narx:* 50 000 so'm

📅 *Sana:* 10.02.2026
🕐 *Vaqt:* 10:00

✅ *Buyurtma tasdiqlandi!*
```

### Payment Receipt
```
🧾 *To'lov cheki*

👤 *Mijoz:* Javohir Aliyev
📱 *Telefon:* +998 90 123 45 67

💈 *Xizmat:* Klassik soch olish
💰 *To'langan summa:* 50 000 so'm

💳 *Karta:* **** **** **** 9012

📅 *Sana:* 10.02.2026
🕐 *Vaqt:* 10:00

✅ *To'lov muvaffaqiyatli amalga oshirildi!*
🎉 *Buyurtma tasdiqlandi!*

Sizni kutib qolamiz! 💈
```

## 🛠️ Technologies

- **React 19.2.0** - UI framework
- **TailwindCSS 4.1.18** - Styling
- **Vite 7.2.4** - Build tool
- **Express 4.21.2** - Backend server
- **Node Fetch 3** - HTTP client for backend
- **Telegram Bot API** - Notifications

## 🐛 Troubleshooting

### CORS Error
If you see `"Access to fetch blocked by CORS policy"`:
- Make sure the backend server is running on port 3001
- Verify `VITE_API_URL=http://localhost:3001` in `.env`
- Use `npm run dev:all` to start both servers

### Backend Server Won't Start
- Check if port 3001 is already in use
- Make sure your `.env` file has valid credentials
- Try `npm run server` separately to see error messages

### Telegram Messages Not Sending
- Verify bot token and chat ID in `.env`
- Check backend server logs for errors
- Test the backend endpoint: `curl http://localhost:3001/api/health`

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ Input validation on all forms
- ✅ Card details masked in messages
- ✅ No security vulnerabilities (CodeQL verified)

## 📄 License

MIT License - feel free to use this project for your own barber shop!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ for barbers everywhere