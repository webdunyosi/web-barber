# Barber Shop - Online Booking System 💈

A modern, responsive barber shop booking system built with React and TailwindCSS. Customers can book appointments, select services, and make payments online. Booking confirmations and payment receipts are automatically sent to Telegram.

## 🌐 Live Demo

**[View Live Demo →](https://web-barber-three.vercel.app/)**

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

### Installation

```bash
# Clone the repository
git clone https://github.com/webdunyosi/barber-shop.git
cd barber-shop

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔧 Configuration

The Telegram bot is already configured and will send booking confirmations and payment receipts automatically.

### Customize Services

Edit `src/data/barber.json` to customize:
- Services and prices
- Available time slots
- Working days

## 📋 Available Scripts

```bash
# Development server
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
│   └── telegram.js                # Telegram API integration
├── data/
│   └── barber.json                # Services and configuration
├── App.jsx                        # Main application
├── main.jsx                       # Entry point
└── index.css                      # Styles and animations
```

## 📱 Telegram Messages

The system sends two types of messages:

### Booking Confirmation
```
🎉 *Yangi buyurtma!*

👤 *Mijoz:* Javohir Aliyev
📱 *Telefon:* +998 90 123 45 67

💈 *Xizmat:* Soch olish
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

💈 *Xizmat:* Soch olish
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
- **Telegram Bot API** - Notifications

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