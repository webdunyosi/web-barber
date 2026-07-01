import React from "react"
import {
  FaInstagram, FaTelegramPlane, FaFacebook, FaYoutube,
  FaCalendarAlt, FaUser, FaGlobe, FaSignInAlt, FaLock,
} from "react-icons/fa"
import { useBarber } from "../contexts/BarberContext"
import { useAuth } from "../hooks/useAuth"
import AuthModal from "../components/features/auth/AuthModal"

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
  const { activeBarber } = useBarber();
  const { isAuthenticated } = useAuth();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  if (!isAuthenticated) {
    return (
      <div className="w-full lg:w-5/6 ml-auto min-h-[70vh] flex flex-col items-center justify-center px-0 sm:px-4 py-12 text-white text-center animate-fadeIn">
        <div className="max-w-md w-full bg-zinc-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mx-auto text-zinc-400">
            <FaLock size={24} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sartarosh profili qulflangan</h2>
          <p className="text-gray-400 text-sm mb-6 font-medium">
            Sartarosh ma'lumotlarini ko'rish uchun iltimos tizimga kiring.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-linear-to-br from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-emerald-500/30 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] border border-emerald-400 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <FaSignInAlt size={16} />
            <span>Tizimga kirish</span>
          </button>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  if (!activeBarber) {
    return (
      <div className="min-h-screen w-full lg:w-5/6 ml-auto flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500/10 border-t-emerald-500 animate-spin"></div>
      </div>
    );
  }

  // Construct stats dynamically using experience fields
  const stats = [
    {
      id: 1,
      value: `${activeBarber.experienceYears || 15}+`,
      label: "Yillik tajriba"
    },
    {
      id: 4,
      value: "100%",
      label: "Sifat kafolati"
    }
  ];

  // Construct social media links dynamically from activeBarber fields
  const socialMedia = [
    {
      id: 1,
      platform: "Instagram",
      icon: "FaInstagram",
      url: activeBarber.instagram ? `https://instagram.com/${activeBarber.instagram}` : '',
      username: activeBarber.instagram ? `@${activeBarber.instagram}` : '',
      color: "from-pink-500 to-purple-600"
    },
    {
      id: 2,
      platform: "Telegram",
      icon: "FaTelegramPlane",
      url: activeBarber.telegram ? `https://t.me/${activeBarber.telegram}` : '',
      username: activeBarber.telegram ? `@${activeBarber.telegram}` : '',
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 3,
      platform: "Facebook",
      icon: "FaFacebook",
      url: activeBarber.facebook ? `https://facebook.com/${activeBarber.facebook}` : '',
      username: activeBarber.facebook ? `@${activeBarber.facebook}` : '',
      color: "from-blue-600 to-blue-800"
    },
    {
      id: 4,
      platform: "YouTube",
      icon: "FaYoutube",
      url: activeBarber.youtube ? `https://youtube.com/@${activeBarber.youtube}` : '',
      username: activeBarber.youtube ? `@${activeBarber.youtube}` : '',
      color: "from-red-500 to-red-700"
    }
  ].filter(social => social.url !== '');

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
                <div className="relative w-full max-w-sm h-64 sm:h-80 overflow-hidden rounded-2xl bg-zinc-900">
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-2xl flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-500/10 border-t-emerald-500 animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={activeBarber.avatar || "/avatar/men.png"}
                    alt={activeBarber.name}
                    className={`w-full h-full rounded-2xl object-cover shadow-2xl transition-all duration-500 ${
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
                  {activeBarber.name}
                </h1>
                <p className="text-lg md:text-xl text-emerald-400 font-semibold">
                  Professional Barber
                </p>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2.5 md:gap-3 text-white/80">
                  <span className="text-emerald-400"><FaCalendarAlt size={20} /></span>
                  <span className="text-sm sm:text-base md:text-lg">
                    {activeBarber.experienceYears || 15} yillik tajriba ({activeBarber.experienceStartYear || 2011} yildan beri)
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4 md:gap-4 md:mt-6">
                {stats.map((stat) => (
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
            {activeBarber.description || "Men haqimda ma'lumot kiritilmagan."}
          </p>
        </div>

        {/* Social Media Section */}
        {socialMedia.length > 0 && (
          <div className="bg-zinc-900/50 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8 border border-emerald-500/20 shadow-xl">
            <h2 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
              <span className="text-emerald-400"><FaGlobe className="w-5 h-5 md:w-9 md:h-9" /></span>
              Ijtimoiy tarmoqlar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {socialMedia.map((social) => (
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
        )}
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}

export default BarberProfilePage