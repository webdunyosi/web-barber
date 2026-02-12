import React, { useState } from "react"
import { Link } from "react-router-dom"
import barberStyles from "../data/barberStyles.json"
import hairStyles from "../data/hairStyles.json"

const StylesPage = () => {
  const [activeTab, setActiveTab] = useState("soch")

  // Separate styles by category
  const sochStyles = [
    ...barberStyles.filter((style) => style.category === "Soch Kesimi").map(s => ({...s, id: `barber-${s.id}`})),
    ...hairStyles.map(s => ({...s, id: `hair-${s.id}`})),
  ]
  const soqolStyles = barberStyles.filter(
    (style) => style.category === "Soqol"
  ).map(s => ({...s, id: `barber-soqol-${s.id}`}))

  const renderStyleCard = (style) => (
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
  )

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

      {/* Modern Tabs */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 bg-zinc-900/30 backdrop-blur-lg p-2 rounded-2xl border border-emerald-500/20 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("soch")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "soch"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/50 scale-105"
                : "text-white/60 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <span className="text-2xl" role="img" aria-label="Soch">
              💇
            </span>
            <span className="text-sm sm:text-base">Soch Stillari</span>
          </button>
          <button
            onClick={() => setActiveTab("soqol")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "soqol"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/50 scale-105"
                : "text-white/60 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <span className="text-2xl" role="img" aria-label="Soqol">
              🧔
            </span>
            <span className="text-sm sm:text-base">Soqol Stillari</span>
          </button>
        </div>
      </div>

      {/* Tab Content with Animation */}
      <div className="relative">
        {activeTab === "soch" && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-4xl" role="img" aria-label="Soch">
                💇
              </span>
              Soch Stillari
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sochStyles.map(renderStyleCard)}
            </div>
          </div>
        )}

        {activeTab === "soqol" && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-4xl" role="img" aria-label="Soqol">
                🧔
              </span>
              Soqol Stillari
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {soqolStyles.map(renderStyleCard)}
            </div>
          </div>
        )}
      </div>

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