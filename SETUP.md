# Web Barber - O'rnatish Bo'yicha Ko'rsatmalar

## Loyihani Ishga Tushirish

Agar siz loyihani birinchi marta ishga tushiryotgan bo'lsangiz yoki `react-icons` kutubxonasi import qilishda xatolik yuz bersa, quyidagi qadamlarni bajaring:

### 1. Bog'liqliklarni O'rnatish

```bash
npm install
```

Bu buyruq barcha zarur kutubxonalarni o'rnatadi, jumladan:
- react-icons
- react
- react-dom
- react-router-dom
- tailwindcss
- va boshqalar

### 2. Ishlab Chiqish Serverini Ishga Tushirish

```bash
npm run dev
```

Brauzerda loyiha ochiladi: http://localhost:5173/

### 3. Production Build Qilish

```bash
npm run build
```

## Tez-Tez Uchraydigan Xatolar

### ❌ "Failed to resolve import 'react-icons/hi'" Xatosi

**Sabab:** `node_modules` papkasi yo'q yoki to'liq emas.

**Yechim:** 
```bash
npm install
```

### ❌ Vite Topilmadi

**Sabab:** Dependencies o'rnatilmagan.

**Yechim:** 
```bash
npm install
npm run dev
```

## Texnologiyalar

- ⚛️ React 19.2.0
- 🎨 Tailwind CSS 4.1.18
- ⚡ Vite 7.2.4
- 🎯 React Router DOM 7.13.0
- 🎨 React Icons 5.5.0

## Yordam

Agar muammolar davom etsa:
1. `node_modules` va `package-lock.json` ni o'chiring
2. Qayta o'rnating: `npm install`
3. Serverni qayta ishga tushiring: `npm run dev`
