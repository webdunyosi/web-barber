import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaTimes, FaCheck, FaBan, FaUserShield, FaAward, FaLock, FaEye, FaEyeSlash, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const EditUserModal = ({
  isOpen,
  userToEdit,
  onClose,
  onSave
}) => {
  const isAddMode = userToEdit && userToEdit.isAddMode;

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
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: isAddMode ? '' : (userToEdit.name || ''),
        phone: isAddMode ? '+998 ' : (userToEdit.phone || ''),
        telegram: isAddMode ? '' : (userToEdit.telegram || ''),
        loyaltyStamps: isAddMode ? 0 : (userToEdit.loyaltyStamps || 0),
        status: isAddMode ? 'active' : (userToEdit.status || 'active'),
        role: isAddMode ? 'user' : (userToEdit.role || 'user'),
        password: ''
      });
      setErrors({});
      setShowPassword(false);
      setStatusDropdownOpen(false);
      setRoleDropdownOpen(false);
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

    if (isAddMode) {
      if (!formData.password) {
        tempErrors.password = "Parol kiritilishi shart";
      } else if (formData.password.length < 4) {
        tempErrors.password = "Parol kamida 4 ta belgidan iborat bo'lishi kerak";
      }
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

      if (isAddMode) {
        await onSave(null, updatedData);
        toast.success("Yangi foydalanuvchi muvaffaqiyatli yaratildi!");
      } else {
        await onSave(userToEdit.id || userToEdit._id, updatedData);
        toast.success("Foydalanuvchi ma'lumotlari yangilandi!");
      }
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
          className={`w-9 h-9 rounded-full border font-mono font-bold text-sm transition-all duration-300 flex items-center justify-center cursor-pointer select-none active:scale-95 relative overflow-hidden group/stamp ${
            isActive
              ? 'bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-300 text-white shadow-[0_0_15px_rgba(16,185,129,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] scale-105'
              : 'bg-white/[0.03] border-white/10 text-zinc-500 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-white/[0.08] hover:scale-105'
          }`}
          title={`${i} ta marka`}
        >
          {isActive && (
            <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent -translate-x-full group-hover/stamp:animate-[button-shine_1s_ease-in-out]"></span>
          )}
          {i}
        </button>
      );
    }
    return stampItems;
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xl flex items-center justify-center z-[200] p-0 sm:p-4 animate-fadeIn transition-all duration-300">
      {/* Backdrop overlay click triggers close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full sm:max-w-md min-h-screen sm:min-h-0 sm:h-auto bg-zinc-950/65 sm:border border-white/[0.08] backdrop-blur-3xl sm:rounded-3xl rounded-none p-5 sm:p-8 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_50px_rgba(16,185,129,0.12)] z-10 animate-bounce-in max-h-screen sm:max-h-[90vh] overflow-y-auto chat-scrollbar relative overflow-hidden text-white">
        
        {/* Background blur decorative circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse duration-[6000ms]"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[45%] bg-green-500/15 rounded-full blur-[90px] pointer-events-none -z-10 animate-pulse duration-[8000ms]"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 hover:rotate-90 border border-white/5 hover:border-white/15 transition-all duration-300 p-2 rounded-full backdrop-blur-md z-20 cursor-pointer"
        >
          <FaTimes size={14} />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 flex items-center gap-2">
            <span className="text-xl">{isAddMode ? '👤' : '📝'}</span>
            {isAddMode ? "Yangi mijoz qo'shish" : "Mijoz ma'lumotlarini tahrirlash"}
          </h3>
          <p className="text-zinc-400 text-xs">
            {isAddMode ? "Tizimga yangi foydalanuvchini qo'shish" : "Foydalanuvchi ma'lumotlari va sodiqlik ballarini yangilang"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Ism Field */}
          <div className="group flex flex-col">
            <label className="block text-left text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
              Foydalanuvchi ismi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300">
                <FaUser size={12} />
              </span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400/80 focus:bg-zinc-950/45 transition-all duration-300 placeholder:text-white/20 text-xs hover:bg-white/[0.07] hover:border-white/[0.18] ${
                  errors.name ? 'border-red-500/40 focus:ring-red-500/10 focus:border-red-500/80' : 'border-white/[0.08]'
                }`}
                placeholder="Masalan: Said Aliyev"
                autoComplete="off"
              />
            </div>
            {errors.name && <p className="mt-1.5 text-xs text-red-400 pl-1 text-left">{errors.name}</p>}
          </div>

          {/* Telefon Field */}
          <div className="group flex flex-col">
            <label className="block text-left text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
              Telefon raqami
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300">
                <FaPhone size={12} />
              </span>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400/80 focus:bg-zinc-950/45 transition-all duration-300 placeholder:text-white/20 text-xs hover:bg-white/[0.07] hover:border-white/[0.18] ${
                  errors.phone ? 'border-red-500/40 focus:ring-red-500/10 focus:border-red-500/80' : 'border-white/[0.08]'
                }`}
                placeholder="Masalan: +998 90 123 45 67"
                autoComplete="off"
              />
            </div>
            {errors.phone && <p className="mt-1.5 text-xs text-red-400 pl-1 text-left">{errors.phone}</p>}
          </div>

          {/* Telegram Field */}
          <div className="group flex flex-col">
            <label className="block text-left text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
              Telegram Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300 font-bold text-xs">
                @
              </span>
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData(prev => ({ ...prev, telegram: e.target.value }))}
                className="w-full pl-8 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400/80 focus:bg-zinc-950/45 transition-all duration-300 placeholder:text-white/20 text-xs hover:bg-white/[0.07] hover:border-white/[0.18]"
                placeholder="telegram_user"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Parol Field */}
          <div className="group flex flex-col">
            <label className="block text-left text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-focus-within:text-emerald-400 transition-colors duration-300 mb-1.5 pl-1">
              {isAddMode ? 'Parol (Kamida 4 ta belgi)' : "Parolni o'zgartirish"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300">
                <FaLock size={12} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={`w-full pl-11 pr-10 py-3.5 bg-white/[0.03] border rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400/80 focus:bg-zinc-950/45 transition-all duration-300 placeholder:text-white/20 text-xs hover:bg-white/[0.07] hover:border-white/[0.18] ${
                  errors.password ? 'border-red-500/40 focus:ring-red-500/10 focus:border-red-500/80' : 'border-white/[0.08]'
                }`}
                placeholder={isAddMode ? "Parol kiriting..." : "Yangi parol (bo'sh qoldirilsa, o'zgarmaydi)"}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-400 pl-1 text-left">{errors.password}</p>}
          </div>

          {/* Loyalty Stamps Selector */}
          <div className="space-y-2 bg-white/[0.02] border border-white/[0.08] backdrop-blur-md rounded-2xl p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <FaAward className="text-amber-500 animate-pulse" size={14} />
                Sodiqlik markalari (Cashback)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, loyaltyStamps: Math.max(0, prev.loyaltyStamps - 1) }))}
                  className="w-7 h-7 rounded-lg bg-white/5 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-white/10 active:scale-90 border border-white/10 hover:border-emerald-500/30 transition-all"
                >
                  -
                </button>
                <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400 font-mono w-4 text-center">
                  {formData.loyaltyStamps}
                </span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, loyaltyStamps: Math.min(9, prev.loyaltyStamps + 1) }))}
                  className="w-7 h-7 rounded-lg bg-white/5 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-white/10 active:scale-90 border border-white/10 hover:border-emerald-500/30 transition-all"
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
            <div className="group flex flex-col relative">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1 group-focus-within:text-emerald-400 transition-colors duration-300 pl-1 mb-1.5">
                <FaBan className="text-zinc-500" size={11} />
                Holati
              </label>
              
              {/* Trigger */}
              <div 
                onClick={() => {
                  setStatusDropdownOpen(!statusDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className={`w-full px-3 py-3.5 bg-white/[0.03] border rounded-xl outline-none text-xs text-white flex items-center justify-between cursor-pointer select-none transition-all duration-300 ${
                  statusDropdownOpen 
                    ? 'border-emerald-400/80 ring-4 ring-emerald-500/10 bg-zinc-950/45' 
                    : 'border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.18]'
                }`}
              >
                <span>{formData.status === 'active' ? 'Faol' : 'Bloklangan'}</span>
                <FaChevronDown 
                  size={10} 
                  className={`text-white/40 transition-transform duration-300 ${statusDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} 
                />
              </div>

              {/* Close backdrop */}
              {statusDropdownOpen && (
                <div className="fixed inset-0 z-30 cursor-default" onClick={() => setStatusDropdownOpen(false)}></div>
              )}

              {/* Dropdown Options List */}
              {statusDropdownOpen && (
                <div className="absolute bottom-[calc(100%+4px)] left-0 right-0 bg-zinc-950/90 border border-white/[0.08] backdrop-blur-3xl rounded-xl shadow-[0_-15px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.05)] overflow-hidden z-40 py-1.5 animate-fadeIn origin-bottom text-left">
                  <div 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, status: 'active' }));
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-3.5 py-2.5 text-xs transition-all cursor-pointer flex items-center justify-between hover:bg-white/5 ${
                      formData.status === 'active' 
                        ? 'text-emerald-400 font-bold bg-emerald-500/5' 
                        : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span>Faol</span>
                    {formData.status === 'active' && <FaCheck size={8} className="text-emerald-400" />}
                  </div>
                  <div 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, status: 'blocked' }));
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-3.5 py-2.5 text-xs transition-all cursor-pointer flex items-center justify-between hover:bg-white/5 ${
                      formData.status === 'blocked' 
                        ? 'text-red-400 font-bold bg-red-500/5' 
                        : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span>Bloklangan</span>
                    {formData.status === 'blocked' && <FaCheck size={8} className="text-red-400" />}
                  </div>
                </div>
              )}
            </div>

            <div className="group flex flex-col relative">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1 group-focus-within:text-emerald-400 transition-colors duration-300 pl-1 mb-1.5">
                <FaUserShield className="text-zinc-500" size={11} />
                Roli
              </label>

              {/* Trigger */}
              <div 
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setStatusDropdownOpen(false);
                }}
                className={`w-full px-3 py-3.5 bg-white/[0.03] border rounded-xl outline-none text-xs text-white flex items-center justify-between cursor-pointer select-none transition-all duration-300 ${
                  roleDropdownOpen 
                    ? 'border-emerald-400/80 ring-4 ring-emerald-500/10 bg-zinc-950/45' 
                    : 'border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.18]'
                }`}
              >
                <span>{formData.role === 'admin' ? 'Sartarosh (Admin)' : 'Mijoz (User)'}</span>
                <FaChevronDown 
                  size={10} 
                  className={`text-white/40 transition-transform duration-300 ${roleDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} 
                />
              </div>

              {/* Close backdrop */}
              {roleDropdownOpen && (
                <div className="fixed inset-0 z-30 cursor-default" onClick={() => setRoleDropdownOpen(false)}></div>
              )}

              {/* Dropdown Options List */}
              {roleDropdownOpen && (
                <div className="absolute bottom-[calc(100%+4px)] left-0 right-0 bg-zinc-950/90 border border-white/[0.08] backdrop-blur-3xl rounded-xl shadow-[0_-15px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.05)] overflow-hidden z-40 py-1.5 animate-fadeIn origin-bottom text-left">
                  <div 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, role: 'user' }));
                      setRoleDropdownOpen(false);
                    }}
                    className={`px-3.5 py-2.5 text-xs transition-all cursor-pointer flex items-center justify-between hover:bg-white/5 ${
                      formData.role === 'user' 
                        ? 'text-emerald-400 font-bold bg-emerald-500/5' 
                        : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span>Mijoz (User)</span>
                    {formData.role === 'user' && <FaCheck size={8} className="text-emerald-400" />}
                  </div>
                  <div 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, role: 'admin' }));
                      setRoleDropdownOpen(false);
                    }}
                    className={`px-3.5 py-2.5 text-xs transition-all cursor-pointer flex items-center justify-between hover:bg-white/5 ${
                      formData.role === 'admin' 
                        ? 'text-emerald-400 font-bold bg-emerald-500/5' 
                        : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span>Sartarosh (Admin)</span>
                    {formData.role === 'admin' && <FaCheck size={8} className="text-emerald-400" />}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all border border-white/10 active:scale-95 cursor-pointer disabled:opacity-50 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs transition-all active:scale-95 border border-emerald-400/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 group"
            >
              {/* Hover shine effect */}
              <span className="absolute inset-0 -translate-x-full group-hover:animate-[button-shine_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"></span>
              {isSubmitting ? (
                <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaCheck size={12} />
              )}
              <span>{isAddMode ? "Qo'shish" : "Saqlash"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
