const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String
  },
  website: {
    type: String
  },
  apiEndpoint: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    required: true
  },
  shippingMethods: [{
    name: String,
    price: Number,
    estimatedDays: Number
  }],
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Supplier', SupplierSchema); 