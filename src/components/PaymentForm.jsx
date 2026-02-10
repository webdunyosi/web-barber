import React, { useState, useEffect } from "react"
import { formatPrice } from "../utils/format"

const PaymentForm = ({ paymentData, onUpdate, bookingInfo }) => {
  const [errors, setErrors] = useState({})
  const [previewUrl, setPreviewUrl] = useState(null)

  // Cleanup preview URL on unmount or when receipt changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setErrors({ receipt: "Faqat rasm fayllarini yuklang (JPG, PNG, WEBP)" })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ receipt: "Fayl hajmi 5MB dan kichik bo'lishi kerak" })
        return
      }

      // Revoke old preview URL if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      // Create new preview URL
      const newPreviewUrl = URL.createObjectURL(file)
      setPreviewUrl(newPreviewUrl)

      onUpdate({ ...paymentData, receipt: file })
      setErrors({ ...errors, receipt: "" })
    }
  }

  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
        {/* Order Summary */}
        <div className="bg-linear-to-br from-zinc-800/90 to-zinc-900/90 border border-emerald-500/30 rounded-2xl p-8 mb-6 text-white shadow-2xl backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Buyurtma tafsilotlari
          </h3>
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
              <span className="font-bold text-emerald-400">
                {formatPrice(bookingInfo.service.price)} so'm
              </span>
            </div>
          </div>
        </div>
        {/* Card Information Display */}
        <div className="bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded-2xl p-8 mb-6 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-12 h-8 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-md"></div>
                <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                  Bank Kartasi
                </span>
              </div>
              <svg
                className="w-12 h-12 opacity-90"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="23"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="16"
                  cy="24"
                  r="8"
                  fill="currentColor"
                  opacity="0.5"
                />
                <circle
                  cx="32"
                  cy="24"
                  r="8"
                  fill="currentColor"
                  opacity="0.5"
                />
              </svg>
            </div>

            <div className="mb-6">
              <p className="text-sm opacity-80 mb-2">Karta raqami</p>
              <p className="text-3xl font-bold tracking-wider font-mono">
                4073 4200 6820 8093
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs opacity-80 mb-1">Karta egasi</p>
                <p className="text-lg font-semibold uppercase tracking-wide">
                  Alimardon Toshpulatov
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">💳 Uzcard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-linear-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/40 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-2xl">💡</span>
          </div>
          <div className="text-white">
            <h4 className="font-semibold text-lg mb-2">
              To'lov qilish bo'yicha ko'rsatma
            </h4>
            <ol className="text-sm space-y-2 opacity-90 list-decimal list-inside">
              <li>Yuqoridagi karta raqamiga o'z ilovangizdan pul o'tkazing</li>
              <li>To'lov amalga oshirilgandan keyin chekni surat qiling</li>
              <li>Suratni quyidagi tugma orqali yuklang</li>
              <li>"To'lovni amalga oshirish" tugmasini bosing</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Receipt Upload */}
      <div className="bg-linear-to-br from-zinc-800/90 to-zinc-900/90 border border-emerald-500/30 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🧾</span>
          To'lov chekini yuklang
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Chek surati (JPG, PNG yoki WEBP) *
            </label>

            {/* File input button */}
            <div className="relative">
              <input
                type="file"
                id="receipt-upload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="receipt-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-emerald-500/40 rounded-xl cursor-pointer bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-300 group backdrop-blur-md hover:border-emerald-500/70 hover:scale-[1.02]"
              >
                {paymentData.receipt ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-12 h-12 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-emerald-400 font-medium">
                      {paymentData.receipt.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(paymentData.receipt.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-emerald-500 mt-2">
                      Boshqa rasm yuklash uchun bosing
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-12 h-12 text-gray-400 group-hover:text-emerald-500 transition-colors duration-300 group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-400 group-hover:text-emerald-500 transition-colors">
                      <span className="font-semibold">Bosing</span> yoki shu
                      yerga tashlang
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG yoki WEBP (max 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>

            {errors.receipt && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.receipt}
              </p>
            )}
          </div>

          {/* Preview uploaded image */}
          {paymentData.receipt && previewUrl && (
            <div className="mt-4 p-4 bg-zinc-900/70 rounded-xl border border-emerald-500/20">
              <p className="text-sm text-gray-300 mb-2 font-medium">
                Yuklangan chek:
              </p>
              <img
                src={previewUrl}
                alt="To'lov cheki"
                className="w-full h-auto max-h-64 object-contain rounded-lg border border-emerald-500/30"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentForm
