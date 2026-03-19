import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  type: { type: String, enum: ['new', 'invited', 'stall'], default: 'new' },
  status: { type: String, enum: ['pending', 'verified', 'confirmed'], default: 'pending' },
  ticketType: { type: String, enum: ['free', 'paid'], default: 'free' },
  date: { type: String, required: true },
  timestamp: { type: Number, default: Date.now }
});

export default mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
