import React from "react"
import {
  FaTrophy, FaStar, FaGraduationCap, FaUsers,
  FaInstagram, FaTelegramPlane, FaFacebook, FaYoutube,
  FaBriefcase, FaCalendarAlt, FaUser, FaGlobe,
} from "react-icons/fa"
import barberProfile from "../data/barberProfile.json"

const getAchievementIcon = (iconName, className) => {
  const icons = {
    FaTrophy: FaTrophy,
    FaStar: FaStar,
    FaGraduationCap: FaGraduationCap,
    FaUsers: FaUsers
  };
  const IconComponent = icons[iconName] || FaTrophy;
  return <IconComponent className={className} />;
}

const getSocialIcon = (iconName, className) => {
  const icons = {
    FaInstagram: FaInstagram,
    FaTelegramPlane: FaTelegramPlane,
    FaFacebook: FaFacebook,
    FaYoutube: FaYoutube
  };
  const IconComponent = icons[iconName] || FaInstagram;
  return <IconComponent className={className} />;
}

const BarberProfilePage = () => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <div className="min-h-screen w-full lg:w-5/6 ml-auto px-0 sm:px-4 pb-4 md:pb-8 pt-4">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-8">
        {/* Header Section with Image and Basic Info */}
        <div className="relative bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-lg rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          
          <div className="relative grid md:grid-cols-2 gap-4 md:gap-8 p-4 sm:p-6 md:p-12">
            {/* Image Section */}
            <div className="flex justify-center items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-zinc-900">
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-2xl flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-500/10 border-t-emerald-500 animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={barberProfile.image}
                    alt={barberProfile.name}
                    className={`w-full h-auto rounded-2xl object-cover shadow-2xl transition-all duration-500 ${
                      imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-center space-y-4 md:space-y-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  {barberProfile.name}
                </h1>
                <p className="text-lg md:text-xl text-emerald-400 font-semibold">
                  {barberProfile.title}
                </p>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2.5 md:gap-3 text-white/80">
                  <span className="text-emerald-400"><FaBriefcase size={20} /></span>
                  <span className="text-sm sm:text-base md:text-lg">{barberProfile.experience.specialization}</span>
                </div>
                <div className="flex items-center gap-2.5 md:gap-3 text-white/80">
                  <span className="text-emerald-400"><FaCalendarAlt size={20} /></span>
                  <span className="text-sm sm:text-base md:text-lg">
                    {barberProfile.experience.years} yillik tajriba ({barberProfile.experience.startYear} yildan beri)
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4 md:gap-4 md:mt-6">
                {barberProfile.stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-xl md:text-3xl font-bold text-emerald-400">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-zinc-900/50 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8 border border-emerald-500/20 shadow-xl">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-6 flex items-center gap-2 md:gap-3">
            <span className="text-emerald-400"><FaUser className="w-5 h-5 md:w-9 md:h-9" /></span>
            Men haqimda
          </h2>
          <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed">
            {barberProfile.bio}
          </p>
        </div>

        {/* Achievements Section */}
        <div className="bg-zinc-900/50 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8 border border-emerald-500/20 shadow-xl">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
            <span className="text-emerald-400"><FaTrophy className="w-5 h-5 md:w-9 md:h-9" /></span>
            Yutuqlarim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            {barberProfile.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="group relative bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <span className="text-emerald-400 shrink-0">{getAchievementIcon(achievement.icon, "w-8 h-8 md:w-12 md:h-12 shrink-0")}</span>
                  <div className="flex-1">
                    <h3 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2 group-hover:text-emerald-400 transition-colors">
                      {achievement.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-white/60 leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-zinc-900/50 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8 border border-emerald-500/20 shadow-xl">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
            <span className="text-emerald-400"><FaGlobe className="w-5 h-5 md:w-9 md:h-9" /></span>
            Ijtimoiy tarmoqlar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {barberProfile.socialMedia.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-emerald-500/10 text-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                <span className="mb-2 flex justify-center text-white">{getSocialIcon(social.icon, "w-6 h-6 md:w-12 md:h-12 mx-auto")}</span>
                <h3 className="text-sm md:text-lg font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors">
                  {social.platform}
                </h3>
                <p className="text-[11px] md:text-sm text-white/60 group-hover:text-white/80 transition-colors">
                  {social.username}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/30 p-5 md:p-8 text-center">
          <h3 className="text-lg md:text-3xl font-bold text-white mb-2">
            Professional xizmat olishni xohlaysizmi?
          </h3>
          <p className="text-white/70 mb-4 text-xs sm:text-sm md:text-lg">
            Bugun buyurtma qiling va sifatli sartaroshlik xizmatlaridan bahramand bo'ling
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 text-sm md:text-lg"
          >
            Buyurtma Qilish
          </a>
        </div>
      </div>
    </div>
  )
}

export default BarberProfilePage