import mongoose from "mongoose";

const stockNotificationSchema = new mongoose.Schema({
  productName: String,
  currentStock: Number,
  minStock: Number,
  message: String,
  isRead: Boolean
}, { timestamps: true });

export default mongoose.models.StockNotification || mongoose.model('StockNotification', stockNotificationSchema);