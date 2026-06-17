import React from 'react';
import { FaExclamationTriangle, FaTrash, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Ha, o\'chirish',
  cancelText = 'Bekor qilish',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getThemeClasses = () => {
    switch (type) {
      case 'danger':
        return {
          border: 'border-t-4 border-t-red-500 border-white/10',
          iconBg: 'bg-red-500/10 border-red-500/30 text-red-500',
          icon: <FaTrash size={22} />,
          btnConfirm: 'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg hover:shadow-red-500/20'
        };
      case 'info':
        return {
          border: 'border-t-4 border-t-emerald-500 border-white/10',
          iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: <FaInfoCircle size={22} />,
          btnConfirm: 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/20'
        };
      case 'warning':
      default:
        return {
          border: 'border-t-4 border-t-amber-500 border-white/10',
          iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
          icon: <FaExclamationTriangle size={22} />,
          btnConfirm: 'bg-amber-500 hover:bg-amber-600 text-zinc-950 hover:shadow-lg hover:shadow-amber-500/20'
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[250] p-4 animate-fadeIn">
      {/* Backdrop clickable overlay */}
      <div className="absolute inset-0 cursor-default" onClick={onCancel}></div>

      {/* Modal Card */}
      <div className={`relative max-w-sm w-full bg-zinc-900 ${theme.border} rounded-3xl p-6 space-y-5 shadow-2xl z-10 animate-bounce-in`}>
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
        >
          <FaTimes size={14} />
        </button>

        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          {/* Icon Badge */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${theme.iconBg}`}>
            {theme.icon}
          </div>

          {/* Title & Message */}
          <div className="space-y-1.5">
            <h4 className="text-lg font-bold text-white leading-tight">
              {title}
            </h4>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-[280px] mx-auto font-medium">
              {message}
            </p>
          </div>
        </div>

        {/* Buttons Action */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all border border-white/5 active:scale-95 cursor-pointer"
          >
            {cancelText}
          </button>
          
          <button
            onClick={() => {
              onConfirm();
            }}
            className={`flex-1 font-bold py-2.5 px-4 rounded-xl text-xs transition-all active:scale-95 border-none cursor-pointer ${theme.btnConfirm}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
