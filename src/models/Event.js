import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  venue: { type: String, required: true },
  city: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  timestamp: { type: Number, default: Date.now }
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
