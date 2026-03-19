const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('<db_password>')) {
  console.error('Error: Please provide a valid MONGODB_URI with the actual password in .env.local');
  process.exit(1);
}

// Minimal models for migration
const RegistrationSchema = new mongoose.Schema({
  id: String, name: String, email: String, phone: String, type: String,
  status: String, ticketType: String, date: String, timestamp: Number
});
const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

const VendorSchema = new mongoose.Schema({
  id: String, companyName: String, name: String, email: String, phone: String,
  gstNumber: String, category: String, stallSize: String, status: String,
  date: String, timestamp: Number
});
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);

const EventSchema = new mongoose.Schema({
  id: String, name: String, venue: String, city: String, startDate: String, endDate: String, timestamp: Number
});
const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

const AdminSchema = new mongoose.Schema({
  adminId: String, adminPassword: String
});
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

const OrgSchema = new mongoose.Schema({
  companyName: String, visionStatement: String, coreTeam: Object, additionalMembers: Array
});
const Org = mongoose.models.Org || mongoose.model('Org', OrgSchema);

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const dataDir = path.join(__dirname, '../data');

    // Migrate Registrations
    const regPath = path.join(dataDir, 'registrations.json');
    if (fs.existsSync(regPath)) {
      const regs = JSON.parse(fs.readFileSync(regPath, 'utf8'));
      console.log(`Migrating ${regs.length} registrations...`);
      for (const reg of regs) {
        await Registration.findOneAndUpdate({ id: reg.id }, reg, { upsert: true });
      }
    }

    // Migrate Vendors
    const vendorPath = path.join(dataDir, 'vendors.json');
    if (fs.existsSync(vendorPath)) {
      const vendors = JSON.parse(fs.readFileSync(vendorPath, 'utf8'));
      console.log(`Migrating ${vendors.length} vendors...`);
      for (const v of vendors) {
        await Vendor.findOneAndUpdate({ id: v.id }, v, { upsert: true });
      }
    }

    // Migrate Events
    const eventPath = path.join(dataDir, 'event.json');
    if (fs.existsSync(eventPath)) {
      const eventsData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
      const events = Array.isArray(eventsData) ? eventsData : [eventsData];
      console.log(`Migrating ${events.length} events...`);
      for (const e of events) {
        await Event.findOneAndUpdate({ id: e.id || "1" }, e, { upsert: true });
      }
    }

    // Migrate Admin
    const adminPath = path.join(dataDir, 'admin.json');
    if (fs.existsSync(adminPath)) {
      const admin = JSON.parse(fs.readFileSync(adminPath, 'utf8'));
      console.log('Migrating admin credentials...');
      await Admin.findOneAndUpdate({}, admin, { upsert: true });
    }

    // Migrate Org
    const orgPath = path.join(dataDir, 'org.json');
    if (fs.existsSync(orgPath)) {
      const org = JSON.parse(fs.readFileSync(orgPath, 'utf8'));
      console.log('Migrating organization data...');
      await Org.findOneAndUpdate({}, org, { upsert: true });
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
