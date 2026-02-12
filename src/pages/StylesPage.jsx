import React from 'react';

const StylesPage = () => {
  const barberStyles = [
    {
      id: 1,
      title: "Klassik Soch Kesimi",
      description: "An'anaviy va professional ko'rinish uchun klassik soch kesimi. Rasmiy va kundalik hayot uchun juda mos.",
      image: "/barber/1.png",
      category: "Soch Kesimi"
    },
    {
      id: 2,
      title: "Zamonaviy Fade",
      description: "Yon taraflari qisqa, yuqori qismi uzunroq bo'lgan zamonaviy stil. Yoshlar orasida juda mashhur.",
      image: "/barber/2.png",
      category: "Soch Kesimi"
    },
    {
      id: 3,
      title: "Krem Berish va Stilizatsiya",
      description: "Professional soch kesimi, yuvish va krem bilan stilizatsiya. To'liq parvarish xizmati.",
      image: "/barber/3.png",
      category: "Soch Kesimi"
    },
    {
      id: 4,
      title: "Soqol Tashkil Etish",
      description: "Professional soqol kesish va tashkil etish. Yuz chizig'iga mos ravishda toza va aniq.",
      image: "/barber/4.png",
      category: "Soqol"
    }
  ];

  const hairStyles = [
    {
      id: 1,
      title: "Klassik Pompadour",
      description: "Yuqori qismi hajmli va orqaga taragan zamonaviy klassik stil. Elegant va professional ko'rinish.",
      image: "/styles/1.png",
      category: "Soch Stili"
    },
    {
      id: 2,
      title: "Undercut",
      description: "Yon taraflar juda qisqa, yuqori qismi uzun bo'lgan bold stil. Kontrast va zamonaviy.",
      image: "/styles/2.png",
      category: "Soch Stili"
    },
    {
      id: 3,
      title: "Textured Crop",
      description: "Qisqa va tabiy ko'rinishli, oson parvarish qilinadigan zamonaviy stil.",
      image: "/styles/3.png",
      category: "Soch Stili"
    },
    {
      id: 4,
      title: "Side Part",
      description: "Yon tarafdan bo'lingan klassik stil. Professional va pok ko'rinish beradi.",
      image: "/styles/4.png",
      category: "Soch Stili"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500">
          Soch va Soqol Stillari
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Bizning sartaroshxonamizda mavjud bo'lgan eng mashhur soch kesimi va soqol stillari bilan tanishing
        </p>
      </div>

      {/* Barber Services Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-4xl" role="img" aria-label="Qaychi">✂️</span>
          Sartaroshlik Xizmatlari
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {barberStyles.map((style) => (
            <div
              key={style.id}
              className="group relative bg-zinc-900/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-105"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={style.image}
                  alt={`${style.title} - ${style.description}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-emerald-500/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                    {style.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                  {style.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {style.description}
                </p>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      {/* Hair Styles Section */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-4xl" role="img" aria-label="Soch">💇</span>
          Mashhur Soch Stillari
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hairStyles.map((style) => (
            <div
              key={style.id}
              className="group relative bg-zinc-900/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-105"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={style.image}
                  alt={`Soch stili: ${style.title} - ${style.description}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-emerald-500/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                    {style.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                  {style.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {style.description}
                </p>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <div className="mt-16 p-8 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/30 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          O'zingizga mos stilni tanladingizmi?
        </h3>
        <p className="text-white/70 mb-6">
          Sartaroshxonamizga tashrif buyuring va professional ustalarimiz sizga eng yaxshi stilni tanlab berishadi
        </p>
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
        >
          Buyurtma Qilish
        </a>
      </div>
    </div>
  );
};

export default StylesPage;
