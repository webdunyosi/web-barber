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
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: '',
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
        return (
          paymentData.cardNumber.replace(/\s/g, '').length === 16 &&
          paymentData.expiry.length === 5 &&
          paymentData.cvv.length === 3 &&
          paymentData.cardholderName.trim() !== ''
        );
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
        cardNumber: paymentData.cardNumber,
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
    setPaymentData({ cardNumber: '', expiry: '', cvv: '', cardholderName: '' });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 web-pattern">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">💈</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Barber Shop</h1>
                <p className="text-sm text-gray-600">Professional Sartaroshxona</p>
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
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-2">
            {getStepTitle()}
          </h2>
          <p className="text-center text-gray-600">
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
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              ← Ortga
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!validateStep() || isProcessing}
            className={`flex-1 py-4 rounded-lg font-semibold transition-colors ${
              validateStep() && !isProcessing
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Kutilmoqda...
              </span>
            ) : currentStep === STEPS.PAYMENT ? (
              '💳 To\'lovni amalga oshirish'
            ) : (
              'Keyingisi →'
            )}
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

      {/* Footer */}
      <footer className="bg-white shadow-md mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © 2024 Barber Shop. Barcha huquqlar himoyalangan.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              📞 +998 XX XXX XX XX | 📍 Toshkent, O'zbekiston
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;