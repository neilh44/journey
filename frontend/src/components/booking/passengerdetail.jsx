import React from 'react';
import { useForm } from 'react-hook-form';

const PassengerDetails = ({ passengers, onUpdate, onNext }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      passengers: passengers.length > 0 ? passengers : [{ type: 'adult' }]
    }
  });

  const onSubmit = (data) => {
    onUpdate(data.passengers);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Passenger form fields */}
    </form>
  );
};

