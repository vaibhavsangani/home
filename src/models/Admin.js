import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true }
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
