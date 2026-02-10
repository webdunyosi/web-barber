import React, { useState } from 'react';
import { formatPrice } from '../utils/format';

const PaymentForm = ({ paymentData, onUpdate, bookingInfo }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    onUpdate({ ...paymentData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
    const limited = cleaned.slice(0, 16);
    const formatted = limited.match(/.{1,4}/g)?.join(' ') || limited;
    return formatted;
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (value) => {
    const formatted = formatCardNumber(value);
    handleChange('cardNumber', formatted);
  };

  const handleExpiryChange = (value) => {
    const formatted = formatExpiryDate(value);
    handleChange('expiry', formatted);
  };

  const handleCvvChange = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 3);
    handleChange('cvv', cleaned);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Order Summary */}
      <div className="bg-zinc-800/70 border border-green-500/50 rounded-xl p-8 mb-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Buyurtma tafsilotlari</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="opacity-90">Xizmat:</span>
            <span className="font-semibold">{bookingInfo.service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-90">Sana:</span>
            <span className="font-semibold">{bookingInfo.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-90">Vaqt:</span>
            <span className="font-semibold">{bookingInfo.time}</span>
          </div>
          <div className="border-t border-white/30 my-3"></div>
          <div className="flex justify-between text-xl">
            <span className="font-semibold">Jami:</span>
            <span className="font-bold">{formatPrice(bookingInfo.service.price)} so'm</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-zinc-800/70 border border-green-500/50 rounded-xl p-8">
        <div className="space-y-6">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Karta raqami *
            </label>
            <div className="relative">
              <input
                type="text"
                value={paymentData.cardNumber || ''}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              <div className="absolute right-3 top-3">
                💳
              </div>
            </div>
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amal qilish muddati *
              </label>
              <input
                type="text"
                value={paymentData.expiry || ''}
                onChange={(e) => handleExpiryChange(e.target.value)}
                placeholder="MM/YY"
                maxLength="5"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white ${
                  errors.expiry ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.expiry && (
                <p className="mt-1 text-sm text-red-500">{errors.expiry}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CVV *
              </label>
              <input
                type="text"
                value={paymentData.cvv || ''}
                onChange={(e) => handleCvvChange(e.target.value)}
                placeholder="123"
                maxLength="3"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white ${
                  errors.cvv ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.cvv && (
                <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Karta egasining ismi *
            </label>
            <input
              type="text"
              value={paymentData.cardholderName || ''}
              onChange={(e) => handleChange('cardholderName', e.target.value.toUpperCase())}
              placeholder="ISM FAMILIYA"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all uppercase bg-gray-700 text-white ${
                errors.cardholderName ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.cardholderName && (
              <p className="mt-1 text-sm text-red-500">{errors.cardholderName}</p>
            )}
          </div>

          {/* Security Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Xavfsiz to'lov</p>
                <p className="text-xs">Barcha to'lovlar shifrlangan aloqa orqali amalga oshiriladi. Karta ma'lumotlaringiz xavfsiz saqlanadi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;