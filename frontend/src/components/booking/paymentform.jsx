const PaymentForm = ({ amount, onSubmit, onBack }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Payment form fields */}
      </form>
    );
  };
  