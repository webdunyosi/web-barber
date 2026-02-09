import React from 'react';
import { formatPrice } from '../utils/format';

const ServiceSelection = ({ services, selectedService, onSelectService }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Xizmatni tanlang
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelectService(service)}
            className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
              selectedService?.id === service.id
                ? 'border-emerald-500 bg-emerald-50 shadow-xl'
                : 'border-gray-200 bg-white hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">{service.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {service.name_en}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatPrice(service.price)} so'm
                  </span>
                  <span className="text-sm text-gray-500">
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
