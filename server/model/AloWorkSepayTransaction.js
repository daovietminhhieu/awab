const mongoose = require('mongoose');

const sepayTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  id: { type: String, unique: true, required: true },
  gateway: String,
  transaction_date: Date,
  account_number: String,
  sub_account: String,
  amount_in: Number,
  amount_out: Number,
  accumulated: Number,
  code: String,
  transaction_content: String,
  reference_number: String,
  webhookSecret: String,
  verified: { type: Boolean, default: false },
  payment_status: {
    type: String,
    enum: ['Pending', 'Paid', 'Cancelled', 'Refunded'],
    default: 'Pending',
    required: true
  },
  description: String,
});

sepayTransactionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('SepayTransaction', sepayTransactionSchema); 