import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String },
  address: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String },
  businessCategory: { type: String },
  productDetails: { type: String },
  previousParticipation: { type: String },
  productRange: {
    from: { type: Number },
    to: { type: Number }
  },
  gstNumber: { type: String },
  aadharNumber: { type: String, required: true },
  aadharCard: { type: String }, // URL or path
  panCard: { type: String }, // URL or path
  gstPdf: { type: String }, // URL or path
  productPhotos: [{ type: String }], // Array of URLs or paths
  website: { type: String },
  facebookId: { type: String },
  instagramId: { type: String },
  status: { type: String, enum: ['pending', 'verified', 'confirmed'], default: 'pending' },
  checkedIn: { type: Boolean, default: false },
  checkInTime: { type: Date },
  date: { type: String, required: true },
  timestamp: { type: Number, default: Date.now }
});

export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
