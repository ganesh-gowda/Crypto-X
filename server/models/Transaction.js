import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['buy', 'sell', 'transfer'],
    required: true
  },
  coinId: {
    type: String,
    required: true
  },
  coinName: {
    type: String,
    required: true
  },
  coinSymbol: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  totalValue: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, coinId: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
