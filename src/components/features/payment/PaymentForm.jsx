
import React, { useState, useEffect } from "react"
import { formatPrice } from "../../../utils/format"
import { FaReceipt, FaInfoCircle, FaCloudUploadAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"

const PaymentForm = ({ paymentData, onUpdate, bookingInfo }) => {
  const [errors, setErrors] = useState({})
  const [previewUrl, setPreviewUrl] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleCopyCard = () => {
    navigator.clipboard.writeText("4073420068208093")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Order Summary */}
        <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/30 rounded-2xl p-5 sm:p-6 mb-4 md:mb-6 text-white shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0">
              <FaReceipt className="text-base" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Buyurtma tafsilotlari</h3>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-zinc-450 font-medium">Xizmat turi:</span>
              <span className="font-semibold text-zinc-200">{bookingInfo.service.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-450 font-medium">Belgilangan sana:</span>
              <span className="font-semibold text-zinc-200">{bookingInfo.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-450 font-medium">Belgilangan vaqt:</span>
              <span className="font-semibold text-zinc-200">{bookingInfo.time}</span>
            </div>
            <div className="border-t border-zinc-750/50 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-zinc-300">Jami to'lov:</span>
              <span className="font-extrabold text-lg sm:text-xl text-emerald-400">
                {formatPrice(bookingInfo.service.price)} so'm
              </span>
            </div>
          </div>
        </div>

        {/* Card Information Display */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-850 to-zinc-950 border border-zinc-700/30 rounded-2xl p-5 mb-4 md:mb-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[180px]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Top Row: Card Brand & Chip */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                {/* Simulated Chip */}
                <div className="w-9 h-6 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 rounded-sm relative overflow-hidden shadow-inner shrink-0">
                  <div className="absolute inset-x-2 top-0 bottom-0 border-l border-r border-black/10"></div>
                  <div className="absolute inset-y-1.5 left-0 right-0 border-t border-b border-black/10"></div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Online To'lov
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold text-white/35 tracking-wider">PREMIUM</span>
              </div>
            </div>

            {/* Middle Row: Card Number */}
            <div className="mb-4">
              <p className="text-[9px] text-zinc-450 uppercase tracking-widest mb-1.5 font-medium">Karta raqami</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-base sm:text-xl font-bold tracking-wider font-mono text-zinc-100">
                  4073 4200 6820 8093
                </p>
                <button
                  onClick={handleCopyCard}
                  className="px-2.5 py-1 text-[10px] rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 transition-all flex items-center gap-1 active:scale-95 cursor-pointer shrink-0 font-medium"
                >
                  {copied ? "✓ Nusxalandi" : "Nusxalash"}
                </button>
              </div>
            </div>

            {/* Bottom Row: Holder & Network */}
            <div className="flex items-end justify-between gap-4 mt-auto">
              <div className="min-w-0">
                <p className="text-[9px] text-zinc-450 uppercase tracking-widest mb-0.5 font-medium">Karta egasi</p>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide truncate text-zinc-200">
                  Alimardon Toshpulatov
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/30 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white tracking-wider">UZCARD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/20 rounded-2xl p-4 sm:p-5 mb-4 md:mb-6">
        {/* Header: Icon and Title side-by-side */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <FaInfoCircle className="text-sm" />
          </div>
          <h4 className="font-bold text-sm sm:text-base text-white">
            To'lov qilish bo'yicha ko'rsatma
          </h4>
        </div>
        {/* List: Starts from the left under the header - High contrast white text */}
        <ol className="text-xs space-y-1.5 text-zinc-100 list-decimal list-inside leading-relaxed pl-0.5">
          <li>Karta raqamini nusxalab o'z bank ilovangizga o'ting</li>
          <li>Ko'rsatilgan summani o'tkazing va chekni saqlab oling</li>
          <li>To'lov chekining rasmini quyidagi qismga yuklang</li>
          <li>Pastdagi "To'lovni amalga oshirish" tugmasini bosing</li>
        </ol>
      </div>

      {/* Receipt Upload */}
      <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/30 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0">
            <FaCloudUploadAlt className="text-lg" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">To'lov chekini yuklang</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-zinc-300 mb-2 font-medium">
              Chek surati (JPG, PNG yoki WEBP formatlarida, max 5MB) *
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
                className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-zinc-750 hover:border-emerald-500/50 rounded-xl cursor-pointer bg-zinc-900/20 hover:bg-zinc-900/40 transition-all duration-300 group backdrop-blur-md hover:scale-[1.005]"
              >
                {paymentData.receipt ? (
                  <div className="flex flex-col items-center gap-1 px-4 text-center">
                    <FaCheckCircle className="text-2xl text-emerald-400 animate-pulse" />
                    <p className="text-xs text-emerald-400 font-semibold truncate max-w-xs sm:max-w-md">
                      {paymentData.receipt.name}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {(paymentData.receipt.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <FaCloudUploadAlt className="text-2xl text-zinc-400 group-hover:text-emerald-400 transition-colors duration-300" />
                    <p className="text-xs text-zinc-300 group-hover:text-emerald-400 transition-colors">
                      Bosing yoki rasmni shu yerga sudrab yuklang
                    </p>
                    <p className="text-[10px] text-zinc-300">
                      Format: JPG, PNG, WEBP (max 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>

            {errors.receipt && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                <FaExclamationCircle className="shrink-0" />
                {errors.receipt}
              </p>
            )}
          </div>

          {/* Preview uploaded image */}
          {paymentData.receipt && previewUrl && (
            <div className="mt-3 p-2 bg-zinc-900/40 rounded-xl border border-zinc-800/80 flex flex-col items-center">
              <p className="text-xs text-zinc-300 mb-1.5 font-medium self-start">
                Yuklangan chek:
              </p>
              <div className="relative w-full max-w-[140px] aspect-square overflow-hidden rounded-lg border border-zinc-700/50 shadow-inner">
                <img
                  src={previewUrl}
                  alt="To'lov cheki"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentForm
