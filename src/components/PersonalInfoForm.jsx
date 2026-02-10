import React, { useState } from 'react';

const PersonalInfoForm = ({ formData, onUpdate }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    onUpdate({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handlePhoneChange = (value) => {
    // Auto-format phone number
    let cleaned = value.replace(/\D/g, '');
    
    if (!cleaned.startsWith('998') && cleaned.length > 0) {
      cleaned = '998' + cleaned;
    }
    
    if (cleaned.length > 12) {
      cleaned = cleaned.slice(0, 12);
    }
    
    let formatted = '+';
    if (cleaned.length > 0) {
      formatted += cleaned.slice(0, 3);
    }
    if (cleaned.length > 3) {
      formatted += ' ' + cleaned.slice(3, 5);
    }
    if (cleaned.length > 5) {
      formatted += ' ' + cleaned.slice(5, 8);
    }
    if (cleaned.length > 8) {
      formatted += ' ' + cleaned.slice(8, 10);
    }
    if (cleaned.length > 10) {
      formatted += ' ' + cleaned.slice(10, 12);
    }
    
    handleChange('phone', formatted);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-zinc-800/70 border border-green-500/50 rounded-xl p-8">
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ismingiz *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ismingizni kiriting"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Telefon raqamingiz *
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+998 XX XXX XX XX"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white ${
                errors.phone ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Buyurtma tasdiqlash uchun Telegramga xabar yuboriladi
            </p>
          </div>

          {/* Telegram Username (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Telegram username (ixtiyoriy)
            </label>
            <div className="flex items-center">
              <span className="px-3 py-3 bg-gray-700 border border-r-0 border-gray-600 rounded-l-lg text-gray-300">
                @
              </span>
              <input
                type="text"
                value={formData.telegram || ''}
                onChange={(e) => handleChange('telegram', e.target.value)}
                placeholder="username"
                className="flex-1 px-4 py-3 border border-gray-600 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-700 text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;