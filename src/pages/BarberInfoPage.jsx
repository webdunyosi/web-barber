import React from 'react';

const BarberInfoPage = () => {
  const barberInfo = {
    name: "Otabek Rahimov",
    title: "Professional Sartarosh",
    experience: "12+ yil",
    image: "/logo.png",
    bio: "Men 12 yildan ortiq vaqt davomida sartarosh sohasida faoliyat yuritib kelmoqdaman. Har bir mijozga individual yondashuv va yuqori sifatli xizmat ko'rsatish - mening asosiy tamoyilim. Zamonaviy texnikalar bilan birga an'anaviy usullarni ham qo'llayman.",
    achievements: [
      {
        year: "2023",
        title: "Yilning eng yaxshi sartaroshi",
        description: "O'zbekiston Sartaroshlar Assotsiatsiyasi tomonidan berilgan mukofot"
      },
      {
        year: "2022",
        title: "Xalqaro sertifikat",
        description: "Yevropa sartarosh akademiyasidan olgan professional sertifikat"
      },
      {
        year: "2021",
        title: "1000+ mijozlar",
        description: "Bir yil ichida 1000 dan ortiq mamnun mijozlar"
      },
      {
        year: "2020",
        title: "O'z biznesini ochish",
        description: "Web Barber sartaroshxonasining rasmiy ochilishi"
      }
    ],
    skills: [
      { name: "Klassik soch olish", level: 100 },
      { name: "Zamonaviy stillar", level: 95 },
      { name: "Soqol olish", level: 98 },
      { name: "Soch bo'yash", level: 90 },
      { name: "Fade texnikasi", level: 97 }
    ],
    contacts: {
      phone: "+998 90 123 45 67",
      telegram: "@webbarber_uz",
      instagram: "@webbarber.uz",
      email: "info@webbarber.uz",
      address: "Toshkent sh., Chilonzor tumani, 12-kvartal"
    },
    workingHours: [
      { day: "Dushanba - Shanba", hours: "09:00 - 19:00" },
      { day: "Yakshanba", hours: "Dam olish kuni" }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="mb-10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
          {/* Photo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-emerald-500 shadow-2xl shadow-emerald-500/50">
                <img
                  src={barberInfo.image}
                  alt={barberInfo.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="256" height="256"%3E%3Crect width="256" height="256" fill="%2318181b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="60" fill="%2310b981"%3E👨‍💼%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-xl font-bold">
                {barberInfo.experience}
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {barberInfo.name}
            </h1>
            <p className="text-2xl text-emerald-400 mb-6">
              {barberInfo.title}
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              {barberInfo.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-10 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span>⚡</span>
          Professional Ko'nikmalar
        </h2>
        <div className="space-y-4">
          {barberInfo.skills.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <span className="text-white font-semibold">{skill.name}</span>
                <span className="text-emerald-400 font-bold">{skill.level}%</span>
              </div>
              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-emerald-500/50"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-10 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span>🏆</span>
          Yutuqlar va Sertifikatlar
        </h2>
        <div className="space-y-4">
          {barberInfo.achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex gap-4 p-5 bg-zinc-800/50 rounded-xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-20 h-20 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/50">
                <span className="text-2xl font-bold text-emerald-400">{achievement.year}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  {achievement.title}
                </h3>
                <p className="text-gray-400">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Details */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span>📱</span>
            Bog'lanish
          </h2>
          <div className="space-y-4">
            <a
              href={`tel:${barberInfo.contacts.phone}`}
              className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl hover:bg-emerald-500/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-all duration-300">
                <svg className="w-6 h-6 text-emerald-400 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Telefon</p>
                <p className="text-white font-semibold">{barberInfo.contacts.phone}</p>
              </div>
            </a>

            <a
              href={`https://t.me/${barberInfo.contacts.telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl hover:bg-emerald-500/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300">
                <svg className="w-6 h-6 text-blue-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Telegram</p>
                <p className="text-white font-semibold">{barberInfo.contacts.telegram}</p>
              </div>
            </a>

            <a
              href={`https://instagram.com/${barberInfo.contacts.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl hover:bg-emerald-500/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                <svg className="w-6 h-6 text-pink-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Instagram</p>
                <p className="text-white font-semibold">{barberInfo.contacts.instagram}</p>
              </div>
            </a>

            <a
              href={`mailto:${barberInfo.contacts.email}`}
              className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl hover:bg-emerald-500/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-all duration-300">
                <svg className="w-6 h-6 text-emerald-400 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-white font-semibold">{barberInfo.contacts.email}</p>
              </div>
            </a>
          </div>
        </div>

        {/* Working Hours and Location */}
        <div className="space-y-6">
          {/* Working Hours */}
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>🕐</span>
              Ish vaqti
            </h2>
            <div className="space-y-3">
              {barberInfo.workingHours.map((schedule, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-xl"
                >
                  <span className="text-white font-semibold">{schedule.day}</span>
                  <span className="text-emerald-400 font-bold">{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span>📍</span>
              Manzil
            </h2>
            <p className="text-white text-lg">
              {barberInfo.contacts.address}
            </p>
            <button className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-emerald-500/50">
              Xaritada ko'rish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberInfoPage;
