import mongoose from 'mongoose';

const OrgSchema = new mongoose.Schema({
  companyName: { type: String, default: 'Didaar Exhibition' },
  visionStatement: { type: String, default: '' },
  coreTeam: {
    owner: { name: String, detail: String, photo: String },
    manager: { name: String, detail: String, photo: String },
    company: { name: String, detail: String, photo: String }
  },
  additionalMembers: [{
    id: String,
    name: String,
    role: String,
    photo: String
  }]
});

export default mongoose.models.Org || mongoose.model('Org', OrgSchema);
