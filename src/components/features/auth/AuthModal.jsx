import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { FaTimes, FaUser, FaPhone, FaPaperPlane, FaLock } from 'react-icons/fa';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    telegram: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handlePhoneChange = (value) => {
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

  const validate = () => {
    const newErrors = {};
    const cleanPhone = formData.phone.replace(/\D/g, '');
    
    if (activeTab === 'register') {
      if (!formData.name.trim()) newErrors.name = 'Ismingizni kiriting';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon raqamni kiriting';
    } else if (cleanPhone.length !== 12) {
      newErrors.phone = "Telefon raqami noto'g'ri (12 ta raqam bo'lishi kerak)";
    }
    
    if (!formData.password) {
      newErrors.password = 'Parolni kiriting';
    } else if (formData.password.length < 4) {
      newErrors.password = "Parol kamida 4 ta belgidan iborat bo'lishi kerak";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (activeTab === 'login') {
        const user = await login(formData.phone, formData.password);
        if (onSuccess) onSuccess(user);
        onClose();
      } else {
        const user = await register(formData);
        if (onSuccess) onSuccess(user);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setErrors({ api: err.message || 'Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      {/* Background close click */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-zinc-900/90 border border-emerald-500/30 rounded-2xl shadow-2xl p-6 md:p-8 animate-bounce-in backdrop-blur-xl z-10 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <FaTimes size={18} />
        </button>

        {/* Tab Buttons */}
        <div className="flex border-b border-white/10 mb-6 pb-1">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrors({});
            }}
            className={`flex-1 text-center py-2 text-lg font-bold transition-all relative ${
              activeTab === 'login' ? 'text-emerald-400' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Kirish
            {activeTab === 'login' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full animate-fadeIn"></span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrors({});
            }}
            className={`flex-1 text-center py-2 text-lg font-bold transition-all relative ${
              activeTab === 'register' ? 'text-emerald-400' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Ro'yxatdan o'tish
            {activeTab === 'register' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full animate-fadeIn"></span>
            )}
          </button>
        </div>

        {/* Title/Description */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold uppercase tracking-wider text-emerald-500">
            {activeTab === 'login' ? 'Xush kelibsiz!' : 'Yangi hisob yaratish'}
          </h3>
          <p className="text-sm text-white/60 mt-1">
            {activeTab === 'login'
              ? 'Tizimga kirib buyurtma berishda davom eting'
              : 'Malumotlaringizni to\'ldirib ro\'yxatdan o\'ting'}
          </p>
        </div>

        {/* API Error Box */}
        {errors.api && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm text-center font-medium animate-fadeIn">
            {errors.api}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 pl-1">
                Ismingiz *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                  <FaUser size={14} />
                </span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Jasur Aliyev"
                  className={`w-full pl-10 pr-4 py-3 bg-zinc-800 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-white/20 text-sm hover:bg-zinc-800/80 ${
                    errors.name ? 'border-red-500' : 'border-zinc-700'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-400 pl-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 pl-1">
              Telefon raqamingiz *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                <FaPhone size={14} />
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+998 XX XXX XX XX"
                className={`w-full pl-10 pr-4 py-3 bg-zinc-800 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-white/20 text-sm hover:bg-zinc-800/80 ${
                  errors.phone ? 'border-red-500' : 'border-zinc-700'
                }`}
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-400 pl-1">{errors.phone}</p>}
          </div>

          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 pl-1">
                Telegram username (ixtiyoriy)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                  <FaPaperPlane size={14} />
                </span>
                <input
                  type="text"
                  value={formData.telegram}
                  onChange={(e) => handleChange('telegram', e.target.value.replace('@', ''))}
                  placeholder="username"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-white/20 text-sm hover:bg-zinc-800/80"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 pl-1">
              Parol *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
                <FaLock size={14} />
              </span>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 bg-zinc-800 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-white/20 text-sm hover:bg-zinc-800/80 ${
                  errors.password ? 'border-red-500' : 'border-zinc-700'
                }`}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400 pl-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 relative overflow-hidden bg-linear-to-br from-emerald-500 via-emerald-600 to-green-600 hover:shadow-lg hover:shadow-emerald-500/30 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer disabled:bg-zinc-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-emerald-400"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Yuklanmoqda...</span>
              </>
            ) : (
              <span>{activeTab === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}</span>
            )}
          </button>
        </form>

        {/* Admin Login helper hint */}
        {activeTab === 'login' && (
          <div className="mt-6 text-center text-xs text-white/30 border-t border-white/5 pt-4">
            <span className="font-semibold text-emerald-500">Admin test:</span> +998 99 999 99 99, <span className="font-semibold text-emerald-500">parol:</span> admin
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
