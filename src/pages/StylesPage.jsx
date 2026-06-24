import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  FaCut, FaUserAlt, FaPlay, FaTimes, FaArrowRight, FaMagic 
} from "react-icons/fa"
import barberStyles from "../data/barberStyles.json"
import hairStyles from "../data/hairStyles.json"

const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  let videoId = null;
  if (url.includes('/embed/')) {
    const match = url.match(/\/embed\/([^/?]+)/);
    if (match) videoId = match[1];
  } else if (url.includes('watch?v=')) {
    const match = url.match(/v=([^&]+)/);
    if (match) videoId = match[1];
  } else if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([^/?]+)/);
    if (match) videoId = match[1];
  }
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
};

const StylesPage = () => {
  const [activeTab, setActiveTab] = useState("soch")
  const [loadedImages, setLoadedImages] = useState({})
  
  // Track which card is playing video
  const [playingVideoId, setPlayingVideoId] = useState(null)
  const [isVideoLoading, setIsVideoLoading] = useState(false)

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }))
  }

  // Separate styles by category and build unique IDs
  const sochStyles = [
    ...barberStyles.filter((style) => style.category === "Soch Kesimi").map(s => ({...s, id: `barber-${s.id}`})),
    ...hairStyles.map(s => ({...s, id: `hair-${s.id}`})),
  ]
  const soqolStyles = barberStyles.filter(
    (style) => style.category === "Soqol"
  ).map(s => ({...s, id: `barber-soqol-${s.id}`}))

  const currentStyles = activeTab === "soch" ? sochStyles : soqolStyles

  // Reset playing video when switching tabs
  useEffect(() => {
    setPlayingVideoId(null)
    setIsVideoLoading(false)
  }, [activeTab])

  const renderStyleCard = (style) => {
    const isPlaying = playingVideoId === style.id;

    return (
      <div
        key={style.id}
        className="group relative flex flex-col bg-zinc-900/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:scale-[1.01]"
      >
        {/* Media (Image / YouTube Embed) Area */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
          {isPlaying && style.video ? (
            <>
              <iframe
                src={style.video.includes('?') ? `${style.video}&autoplay=1` : `${style.video}?autoplay=1`}
                title={style.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full rounded-t-2xl"
                onLoad={() => setIsVideoLoading(false)}
              ></iframe>
              {isVideoLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm z-20 animate-fadeIn">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500/10 border-t-emerald-500 animate-spin"></div>
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 animate-pulse"></div>
                  </div>
                  <span className="text-[10px] tracking-widest text-emerald-400 font-extrabold mt-3 animate-pulse uppercase">
                    Video yuklanmoqda...
                  </span>
                </div>
              )}
              {/* Stop Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setPlayingVideoId(null)
                  setIsVideoLoading(false)
                }}
                className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/85 hover:bg-black text-white border border-white/10 transition-colors shadow-lg cursor-pointer"
                title="Videoni yopish"
              >
                <FaTimes size={11} />
              </button>
            </>
          ) : (
            <div 
              onClick={() => {
                if (style.video) {
                  setPlayingVideoId(style.id)
                  setIsVideoLoading(true)
                }
              }}
              className={`w-full h-full cursor-pointer relative ${style.video ? 'group/media' : ''}`}
            >
              {!loadedImages[style.id] && (
                <div className="absolute inset-0 bg-zinc-800/80 animate-pulse flex items-center justify-center z-10">
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-500/10 border-t-emerald-500 animate-spin"></div>
                </div>
              )}

              {/* Cover Image */}
              {(getYouTubeThumbnail(style.video) || style.image) ? (
                <img
                  src={getYouTubeThumbnail(style.video) || style.image}
                  alt={style.title}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    loadedImages[style.id] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad(style.id)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                  <FaUserAlt size={36} className="text-emerald-400/50 mb-2" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

              {/* Glowing Play Icon Overlay */}
              {style.video && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 scale-90 group-hover/media:scale-100 group-hover/media:bg-emerald-400 transition-all duration-300">
                    <FaPlay size={15} className="ml-1 text-white" />
                  </div>
                </div>
              )}

              {/* Category Badge overlay */}
              <div className="absolute top-3 right-3 z-20">
                <span className="px-2.5 py-0.5 bg-emerald-500 text-white text-[10px] font-extrabold rounded-full shadow-md">
                  {style.category}
                </span>
              </div>
              {/* "Coming Soon" badge for cards without video */}
              {!style.video && (
                <div className="absolute bottom-3 left-3 z-20">
                  <span className="px-2.5 py-1 bg-zinc-800/90 text-zinc-400 text-[9px] font-bold rounded-full border border-white/10 backdrop-blur-sm">
                    🎬 Video tez kunda
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-emerald-400 transition-colors duration-300">
              {style.title}
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
              {style.description}
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            {/* Quick Link Button to home page for booking */}
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-800/80 hover:bg-emerald-600 hover:text-white border border-white/10 hover:border-emerald-400 text-emerald-400 py-2.5 px-4 rounded-xl font-bold transition-all duration-300 text-xs active:scale-[0.98]"
            >
              <span>Ushbu stilga yozilish</span>
              <FaArrowRight size={10} className="animate-pulse" />
            </Link>
          </div>
        </div>
        
        {/* Bottom indicator border line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-linear-to-r from-emerald-500 to-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full lg:w-5/6 ml-auto px-0 md:px-8 pb-12">
      {/* Title */}
      <div className="mt-4 mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center justify-center md:justify-start gap-2.5 bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            <FaMagic className="text-emerald-400 animate-pulse text-xl md:text-2xl" />
            <span>Stillar Galereyasi</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-2">
            Professional YouTube videolarimiz yordamida o'zingizga ma'qul stillarni tanlang va to'g'ridan-to'g'ri tomosha qiling.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-row gap-1 bg-zinc-900/30 backdrop-blur-lg p-1 rounded-2xl border border-white/10 max-w-md mx-auto md:mx-0 shrink-0">
          <button
            onClick={() => setActiveTab("soch")}
            className={`flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer ${
              activeTab === "soch"
                ? "bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
            }`}
          >
            <FaCut size={13} className="shrink-0" />
            <span>Soch Stillari</span>
          </button>
          <button
            onClick={() => setActiveTab("soqol")}
            className={`flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer ${
              activeTab === "soqol"
                ? "bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
            }`}
          >
            <FaUserAlt size={13} className="shrink-0" />
            <span>Soqol Stillari</span>
          </button>
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentStyles.map((style) => renderStyleCard(style))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 p-8 bg-linear-to-br from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/30 text-center relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">
          O'zingizga mos stilni tanladingizmi?
        </h3>
        <p className="text-zinc-300 mb-6 max-w-xl mx-auto relative z-10 text-sm md:text-base">
          Sartaroshxonamizga tashrif buyuring va professional ustalarimiz sizga eng yaxshi stilni tanlab berishadi.
        </p>
        <Link
          to="/"
          className="inline-block bg-linear-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 relative z-10"
        >
          Buyurtma Qilish
        </Link>
      </div>
    </div>
  )
}

export default StylesPage