import React from "react"
import { Link } from "react-router-dom"
import barberStyles from "../data/barberStyles.json"
import hairStyles from "../data/hairStyles.json"

const StylesPage = () => {
  return (
    <div className="min-h-screen w-full lg:w-5/6 ml-auto px-2 md:px-[1%]">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text bg-linear-to-r from-emerald-400 to-green-500">
          Soch va Soqol Stillari
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Bizning sartaroshxonamizda mavjud bo'lgan eng mashhur soch kesimi va
          soqol stillari bilan tanishing
        </p>
      </div>

      {/* Barber Services Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-4xl" role="img" aria-label="Qaychi">
            ✂️
          </span>
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
                <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

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
              <div className="absolute inset-0 bg-linear-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      {/* Hair Styles Section */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-4xl" role="img" aria-label="Soch">
            💇
          </span>
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
                <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

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
              <div className="absolute inset-0 bg-linear-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <div className="mt-16 p-8 bg-linear-to-br from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/30 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          O'zingizga mos stilni tanladingizmi?
        </h3>
        <p className="text-white/70 mb-6">
          Sartaroshxonamizga tashrif buyuring va professional ustalarimiz sizga
          eng yaxshi stilni tanlab berishadi
        </p>
        <Link
          to="/"
          className="inline-block bg-linear-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
        >
          Buyurtma Qilish
        </Link>
      </div>
    </div>
  )
}

export default StylesPage
