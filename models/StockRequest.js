import mongoose from "mongoose";

const stockRequestSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false  // Changed to optional to support temporary IDs from fallback mode
  },
  productName: {
    type: String,
    required: true
  },
  requestedQuantity: {
    type: Number,
    required: true
  },
  unit: String,
  currentStock: Number,
  minStock: Number,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected', 'fulfilled']
  },
  requestedBy: {
    type: String,
    default: 'staff'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  fulfilledQuantity: {
    type: Number,
    default: 0
  },
  fulfilledDate: Date,
  notes: String
}, { 
  timestamps: true 
});

// Check if model already exists, otherwise create it
const StockRequest = mongoose.models.StockRequest || mongoose.model('StockRequest', stockRequestSchema);

export default StockRequest;