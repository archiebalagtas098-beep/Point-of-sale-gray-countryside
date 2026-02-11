import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  paymentMethod: String,
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'preparing', 'ready', 'served', 'cancelled', 'completed']
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customerId: {
    type: String,
    required: true
  },
  tableNumber: String
}, { 
  timestamps: true 
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);