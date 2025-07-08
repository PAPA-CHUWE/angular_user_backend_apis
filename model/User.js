// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  department: String
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
