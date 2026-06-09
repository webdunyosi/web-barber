import React from 'react';
import { formatPrice } from '../../../utils/format';

const ServiceSelection = ({ services, selectedService, onSelectService }) => {
  const [loadedImages, setLoadedImages] = React.useState({});

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelectService(service)}
            role="button"
            aria-pressed={selectedService?.id === service.id}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectService(service);
              }
            }}
            className={`group relative cursor-pointer border rounded-xl p-4 transition-all duration-300 backdrop-blur-md ${
              selectedService?.id === service.id
                ? 'bg-linear-to-br from-green-500/20 via-emerald-500/10 to-green-500/20 border-green-400 shadow-xl shadow-green-500/30 scale-[1.01] ring-1 ring-green-400/50'
                : 'bg-zinc-800/60 border-green-500/20 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 hover:bg-zinc-800/80 hover:scale-[1.005] active:scale-[0.995]'
            }`}
          >
            {selectedService?.id === service.id && (
              <div className="absolute -top-2.5 -right-2.5 bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg animate-bounce-in z-20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {/* Shine effect on hover */}
            <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className={`transition-all duration-300 relative w-16 h-16 shrink-0 overflow-hidden rounded-xl bg-zinc-700/50 ${
                selectedService?.id === service.id ? 'scale-105' : 'group-hover:scale-105'
              }`}>
                {!loadedImages[service.id] && (
                  <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-xl" />
                )}
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  className={`w-full h-full object-cover rounded-xl shadow-md transition-all duration-300 ${
                    loadedImages[service.id] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  onLoad={() => handleImageLoad(service.id)}
                  onError={(e) => {
                    handleImageLoad(service.id);
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('text-3xl');
                    e.target.parentElement.innerHTML = '✂️';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <h3 className={`text-base sm:text-lg font-bold truncate transition-colors duration-300 ${
                    selectedService?.id === service.id ? 'text-green-300' : 'text-white group-hover:text-green-300'
                  }`}>
                    {service.name}
                  </h3>
                  <span className="text-[11px] text-gray-400 mt-1 shrink-0">
                    {service.duration} min
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {service.name_en}
                </p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className={`text-lg font-extrabold transition-colors duration-300 ${
                    selectedService?.id === service.id ? 'text-green-300' : 'text-green-400 group-hover:text-green-300'
                  }`}>
                    {formatPrice(service.price)} so'm
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;