import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("Mongodb Atlas has been Connected Successfully");
  } catch (error) {
    console.error("DB Error:", error);
    console.log("Mongodb Atlas connection error");
  }
};

// Keep Product schema here temporarily
const productSchema = new mongoose.Schema({
  itemName: String,
  category: String,
  price: Number,
  stock: Number,
  image: String,
  status: String,
  isActive: Boolean
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const customerSchema = new mongoose.Schema({
  customerId: String,
  name: String,
  totalOrders: Number,
  totalSpent: Number,
  lastOrderDate: Date
}, { timestamps: true });

export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);