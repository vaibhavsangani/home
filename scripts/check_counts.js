const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const collections = ['admins', 'events', 'orgs', 'registrations', 'vendors'];
    const results = {};
    for (const col of collections) {
      try {
        const count = await mongoose.connection.db.collection(col).countDocuments();
        results[col] = count;
      } catch (e) {
        results[col] = 'Error: ' + e.message;
      }
    }
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

check();
