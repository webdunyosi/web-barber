import React, { useState } from 'react';

const VideosPage = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    {
      id: 1,
      title: "Klassik soch olish jarayoni",
      description: "Professional klassik soch olish texnikasi. Har bir bosqich batafsil ko'rsatilgan.",
      thumbnail: "/styles/1.png",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "12:30",
      views: "15.2K",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Zamonaviy fade uslubida soch olish",
      description: "Eng so'nggi trendlarga mos fade texnikasida soch olish.",
      thumbnail: "/styles/2.png",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "15:45",
      views: "22.8K",
      date: "2024-01-20"
    },
    {
      id: 3,
      title: "Professional soqol olish",
      description: "An'anaviy usulda soqol olish va parvarish qilish.",
      thumbnail: "/styles/3.png",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "10:20",
      views: "18.5K",
      date: "2024-01-25"
    },
    {
      id: 4,
      title: "Bolalar soch olish texnikasi",
      description: "Bolalar bilan ishlash uchun maxsus yondashuv va texnikalar.",
      thumbnail: "/styles/4.png",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "08:15",
      views: "12.3K",
      date: "2024-02-01"
    },
    {
      id: 5,
      title: "Soch bo'yash professional usulda",
      description: "Soch bo'yash texnikasi va rang tanlash bo'yicha maslahatlar.",
      thumbnail: "/styles/1.png",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "20:00",
      views: "25.1K",
      date: "2024-02-05"
    },
    {
      id: 6,
      title: "Yuz massaji va parvarish",
      description: "Yuz terisi uchun massaj va maxsus parvarish texnikasi.",
      thumbnail: "/styles/2.png",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "11:30",
      views: "9.7K",
      date: "2024-02-08"
    }
  ];

  const openVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          🎬 Ish Jarayonlari Videolari
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Bizning ishimizni yaqindan ko'ring. Professional sartarosh xizmatlarini videolarda tomosha qiling.
        </p>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => openVideo(video)}
            className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02] cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-zinc-800">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%2318181b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%2310b981"%3E🎬 Video%3C/text%3E%3C/svg%3E';
                }}
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-all duration-300">
                <div className="bg-emerald-500 rounded-full p-4 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {video.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>{video.views} ko'rishlar</span>
                </div>
                <span>{new Date(video.date).toLocaleDateString('uz-UZ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeVideo}
        >
          <div 
            className="relative w-full max-w-5xl bg-zinc-900 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="aspect-video bg-black">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedVideo.title}
              </h2>
              <p className="text-gray-400 mb-4">
                {selectedVideo.description}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>{selectedVideo.views} ko'rishlar</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>{new Date(selectedVideo.date).toLocaleDateString('uz-UZ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-12 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8 text-center">
        <div className="text-4xl mb-4">📺</div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Yangi videolar tez orada!
        </h3>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Bizning YouTube kanalimizga obuna bo'ling va eng so'nggi videolardan birinchi bo'lib xabardor bo'ling.
        </p>
        <button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/50">
          YouTube'ga obuna
        </button>
      </div>
    </div>
  );
};

export default VideosPage;
