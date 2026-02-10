import React from 'react';
import { formatPrice } from '../utils/format';

const ServiceSelection = ({ services, selectedService, onSelectService }) => {
  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className={`group relative cursor-pointer border rounded-xl p-8 transition-all duration-300 backdrop-blur-md ${
              selectedService?.id === service.id
                ? 'bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-green-500/20 border-green-400 shadow-2xl shadow-green-500/50 scale-105 ring-2 ring-green-400/50'
                : 'bg-zinc-800/70 border-green-500/30 hover:border-green-500/60 hover:shadow-xl hover:shadow-green-500/20 hover:bg-zinc-800/90 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {selectedService?.id === service.id && (
              <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-bounce-in">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {/* Shine effect on hover */}
            <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className={`text-5xl transition-all duration-300 ${
                selectedService?.id === service.id ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {service.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                  selectedService?.id === service.id ? 'text-green-300' : 'text-white group-hover:text-green-300'
                }`}>
                  {service.name}
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  {service.name_en}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-2xl font-bold transition-colors duration-300 ${
                    selectedService?.id === service.id ? 'text-green-300' : 'text-green-400 group-hover:text-green-300'
                  }`}>
                    {formatPrice(service.price)} so'm
                  </span>
                  <span className="text-sm text-gray-300">
                    {service.duration} daqiqa
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