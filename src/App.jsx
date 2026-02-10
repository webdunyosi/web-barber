import React, { useState } from 'react';
import ServiceSelection from './components/ServiceSelection';
import TimeSelection from './components/TimeSelection';
import PersonalInfoForm from './components/PersonalInfoForm';
import PaymentForm from './components/PaymentForm';
import SuccessModal from './components/SuccessModal';
import barberData from './data/barber.json';
import { sendBookingToTelegram, sendPaymentReceiptToTelegram } from './utils/telegram';

const STEPS = {
  SERVICE: 1,
  TIME: 2,
  PERSONAL_INFO: 3,
  PAYMENT: 4,
};

const App = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.SERVICE);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    phone: '',
    telegram: '',
  });
  const [paymentData, setPaymentData] = useState({
    receipt: null,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
      case STEPS.PERSONAL_INFO:
        return (
          personalInfo.name.trim() !== '' &&
          personalInfo.phone.trim() !== '' &&
          personalInfo.phone.replace(/\D/g, '').length === 12
        );
      case STEPS.PAYMENT:
        return paymentData.receipt !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < STEPS.PAYMENT) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handlePayment();
      }
    } else {
      alert('Iltimos, barcha maydonlarni to\'ldiring');
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.SERVICE) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const bookingInfo = {
        service: selectedService,
        date: formatDate(selectedDate),
        time: selectedTime,
        name: personalInfo.name,
        phone: personalInfo.phone,
        telegram: personalInfo.telegram,
      };

      // Send booking confirmation to Telegram
      await sendBookingToTelegram(bookingInfo);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Send payment receipt to Telegram
      const paymentInfo = {
        ...bookingInfo,
        receipt: paymentData.receipt,
      };
      await sendPaymentReceiptToTelegram(paymentInfo);

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Reset form
    setCurrentStep(STEPS.SERVICE);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setPersonalInfo({ name: '', phone: '', telegram: '' });
    setPaymentData({ receipt: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case STEPS.SERVICE:
        return 'Xizmatni tanlang';
      case STEPS.TIME:
        return 'Sana va vaqtni tanlang';
      case STEPS.PERSONAL_INFO:
        return 'Ma\'lumotlaringizni kiriting';
      case STEPS.PAYMENT:
        return 'To\'lov';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 web-pattern">
      {/* Header */}
      <header className="bg-linear-to-r from-zinc-900/95 via-zinc-950/95 to-zinc-900/95 backdrop-blur-lg text-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">💈</span>
              <div>
                <h1 className="text-2xl font-bold">Barber Shop</h1>
                <p className="text-sm">Professional Sartaroshxona</p>
              </div>
            </div>
            {/* Step Indicator */}
            <div className="hidden md:flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      step === currentStep
                        ? 'bg-emerald-500 text-white'
                        : step < currentStep
                        ? 'bg-emerald-200 text-emerald-700'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-8 h-1 rounded ${
                        step < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-center text-3xl font-bold text-white mb-2">
            {getStepTitle()}
          </h2>
          <p className="text-center text-white/70">
            {currentStep === STEPS.SERVICE && 'Qaysi xizmatni tanlamoqchisiz?'}
            {currentStep === STEPS.TIME && 'Sizga qulay vaqtni tanlang'}
            {currentStep === STEPS.PERSONAL_INFO && 'Bog\'lanish uchun ma\'lumotlar'}
            {currentStep === STEPS.PAYMENT && 'To\'lov ma\'lumotlarini kiriting'}
          </p>
        </div>

        {/* Step Content */}
        <div className="max-w-5xl mx-auto">
          {currentStep === STEPS.SERVICE && (
            <ServiceSelection
              services={barberData.services}
              selectedService={selectedService}
              onSelectService={setSelectedService}
            />
          )}

          {currentStep === STEPS.TIME && (
            <TimeSelection
              timeSlots={barberData.timeSlots}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectDate={setSelectedDate}
              onSelectTime={setSelectedTime}
            />
          )}

          {currentStep === STEPS.PERSONAL_INFO && (
            <PersonalInfoForm
              formData={personalInfo}
              onUpdate={setPersonalInfo}
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
        <div className="max-w-5xl mx-auto mt-8 flex gap-4">
          {currentStep > STEPS.SERVICE && (
            <button
              onClick={handleBack}
              className="group relative flex-1 bg-linear-to-br from-zinc-700 via-zinc-800 to-zinc-900 text-white py-4 px-6 rounded-xl font-semibold overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] border border-zinc-600 hover:border-zinc-500"
            >
              <span className="absolute inset-0 bg-linear-to-r from-zinc-600/0 via-zinc-500/30 to-zinc-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
              <span className="relative flex items-center justify-center gap-2">
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-lg">Ortga</span>
              </span>
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!validateStep() || isProcessing}
            className={`group relative flex-1 py-4 px-6 rounded-xl font-semibold overflow-hidden shadow-lg transition-all duration-300 ease-out border ${
              validateStep() && !isProcessing
                ? 'bg-linear-to-br from-emerald-500 via-emerald-600 to-green-600 text-white hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] border-emerald-400 hover:border-emerald-300'
                : 'bg-zinc-800/40 backdrop-blur-md text-gray-400 cursor-not-allowed border-zinc-700/50 shadow-inner'
            }`}
            style={!validateStep() && !isProcessing ? {
              animation: 'disabled-pulse 2s ease-in-out infinite',
              background: 'linear-gradient(135deg, rgba(39, 39, 42, 0.4) 0%, rgba(63, 63, 70, 0.3) 50%, rgba(39, 39, 42, 0.4) 100%)',
              backgroundSize: '200% 100%',
              backgroundPosition: '0% center'
            } : {}}
          >
            {validateStep() && !isProcessing && (
              <span className="absolute inset-0 bg-linear-to-r from-emerald-400/0 via-white/30 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
            )}
            {!validateStep() && !isProcessing && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/20 to-transparent" style={{
                animation: 'disabled-shimmer 3s linear infinite',
                backgroundSize: '200% 100%'
              }}></span>
            )}
            <span className="relative flex items-center justify-center gap-2">
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-lg animate-pulse">Kutilmoqda...</span>
                </>
              ) : currentStep === STEPS.PAYMENT ? (
                <>
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110" role="img" aria-label="Karta belgisi">💳</span>
                  <span className="text-lg">To'lovni amalga oshirish</span>
                </>
              ) : (
                <>
                  <span className="text-lg">Keyingisi</span>
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>
      </main>

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
    </div>
  );
};

export default App;