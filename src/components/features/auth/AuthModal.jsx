import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useBarber } from '../../../contexts/BarberContext';
import { FaTimes, FaUser, FaPhone, FaPaperPlane, FaLock, FaEye, FaEyeSlash, FaCut } from 'react-icons/fa';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const { activeBarber, selectBarber } = useBarber();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    phone: '+998 ',
    telegram: '',
    password: '',
    barberSlug: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        phone: '+998 ',
        telegram: '',
        password: '',
        barberSlug: activeBarber?.slug || '',
      });
      setErrors({});
    }
  }, [isOpen, activeBarber]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handlePhoneChange = (value) => {
    let inputVal = value;
    if (!inputVal.startsWith('+998 ')) {
      inputVal = '+998 ' + inputVal.replace(/^\+?9?9?8?\s?/, '');
    }

    const suffix = inputVal.substring(5).replace(/\D/g, '');
    const cleanSuffix = suffix.slice(0, 9);

    let formatted = '+998 ';
    if (cleanSuffix.length > 0) {
      formatted += cleanSuffix.slice(0, 2);
    }
    if (cleanSuffix.length > 2) {
      formatted += ' ' + cleanSuffix.slice(2, 5);
    }
    if (cleanSuffix.length > 5) {
      formatted += ' ' + cleanSuffix.slice(5, 7);
    }
    if (cleanSuffix.length > 7) {
      formatted += ' ' + cleanSuffix.slice(7, 9);
    }

    handleChange('phone', formatted);
  };

  const validate = () => {
    const newErrors = {};
    const cleanPhone = formData.phone.replace(/\D/g, '');
    
    if (activeTab === 'register') {
      if (!formData.name.trim()) newErrors.name = 'Ismingizni kiriting';
      if (!formData.barberSlug.trim()) newErrors.barberSlug = 'Sartarosh kodini (login) kiriting';
    }
    
    if (!formData.phone.trim() || formData.phone.trim() === '+998') {
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
      const trimmedPhone = formData.phone.trim();
      if (activeTab === 'login') {
        const res = await login(trimmedPhone, formData.password, formData.barberSlug.trim());
        if (res.activeBarber) {
          selectBarber(res.activeBarber);
        }
        if (onSuccess) onSuccess(res.user);
        onClose();
      } else {
        const trimmedData = {
          ...formData,
          name: formData.name.trim(),
          phone: trimmedPhone,
          telegram: formData.telegram.trim(),
          barberSlug: formData.barberSlug.trim()
        };
        const res = await register(trimmedData);
        if (res.activeBarber) {
          selectBarber(res.activeBarber);
        }
        if (onSuccess) onSuccess(res.user);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setErrors({ api: err.response?.data?.error || err.message || 'Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-all duration-300">
      {/* Background close click */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-zinc-950/70 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(16,185,129,0.15)] pt-12 pb-6 px-5 sm:pt-14 sm:pb-8 sm:px-8 animate-bounce-in z-10 text-white overflow-hidden">
        
        {/* Background blur decorative circles */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/20 rounded-full blur-[70px] pointer-events-none -z-10 animate-pulse-glow"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-green-500/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 hover:rotate-90 border border-white/5 hover:border-white/15 transition-all duration-300 p-2 rounded-full backdrop-blur-md z-20"
        >
          <FaTimes size={15} />
        </button>

        {/* Tab Buttons (Sliding Glass Pill design) */}
        <div className="relative flex p-1 bg-white/5 border border-white/10 rounded-2xl mb-6 z-10">
          {/* Active background slider */}
          <div 
            className="absolute top-1 bottom-1 left-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-300 ease-out -z-10 shadow-[0_4px_12px_rgba(16,185,129,0.3)] border border-emerald-400/20"
            style={{
              width: 'calc(50% - 4px)',
              transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)'
            }}
          ></div>
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrors({});
            }}
            className={`flex-1 text-center py-2 text-[11px] sm:text-xs font-bold tracking-normal uppercase transition-all duration-300 rounded-xl cursor-pointer ${
              activeTab === 'login' ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Kirish
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrors({});
            }}
            className={`flex-1 text-center py-2 text-[11px] sm:text-xs font-bold tracking-normal uppercase transition-all duration-300 rounded-xl cursor-pointer ${
              activeTab === 'register' ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {/* API Error Box */}
        {errors.api && (
          <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm text-center font-medium animate-fadeIn">
            {errors.api}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Barber Slug (Sartarosh Kodi) Input */}
          <div className="group flex flex-col">
            <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
              {activeTab === 'register' ? 'Sartarosh kodi *' : 'Sartarosh kodi (Mijozlar uchun)'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300">
                <FaCut size={14} />
              </span>
              <input
                type="text"
                value={formData.barberSlug}
                onChange={(e) => handleChange('barberSlug', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                placeholder="masalan: behruz"
                className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 placeholder:text-white/20 text-sm hover:bg-white/10 ${
                  errors.barberSlug ? 'border-red-500/50 focus:ring-red-500/10 focus:border-red-500' : 'border-white/10'
                }`}
              />
            </div>
            {errors.barberSlug && <p className="mt-1.5 text-xs text-red-400 pl-1 text-left">{errors.barberSlug}</p>}
          </div>

          {activeTab === 'register' && (
            <div className="group flex flex-col animate-fadeIn">
              <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
                Ismingiz *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300">
                  <FaUser size={14} />
                </span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Jasur Aliyev"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 placeholder:text-white/20 text-sm hover:bg-white/10 ${
                    errors.name ? 'border-red-500/50 focus:ring-red-500/10 focus:border-red-500' : 'border-white/10'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-red-400 pl-1 text-left">{errors.name}</p>}
            </div>
          )}

          <div className="group flex flex-col">
            <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
              Telefon raqamingiz *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300">
                <FaPhone size={13} />
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+998 XX XXX XX XX"
                className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 placeholder:text-white/20 text-sm hover:bg-white/10 ${
                  errors.phone ? 'border-red-500/50 focus:ring-red-500/10 focus:border-red-500' : 'border-white/10'
                }`}
              />
            </div>
            {errors.phone && <p className="mt-1.5 text-xs text-red-400 pl-1 text-left">{errors.phone}</p>}
          </div>

          {activeTab === 'register' && (
            <div className="group flex flex-col animate-fadeIn">
              <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
                Telegram username (ixtiyoriy)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300">
                  <FaPaperPlane size={13} />
                </span>
                <input
                  type="text"
                  value={formData.telegram}
                  onChange={(e) => handleChange('telegram', e.target.value.replace('@', ''))}
                  placeholder="username"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 placeholder:text-white/20 text-sm hover:bg-white/10"
                />
              </div>
            </div>
          )}

          <div className="group flex flex-col">
            <label className="block text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
              Parol *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300">
                <FaLock size={13} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-11 pr-11 py-3.5 bg-white/5 border rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 focus:bg-zinc-950/50 transition-all duration-300 placeholder:text-white/20 text-sm hover:bg-white/10 ${
                  errors.password ? 'border-red-500/50 focus:ring-red-500/10 focus:border-red-500' : 'border-white/10'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-400 pl-1 text-left">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer disabled:bg-zinc-800 disabled:text-white/20 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-emerald-400/30"
          >
            {/* Hover shine effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:animate-[button-shine_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"></span>

            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Yuklanmoqda...</span>
              </>
            ) : (
              <span className="tracking-wide uppercase text-sm">{activeTab === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}</span>
            )}
          </button>
        </form>


      </div>
    </div>
  );
};

export default AuthModal;
