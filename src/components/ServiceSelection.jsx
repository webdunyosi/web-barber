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
            className={`cursor-pointer bg-zinc-800/70 border rounded-xl p-8 transition-all duration-300 hover:shadow-lg ${
              selectedService?.id === service.id
                ? 'border-green-500 shadow-xl'
                : 'border-green-500/50 hover:border-green-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">{service.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  {service.name_en}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-2xl font-bold text-green-400">
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