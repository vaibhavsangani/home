import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true },
  adminEmail: { type: String }, // For OTP login
  otpCode: { type: String },
  otpExpires: { type: Date }
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
