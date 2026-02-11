import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  date: Date,
  totalOrders: Number,
  totalRevenue: Number,
  todayOrders: Number,
  todayRevenue: Number,
  totalCustomers: Number
}, { timestamps: true });

export default mongoose.models.Stats || mongoose.model('Stats', statsSchema);