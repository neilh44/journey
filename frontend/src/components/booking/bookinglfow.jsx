import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PassengerDetails from './PassengerDetails';
import SeatSelection from './SeatSelection';
import AddOns from './AddOns';
import PaymentForm from './PaymentForm';
import BookingSummary from './BookingSummary';
import { Alert } from '@/components/ui/alert';

const BOOKING_STEPS = {
  PASSENGER: 'passenger',
  SEAT: 'seat',
  ADDONS: 'addons',
  PAYMENT: 'payment',
  SUMMARY: 'summary'
};

const BookingFlow = ({ selectedFlight }) => {
  const [currentStep, setCurrentStep] = useState(BOOKING_STEPS.PASSENGER);
  const [bookingData, setBookingData] = useState({
    passengers: [],
    seats: [],
    addOns: [],
    paymentDetails: null,
    totalPrice: selectedFlight?.price || 0
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleNext = () => {
    const steps = Object.values(BOOKING_STEPS);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps = Object.values(BOOKING_STEPS);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const updateBookingData = (key, value) => {
    setBookingData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case BOOKING_STEPS.PASSENGER:
        return (
          <PassengerDetails
            passengers={bookingData.passengers}
            onUpdate={(passengers) => updateBookingData('passengers', passengers)}
            onNext={handleNext}
          />
        );
      case BOOKING_STEPS.SEAT:
        return (
          <SeatSelection
            passengers={bookingData.passengers}
            selectedSeats={bookingData.seats}
            onUpdate={(seats) => updateBookingData('seats', seats)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case BOOKING_STEPS.ADDONS:
        return (
          <AddOns
            selectedAddOns={bookingData.addOns}
            onUpdate={(addOns) => updateBookingData('addOns', addOns)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case BOOKING_STEPS.PAYMENT:
        return (
          <PaymentForm
            amount={bookingData.totalPrice}
            onSubmit={(paymentDetails) => {
              updateBookingData('paymentDetails', paymentDetails);
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      case BOOKING_STEPS.SUMMARY:
        return (
          <BookingSummary
            bookingData={bookingData}
            selectedFlight={selectedFlight}
            onConfirm={handleBookingConfirmation}
          />
        );
      default:
        return null;
    }
  };

  const handleBookingConfirmation = async () => {
    try {
      // API call will be implemented later
      const response = await bookFlight(bookingData);
      navigate('/booking/confirmation', { 
        state: { bookingReference: response.bookingReference } 
      });
    } catch (err) {
      setError('Failed to complete booking. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}
      <div className="mb-8">
        <BookingProgress currentStep={currentStep} />
      </div>
      {renderStep()}
    </div>
  );
};

export default BookingFlow;
