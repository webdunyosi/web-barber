import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaTimes, FaCheck, FaBan, FaUserShield, FaAward, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const EditUserModal = ({
  isOpen,
  userToEdit,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    telegram: '',
    loyaltyStamps: 0,
    status: 'active',
    role: 'user',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || '',
        phone: userToEdit.phone || '',
        telegram: userToEdit.telegram || '',
        loyaltyStamps: userToEdit.loyaltyStamps || 0,
        status: userToEdit.status || 'active',
        role: userToEdit.role || 'user',
        password: ''
      });
      setErrors({});
      setShowPassword(false);
    }
  }, [userToEdit, isOpen]);

  if (!isOpen || !userToEdit) return null;

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

    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    const cleanPhone = formData.phone.replace(/\D/g, '');

    if (!formData.name.trim()) tempErrors.name = "Ism kiritilishi shart";
    
    if (!formData.phone.trim() || formData.phone.trim() === '+998') {
      tempErrors.phone = "Telefon raqami kiritilishi shart";
    } else if (cleanPhone.length !== 12) {
      tempErrors.phone = "Telefon raqami noto'g'ri (12 ta raqam bo'lishi kerak)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Strip @ from telegram if exists
      let cleanTelegram = formData.telegram.trim();
      if (cleanTelegram.startsWith('@')) {
        cleanTelegram = cleanTelegram.substring(1);
      }

      const updatedData = {
        ...formData,
        telegram: cleanTelegram
      };

      await onSave(userToEdit.id || userToEdit._id, updatedData);
      toast.success("Foydalanuvchi ma'lumotlari yangilandi!");
      onClose();
    } catch (error) {
      console.error("Save user error:", error);
      toast.error(error.response?.data?.error || error.message || "Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate interactive loyalty stamps grid
  const renderStampsGrid = () => {
    const stampItems = [];
    for (let i = 1; i <= 9; i++) {
      const isActive = formData.loyaltyStamps >= i;
      stampItems.push(
        <button
          type="button"
          key={i}
          onClick={() => setFormData(prev => ({ ...prev, loyaltyStamps: i }))}
          className={`w-9 h-9 rounded-xl border font-mono font-bold text-sm transition-all flex items-center justify-center cursor-pointer select-none active:scale-95 ${
            isActive
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
              : 'bg-zinc-800/40 border-zinc-700/60 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
          }`}
          title={`${i} ta marka`}
        >
          {i}
        </button>
      );
    }
    return stampItems;
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-fadeIn">
      {/* Backdrop overlay click triggers close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative max-w-md w-full bg-zinc-950/95 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl z-10 animate-bounce-in max-h-[90vh] overflow-y-auto scrollbar-none">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/5"
        >
          <FaTimes size={16} />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-emerald-500">📝</span>
            Mijoz ma'lumotlarini tahrirlash
          </h3>
          <p className="text-zinc-400 text-xs">Foydalanuvchi ma'lumotlari va sodiqlik ballarini yangilang</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Ism Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Foydalanuvchi ismi</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <FaUser size={12} />
              </span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full pl-9 pr-4 py-2.5 bg-zinc-900 border ${
                  errors.name ? 'border-red-500' : 'border-zinc-800 focus:border-emerald-500'
                } rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white transition-all`}
                placeholder="Masalan: Said Aliyev"
              />
            </div>
            {errors.name && <p className="text-red-500 text-[10px] font-semibold">{errors.name}</p>}
          </div>

          {/* Telefon Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Telefon raqami</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <FaPhone size={12} />
              </span>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 bg-zinc-900 border ${
                  errors.phone ? 'border-red-500' : 'border-zinc-800 focus:border-emerald-500'
                } rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white transition-all`}
                placeholder="Masalan: +998 90 123 45 67"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-[10px] font-semibold">{errors.phone}</p>}
          </div>

          {/* Telegram Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Telegram Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 font-bold text-sm">
                @
              </span>
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData(prev => ({ ...prev, telegram: e.target.value }))}
                className="w-full pl-8 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white transition-all"
                placeholder="telegram_user"
              />
            </div>
          </div>

          {/* Parol Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Parolni o'zgartirish</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <FaLock size={12} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-9 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white transition-all"
                placeholder="Yangi parol (bo'sh qoldirilsa, o'zgarmaydi)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-350 transition-colors cursor-pointer bg-transparent border-none"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          {/* Loyalty Stamps Selector */}
          <div className="space-y-2 bg-zinc-900/60 border border-zinc-900 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <FaAward className="text-amber-500" size={14} />
                Sodiqlik markalari (Cashback)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, loyaltyStamps: Math.max(0, prev.loyaltyStamps - 1) }))}
                  className="w-6 h-6 rounded-md bg-zinc-800 text-white font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-zinc-700 active:scale-95"
                >
                  -
                </button>
                <span className="text-sm font-extrabold text-white font-mono w-4 text-center">
                  {formData.loyaltyStamps}
                </span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, loyaltyStamps: Math.min(9, prev.loyaltyStamps + 1) }))}
                  className="w-6 h-6 rounded-md bg-zinc-800 text-white font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-zinc-700 active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
            {/* Visual selector grid */}
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 pt-2">
              {renderStampsGrid()}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
              10-tashrif bepul bo'ladi. Hozirgi markalar sonini bevosita belgilang yoki o'zgartiring.
            </p>
          </div>

          {/* Select fields grid (Status & Role) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
                <FaBan className="text-zinc-500" size={11} />
                Holati
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl outline-none text-sm text-white"
              >
                <option value="active">Faol</option>
                <option value="blocked">Bloklangan</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
                <FaUserShield className="text-zinc-500" size={11} />
                Roli
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl outline-none text-sm text-white"
              >
                <option value="user">Mijoz (User)</option>
                <option value="admin">Sartarosh (Admin)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white font-bold py-3 px-4 rounded-xl text-xs transition-all border border-zinc-800 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all active:scale-95 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer border-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaCheck size={12} />
              )}
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
