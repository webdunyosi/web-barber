# Backend Developer Handover Prompt (MERN Stack)

This prompt contains all requirements, database schemas, API endpoints, middleware rules, and Telegram bot notification flows. Copy and paste this prompt to your backend agent or developer to build the backend server.

---

## Technical Stack & Deployment Goal
- **Framework**: Node.js with Express (JavaScript)
- **Database**: MongoDB Atlas (managed via Mongoose)
- **File Storage**: Cloudinary (for storing payment receipt photos) or direct local uploads if requested.
- **Hosting**: Render.com (free/paid tier web service)
- **Authorization**: JSON Web Tokens (JWT) for secure user sessions

---

## Environment Variables (.env)
The backend must support the following environment variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
TELEGRAM_BOT_TOKEN=8598199374:AAF2PC8uHwutdUg0VU9Q8jeypNzV3egcOXk
TELEGRAM_CHAT_ID=5414733748
```

---

## 1. Mongoose Database Schemas

### User Schema (`models/User.js`)
```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true }, // Format stored: "+998 90 123 45 67" (normalized)
  telegram: { type: String, default: '' }, // e.g. "jasur_ali" without '@'
  password: { type: String, required: true }, // Hashed using bcrypt
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
```

### Appointment Schema (`models/Appointment.js`)
```javascript
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  telegram_user: { type: String, default: '' },
  serviceName: { type: String, required: true },
  servicePrice: { type: Number, required: true },
  date: { type: String, required: true }, // Format: "DD.MM.YYYY" (e.g. "06.06.2026")
  time: { type: String, required: true }, // Format: "HH:MM" (e.g. "11:30")
  status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
  receipt: { type: String, required: true }, // Cloudinary URL to payment check image
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
```

---

## 2. API Endpoints Specification

### Authentication Endpoints (`/api/auth`)

#### 1. POST `/api/auth/register` (Register User)
- **Request Body**: `{ name, phone, telegram, password }`
- **Actions**:
  - Normalize phone number (strip spacing/characters to verify uniqueness).
  - Verify if phone number is already registered. If yes, return `400` status with error message.
  - Hash password using `bcrypt` (10 rounds).
  - Save new user.
  - Send Telegram notification:
    - **Endpoint**: `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/sendMessage`
    - **Payload**:
      ```markdown
      👤 *Yangi Mijoz Ro'yxatdan O'tdi!*

      📝 *Ismi:* ${user.name}
      📱 *Telefon:* ${user.phone}
      ✈️ *Telegram:* @${user.telegram || 'kiritilmagan'}
      📅 *Sana:* ${new Date().toLocaleDateString('uz-UZ')}
      ```
  - Sign a JWT token (e.g., expires in 30 days) and return `{ token, user: { id, name, phone, telegram, role, status } }`.

#### 2. POST `/api/auth/login` (Login User)
- **Request Body**: `{ phone, password }`
- **Actions**:
  - Find user by phone.
  - If user not found or password incorrect, return `401` status.
  - Check if user status is `'blocked'`. If yes, return `403` status with error message: `"Sizning profilingiz bloklangan! Sartarosh bilan bog'laning."`.
  - Sign a JWT token and return `{ token, user: { id, name, phone, telegram, role, status } }`.

#### 3. GET `/api/auth/me` (Get Profile)
- **Headers**: `Authorization: Bearer <token>`
- **Actions**:
  - Decode JWT. Find user.
  - If user is blocked, return `403` status.
  - Return user details.

---

### Booking Endpoints (`/api/appointments`)

#### 1. GET `/api/appointments/booked` (Get booked slots)
- **Query Params**: `?date=DD.MM.YYYY`
- **Actions**:
  - Query appointments where `date === req.query.date` AND status is NOT `'rejected'` (i.e. status is either `'confirmed'` or `'pending'`).
  - Extract and return array of booked times, e.g. `['11:00', '14:30']`.

#### 2. POST `/api/appointments` (Create Booking)
- **Headers**: `Authorization: Bearer <token>`, multipart/form-data
- **Body Fields**: `name`, `phone`, `telegram_user`, `serviceName`, `servicePrice`, `date`, `time`
- **Files**: `receipt` (Image File)
- **Actions**:
  - Parse form data. Validate inputs.
  - Upload `receipt` image file to Cloudinary. Obtain image URL.
  - Create and save the new `Appointment` linked to the authenticated user's ID.
  - Send Telegram notification with photo:
    - **Endpoint**: `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/sendPhoto`
    - **Payload**: `chat_id`, `photo` (URL/stream), `caption` (formatted details):
      ```markdown
      🧾 *Yangi To'lov & Buyurtma!*

      👤 *Mijoz:* ${name}
      📱 *Telefon:* ${phone}
      📱 *Telegram:* @${telegram_user || 'mavjud emas'}

      💈 *Xizmat:* ${serviceName}
      💰 *Narx:* ${servicePrice.toLocaleString()} so'm
      📅 *Sana:* ${date}
      🕐 *Vaqt:* ${time}

      ⚠️ _To'lov chekini tasdiqlash uchun admin panelga kiring!_
      ```
  - Return message and the created appointment.

---

### Admin Endpoints (`/api/admin`)
*All admin endpoints must require `jwtAuth` middleware and user's role MUST be `'admin'`.*

#### 1. GET `/api/admin/users` (List Users)
- **Actions**:
  - Return all users where `role === 'user'`.

#### 2. PUT `/api/admin/users/:id/block` (Block/Unblock User)
- **Request Body**: `{ isBlocked }`
- **Actions**:
  - Set user's status to `'blocked'` or `'active'` based on `isBlocked`.
  - Send Telegram notification:
    ```markdown
    🔒 *Foydalanuvchi holati o'zgardi!*
    
    👤 *Foydalanuvchi:* ${user.name}
    📱 *Telefon:* ${user.phone}
    🛑 *Holati:* ${isBlocked ? 'BLOKLANDI 🚫' : 'FAOL QILINDI ✅'}
    ```
  - Return success message.

#### 3. DELETE `/api/admin/users/:id` (Delete User)
- **Actions**:
  - Delete user record from database.
  - Send Telegram notification:
    ```markdown
    🗑 *Foydalanuvchi o'chirildi!*
    
    👤 *Ismi:* ${user.name}
    📱 *Telefon:* ${user.phone}
    ```
  - Return success message.

#### 4. GET `/api/admin/bookings` (List Bookings)
- **Actions**:
  - Return all bookings in database.

#### 5. PUT `/api/admin/bookings/:id` (Confirm/Reject Booking)
- **Request Body**: `{ status }` (enum: `'confirmed'`, `'rejected'`)
- **Actions**:
  - Update appointment status.
  - Send Telegram notification:
    ```markdown
    📢 *Buyurtma holati o'zgardi!*

    👤 *Mijoz:* ${booking.name}
    📱 *Telefon:* ${booking.phone}
    💈 *Xizmat:* ${booking.serviceName}
    📅 *Sana/Vaqt:* ${booking.date} soat ${booking.time}
    🛑 *Holat:* *${status === 'confirmed' ? 'TASDIQLANDI ✅' : 'RAD ETILDI ❌'}*
    ```
  - Return success message.

#### 6. GET `/api/admin/statistics` (Financial & Business Stats)
- **Actions**:
  - Calculate revenues (only sum `servicePrice` where status is `'confirmed'`):
    - **Daily revenue**: appointments within the last 24 hours.
    - **Weekly revenue**: appointments within the last 7 days.
    - **Monthly revenue**: appointments within the last 30 days.
    - **Total revenue**: all-time sum.
  - Count:
    - Jami mijozlar (`totalUsers`), blocked users, total bookings, pending/confirmed bookings.
  - Popular services array: group by `serviceName`, aggregate booking count and total confirmed revenue, sorted by count descending.
  - 7-day chart data array:
    - Return last 7 dates (`label`: Short day name & date) and corresponding total confirmed revenue (`value`) for each date.

---

## 3. Seed script (Optional but useful)
It is recommended to check if there is an admin user. If not, create a default admin user on startup:
- Name: `Alimardon (Admin)`
- Phone: `+998 99 999 99 99`
- Password: `admin` (hashed)
- Role: `admin`
- Status: `active`
