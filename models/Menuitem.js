import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  name: String,
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: 'default_food.jpg'
  },
  unit: {
    type: String,
    default: 'piece'
  },
  currentStock: {
    type: Number,
    default: 0
  },
  minStock: {
    type: Number,
    default: 0
  },
  maxStock: {
    type: Number,
    default: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  itemType: {
    type: String,
    default: 'finished'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);