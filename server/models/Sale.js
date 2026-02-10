const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  agentName: {
    type: String,
    required: [true, 'Agent name is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Sales amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  numberOfSales: {
    type: Number,
    required: [true, 'Number of sales is required'],
    min: [1, 'Number of sales must be at least 1'],
    default: 1
  },
  saleDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
salesSchema.index({ agentName: 1 });
salesSchema.index({ saleDate: -1 });

module.exports = mongoose.model('Sale', salesSchema);