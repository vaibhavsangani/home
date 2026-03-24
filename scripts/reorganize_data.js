const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

// Schemas
const RegistrationSchema = new mongoose.Schema({
  id: String, role: String, type: String, name: String, companyName: String, 
  email: String, phone: String, category: String, stallSize: String, 
  status: String, date: String, timestamp: Number
});
const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

const VendorSchema = new mongoose.Schema({
  id: String, companyName: String, name: String, email: String, phone: String,
  status: String, date: String, businessCategory: String, stallSize: String, 
  timestamp: Number
});
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);

async function reorganize() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Find all registrations that are actually vendors
    const stuckVendors = await Registration.find({ 
      $or: [
        { role: 'vendor' },
        { type: 'stall' }
      ]
    });

    console.log(`Found ${stuckVendors.length} vendors in registrations collection.`);

    for (const v of stuckVendors) {
      console.log(`Moving vendor: ${v.companyName || v.name}`);
      
      const vendorData = {
        id: v.id,
        companyName: v.companyName || 'Unknown',
        name: v.name,
        email: v.email,
        phone: v.phone,
        status: v.status || 'confirmed',
        date: v.date,
        businessCategory: v.category,
        stallSize: v.stallSize,
        timestamp: v.timestamp || Date.now()
      };

      // Upsert into Vendor collection
      await Vendor.findOneAndUpdate({ id: v.id }, vendorData, { upsert: true });
      
      // Remove from Registration collection
      await Registration.deleteOne({ _id: v._id });
      console.log(`  Moved ${v.id} successfully.`);
    }

    console.log('Reorganization complete!');
    process.exit(0);
  } catch (err) {
    console.error('Reorganization failed:', err);
    process.exit(1);
  }
}

reorganize();
