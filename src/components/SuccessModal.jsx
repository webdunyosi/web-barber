import React from 'react';
import { formatPrice } from '../utils/format';

const SuccessModal = ({ isOpen, onClose, bookingData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800/70 border border-green-500/50 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-bounce-in backdrop-blur-md">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50">
            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Muvaffaqiyatli!
        </h2>
        <p className="text-center text-gray-300 mb-8">
          Buyurtmangiz qabul qilindi va to'lov amalga oshirildi. Telegram orqali tasdiqlash xabari yuborildi.
        </p>

        {/* Booking Details */}
        <div className="bg-zinc-900/50 rounded-lg p-6 mb-6 space-y-3 border border-zinc-700/50">
          <div className="flex justify-between">
            <span className="text-gray-400">Xizmat:</span>
            <span className="font-semibold text-white">{bookingData.service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Sana:</span>
            <span className="font-semibold text-white">{bookingData.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Vaqt:</span>
            <span className="font-semibold text-white">{bookingData.time}</span>
          </div>
          <div className="border-t border-zinc-700/50 my-2"></div>
          <div className="flex justify-between text-lg">
            <span className="text-gray-400">To'langan:</span>
            <span className="font-bold text-emerald-400">
              {formatPrice(bookingData.service.price)} so'm
            </span>
          </div>
        </div>

        {/* Telegram Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <span className="text-2xl">📱</span>
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Telegram xabari yuborildi!</p>
              <p className="text-xs text-blue-300/80">
                Buyurtma va to'lov cheki Telegram akkauntingizga yuborildi. Iltimos, telefonni yonida saqlang.
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg hover:shadow-emerald-500/50"
        >
          Yaxshi
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;