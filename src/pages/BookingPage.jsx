import React, { useState, useEffect } from 'react';
import ServiceSelection from '../components/features/booking/ServiceSelection';
import TimeSelection from '../components/features/booking/TimeSelection';
import PaymentForm from '../components/features/payment/PaymentForm';
import SuccessModal from '../components/features/payment/SuccessModal';
import AuthModal from '../components/features/auth/AuthModal';
import barberData from '../data/barber.json';
// Eski telegram.js o'rniga biz yaratgan api.js ni chaqiramiz
import { submitBooking } from '../utils/api'; 
import { useStep } from '../hooks/useStep';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const STEPS = {
  SERVICE: 1,
  TIME: 2,
  PAYMENT: 3,
};

const BookingPage = () => {
  const { currentStep, setCurrentStep } = useStep();
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    phone: '',
    telegram: '',
  });
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'card',
    receipt: null,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-fill info if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setPersonalInfo({
        name: user.name,
        phone: user.phone,
        telegram: user.telegram || '',
      });
    }
  }, [isAuthenticated, user]);

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const validateStep = () => {
    switch (currentStep) {
      case STEPS.SERVICE:
        return selectedService !== null;
      case STEPS.TIME:
        return selectedDate !== null && selectedTime !== null;
      case STEPS.PAYMENT:
        if (paymentData.paymentMethod === 'cash') {
          return true;
        }
        return paymentData.receipt !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === STEPS.TIME) {
        if (!isAuthenticated) {
          setIsAuthModalOpen(true);
        } else {
          setCurrentStep(STEPS.PAYMENT);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (currentStep < STEPS.PAYMENT) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handlePayment();
      }
    } else {
      toast.error('Iltimos, barcha maydonlarni to\'ldiring');
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.SERVICE) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAuthSuccess = (loggedInUser) => {
    setPersonalInfo({
      name: loggedInUser.name,
      phone: loggedInUser.phone,
      telegram: loggedInUser.telegram || '',
    });
    setCurrentStep(STEPS.PAYMENT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // YANGILANGAN TO'LOV FUNKSIYASI
  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // 1. Backend kutayotgan formatda ma'lumotlarni yig'amiz
      const bookingInfo = {
        name: personalInfo.name,
        phone: personalInfo.phone,
        telegram_user: personalInfo.telegram,
        service: {
          name: selectedService.name,
          price: selectedService.price,
        },
        date: formatDate(selectedDate),
        time: selectedTime,
      };

      // 2. api.js dagi funksiya orqali Render backendimizga jo'natamiz
      const result = await submitBooking(bookingInfo, paymentData);
      console.log(result.message); // "Buyurtma qabul qilindi..."

      // 3. Muvaffaqiyatli bo'lsa modalni ochamiz
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(error.message || 'Xatolik yuz berdi. Iltimos, server ulanishini tekshiring.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setCurrentStep(STEPS.SERVICE);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setPersonalInfo({ name: '', phone: '', telegram: '' });
    setPaymentData({ paymentMethod: 'card', receipt: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case STEPS.SERVICE:
        return 'Xizmatni tanlang';
      case STEPS.TIME:
        return 'Sana va vaqtni tanlang';
      case STEPS.PAYMENT:
        return 'To\'lov';
      default:
        return '';
    }
  };

  return (
    <div className="w-full lg:w-5/6 ml-auto pb-0 lg:pb-32 relative">
      {/* Step indicator for mobile */}
      <div className="md:hidden mb-5 max-w-max mx-auto flex items-center justify-center gap-3 px-4 py-2 bg-zinc-900/80 border border-emerald-500/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md">
        {currentStep > 1 && (
          <>
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-emerald-500/20 text-white transition-all active:scale-[0.9] cursor-pointer shadow-md shrink-0"
              title="Ortga"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-[1px] h-5 bg-white/10 shrink-0" />
          </>
        )}
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div
              className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                step === currentStep
                  ? 'bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/40 border border-emerald-400/50 scale-110'
                  : step < currentStep
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-zinc-800/40 text-zinc-500 border border-white/5'
              }`}
            >
              {step < currentStep ? '✓' : step}
              {step === currentStep && (
                <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping"></span>
              )}
            </div>
            {step < 3 && (
              <div className={`w-6 h-0.5 rounded-full transition-colors duration-300 ${step < currentStep ? 'bg-emerald-400' : 'bg-zinc-850'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Title */}
      <div className="mb-4 px-0">
        <h2 className="text-center text-xl sm:text-2xl font-extrabold text-white mb-1">
          {getStepTitle()}
        </h2>
        <p className="text-center text-xs sm:text-sm text-zinc-400">
          {currentStep === STEPS.SERVICE && 'Qaysi xizmatni tanlamoqchisiz?'}
          {currentStep === STEPS.TIME && 'Sizga qulay vaqtni tanlang'}
          {currentStep === STEPS.PAYMENT && 'To\'lov ma\'lumotlarini kiriting'}
        </p>
      </div>

      {/* Step Content */}
      <div className="max-w-5xl mx-auto px-0 md:px-8">
        {currentStep === STEPS.SERVICE && (
          <ServiceSelection
            services={barberData.services}
            selectedService={selectedService}
            onSelectService={(service) => {
              setSelectedService(service);
              setTimeout(() => {
                setCurrentStep(STEPS.TIME);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 400);
            }}
          />
        )}

        {currentStep === STEPS.TIME && (
          <TimeSelection
            timeSlots={barberData.timeSlots}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={setSelectedDate}
            onSelectTime={(time) => {
              setSelectedTime(time);
              if (!time) return; // Vaqt tozalanganda (masalan, sana o'zgarganda) keyingi bosqichga o'tmaymiz
              setTimeout(() => {
                if (!isAuthenticated) {
                  setIsAuthModalOpen(true);
                } else {
                  setCurrentStep(STEPS.PAYMENT);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }, 400);
            }}
          />
        )}

        {currentStep === STEPS.PAYMENT && (
          <PaymentForm
            paymentData={paymentData}
            onUpdate={setPaymentData}
            bookingInfo={{
              service: selectedService,
              date: formatDate(selectedDate),
              time: selectedTime,
            }}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className={`w-full p-4 mt-6 border-t border-white/5 bg-zinc-900/30 rounded-2xl lg:fixed lg:bottom-0 lg:right-0 lg:w-5/6 lg:bg-zinc-950/90 lg:backdrop-blur-xl lg:border-t lg:border-white/5 lg:p-6 lg:z-40 lg:shadow-[0_-10px_30px_rgba(0,0,0,0.3)] lg:rounded-none lg:border-none lg:mt-0 ${
        currentStep <= STEPS.TIME ? 'hidden lg:hidden' : 'block lg:block'
      }`}>
        <div className="max-w-5xl mx-auto flex gap-3 md:gap-4">
          <button
            onClick={handleNext}
            disabled={!validateStep() || isProcessing}
            className={`group relative flex-1 py-3 md:py-4 px-4 rounded-xl font-semibold overflow-hidden shadow-lg transition-all duration-300 ease-out border backdrop-blur-xl ${
              validateStep() && !isProcessing
                ? 'bg-linear-to-br from-emerald-500 via-emerald-600 to-green-600 text-white hover:shadow-2xl hover:shadow-emerald-500/50 active:scale-[0.98] border-emerald-400'
                : 'bg-white/10 text-gray-400 cursor-not-allowed border-white/20'
            }`}
          >
            {validateStep() && !isProcessing && (
              <span className="absolute inset-0 bg-linear-to-r from-emerald-400/0 via-white/30 to-emerald-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
            )}
            <span className="relative flex items-center justify-center gap-2">
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-base md:text-lg animate-pulse">Kutilmoqda...</span>
                </>
              ) : currentStep === STEPS.PAYMENT ? (
                <>
                  <span className="text-xl md:text-2xl transition-transform duration-300 group-hover:scale-110">💳</span>
                  <span className="text-base md:text-lg">To'lovni amalga oshirish</span>
                </>
              ) : (
                <>
                  <span className="text-base md:text-lg">Keyingisi</span>
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        bookingData={{
          service: selectedService,
          date: formatDate(selectedDate),
          time: selectedTime,
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default BookingPage;