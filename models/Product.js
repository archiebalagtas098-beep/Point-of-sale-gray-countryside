import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  itemName: String,
  category: String,
  price: Number,
  stock: Number,
  image: String,
  status: String,
  isActive: Boolean
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);