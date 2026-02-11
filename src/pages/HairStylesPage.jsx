import React from 'react';
import { formatCurrency } from '../utils/format';

const HairStylesPage = () => {
  const hairStyles = [
    {
      id: 1,
      name: "Klassik soch olish",
      description: "An'anaviy klassik soch olish. Barcha yosh toifasi uchun mos.",
      price: 50000,
      duration: "30 daqiqa",
      image: "/styles/1.png",
      popular: true
    },
    {
      id: 2,
      name: "Soqol olish",
      description: "Professional soqol olish va parvarish qilish xizmati.",
      price: 30000,
      duration: "20 daqiqa",
      image: "/styles/2.png",
      popular: false
    },
    {
      id: 3,
      name: "Soch + Soqol",
      description: "To'liq xizmat: soch olish va soqol tartibga solish.",
      price: 70000,
      duration: "45 daqiqa",
      image: "/styles/3.png",
      popular: true
    },
    {
      id: 4,
      name: "Yuz massaji",
      description: "Dam olish va terini yangilash uchun yuz massaji.",
      price: 40000,
      duration: "30 daqiqa",
      image: "/styles/4.png",
      popular: false
    },
    {
      id: 5,
      name: "Zamonaviy stil",
      description: "Eng so'nggi trendlarga muvofiq zamonaviy soch turmagi.",
      price: 60000,
      duration: "40 daqiqa",
      image: "/styles/1.png",
      popular: true
    },
    {
      id: 6,
      name: "Bolalar soch olish",
      description: "14 yoshgacha bo'lgan bolalar uchun maxsus narx.",
      price: 35000,
      duration: "25 daqiqa",
      image: "/styles/2.png",
      popular: false
    },
    {
      id: 7,
      name: "Fade soch olish",
      description: "Gradient fade uslubida professional soch olish.",
      price: 55000,
      duration: "35 daqiqa",
      image: "/styles/3.png",
      popular: true
    },
    {
      id: 8,
      name: "Soch bo'yash",
      description: "Professional soch bo'yash xizmati turli ranglar bilan.",
      price: 80000,
      duration: "60 daqiqa",
      image: "/styles/4.png",
      popular: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          ✂️ Soch Stillari va Narxlar
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Bizda turli xil soch stillari mavjud. Har bir mijoz uchun maxsus yondashuvimiz bor.
        </p>
      </div>

      {/* Styles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hairStyles.map((style) => (
          <div
            key={style.id}
            className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02]"
          >
            {/* Popular Badge */}
            {style.popular && (
              <div className="absolute top-4 right-4 z-10 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                ⭐ Mashhur
              </div>
            )}

            {/* Image */}
            <div className="relative h-64 overflow-hidden bg-zinc-800">
              <img
                src={style.image}
                alt={style.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%2318181b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%2310b981"%3E✂️ Soch stili%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {style.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {style.description}
              </p>

              {/* Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{style.duration}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between border-t border-zinc-700 pt-4">
                <span className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(style.price)}
                </span>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-emerald-500/50">
                  Band qilish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-xl font-bold text-white mb-2">Sifatli Xizmat</h3>
            <p className="text-gray-400">Har bir mijoz uchun individual yondashuv</p>
          </div>
          <div>
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Tez Xizmat</h3>
            <p className="text-gray-400">Vaqtingizni tejab, sifatli natija</p>
          </div>
          <div>
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-xl font-bold text-white mb-2">Qulay Narx</h3>
            <p className="text-gray-400">Sifat va narxning eng yaxshi nisbati</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HairStylesPage;
