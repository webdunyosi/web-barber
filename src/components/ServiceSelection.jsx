import React from 'react';
import { formatPrice } from '../utils/format';

const ServiceSelection = ({ services, selectedService, onSelectService }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
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
            className={`relative cursor-pointer border rounded-xl p-8 transition-all duration-300 ${
              selectedService?.id === service.id
                ? 'bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-green-500/20 border-green-400 shadow-2xl shadow-green-500/50 scale-105 ring-2 ring-green-400/50'
                : 'bg-zinc-800/70 border-green-500/30 hover:border-green-500/60 hover:shadow-lg hover:bg-zinc-800/90'
            }`}
          >
            {selectedService?.id === service.id && (
              <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-bounce-in">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className={`text-5xl transition-transform duration-300 ${
                selectedService?.id === service.id ? 'scale-110' : ''
              }`}>
                {service.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                  selectedService?.id === service.id ? 'text-green-300' : 'text-white'
                }`}>
                  {service.name}
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  {service.name_en}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-2xl font-bold transition-colors duration-300 ${
                    selectedService?.id === service.id ? 'text-green-300' : 'text-green-400'
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