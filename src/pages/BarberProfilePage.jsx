import React from "react"
import barberProfile from "../data/barberProfile.json"

const BarberProfilePage = () => {
  return (
    <div className="min-h-screen w-full lg:w-5/6 ml-auto px-2 md:px-[1%]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section with Image and Basic Info */}
        <div className="relative bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-lg rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          
          <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Image Section */}
            <div className="flex justify-center items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative">
                  <img
                    src={barberProfile.image}
                    alt={barberProfile.name}
                    className="w-full max-w-sm h-auto rounded-2xl object-cover shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  {barberProfile.name}
                </h1>
                <p className="text-xl text-emerald-400 font-semibold">
                  {barberProfile.title}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/80">
                  <span className="text-2xl">💼</span>
                  <span className="text-lg">{barberProfile.experience.specialization}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <span className="text-2xl">📅</span>
                  <span className="text-lg">
                    {barberProfile.experience.years} yillik tajriba ({barberProfile.experience.startYear} yildan beri)
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {barberProfile.stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-emerald-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-zinc-900/50 backdrop-blur-lg rounded-2xl p-8 border border-emerald-500/20 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">👤</span>
            Men haqimda
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            {barberProfile.bio}
          </p>
        </div>

        {/* Achievements Section */}
        <div className="bg-zinc-900/50 backdrop-blur-lg rounded-2xl p-8 border border-emerald-500/20 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            Yutuqlarim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {barberProfile.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="group relative bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20"
              >
                <div className="flex items-start gap-4">
                  <span className="text-5xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {achievement.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-zinc-900/50 backdrop-blur-lg rounded-2xl p-8 border border-emerald-500/20 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="text-4xl">🌐</span>
            Ijtimoiy tarmoqlar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {barberProfile.socialMedia.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20 text-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                <span className="text-5xl mb-3 block">{social.icon}</span>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                  {social.platform}
                </h3>
                <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                  {social.username}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/30 p-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Professional xizmat olishni xohlaysizmi?
          </h3>
          <p className="text-white/70 mb-6 text-lg">
            Bugun buyurtma qiling va sifatli sartaroshlik xizmatlaridan bahramand bo'ling
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 text-lg"
          >
            Buyurtma Qilish
          </a>
        </div>
      </div>
    </div>
  )
}

export default BarberProfilePage
