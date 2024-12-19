// backend/src/models/order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  flightDetails: {
    offerId: String,
    searchId: String,
    departureCity: String,
    arrivalCity: String,
    departureDate: Date,
    arrivalDate: Date,
    passengers: [{
      type: String,
      firstName: String,
      lastName: String,
      dateOfBirth: Date,
      documentNumber: String
    }],
    seats: [{
      passengerIndex: Number,
      seatNumber: String,
      cabin: String
    }],
    baggage: [{
      passengerIndex: Number,
      type: String,
      quantity: Number
    }]
  },
  paymentDetails: {
    paymentMethod: String,
    transactionId: String,
    paymentDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ orderId: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to update timestamps
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
orderSchema.methods.isPending = function() {
  return this.status === 'PENDING';
};

orderSchema.methods.isPaymentCompleted = function() {
  return this.paymentStatus === 'PAID';
};

orderSchema.methods.canBeCancelled = function() {
  return ['PENDING', 'CONFIRMED'].includes(this.status);
};

// Static methods
orderSchema.statics.findByUserId = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

orderSchema.statics.findPendingOrders = function() {
  return this.find({ status: 'PENDING' });
};

const Order = mongoose.model('Order', orderSchema);

export { Order };