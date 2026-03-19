import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gstNumber: { type: String },
  category: { type: String },
  stallSize: { type: String },
  status: { type: String, enum: ['pending', 'verified', 'confirmed'], default: 'pending' },
  date: { type: String, required: true },
  timestamp: { type: Number, default: Date.now }
});

export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
