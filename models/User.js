import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  status: String
});

export default mongoose.models.User || mongoose.model('User', userSchema);