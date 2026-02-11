import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
  itemName: String,
  category: String,
  currentStock: Number,
  minStock: Number,
  maxStock: Number,
  unit: String,
  itemType: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.models.InventoryItem || mongoose.model('InventoryItem', inventoryItemSchema);