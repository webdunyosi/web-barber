import React from 'react';
import { formatPrice } from '../utils/format';

const SuccessModal = ({ isOpen, onClose, bookingData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-bounce-in">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Muvaffaqiyatli!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Buyurtmangiz qabul qilindi va to'lov amalga oshirildi. Telegram orqali tasdiqlash xabari yuborildi.
        </p>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Xizmat:</span>
            <span className="font-semibold text-gray-800">{bookingData.service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sana:</span>
            <span className="font-semibold text-gray-800">{bookingData.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Vaqt:</span>
            <span className="font-semibold text-gray-800">{bookingData.time}</span>
          </div>
          <div className="border-t border-gray-300 my-2"></div>
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">To'langan:</span>
            <span className="font-bold text-emerald-600">
              {formatPrice(bookingData.service.price)} so'm
            </span>
          </div>
        </div>

        {/* Telegram Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <span className="text-2xl">📱</span>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Telegram xabari yuborildi!</p>
              <p className="text-xs">
                Buyurtma va to'lov cheki Telegram akkauntingizga yuborildi. Iltimos, telefonni yonida saqlang.
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
        >
          Yaxshi
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;