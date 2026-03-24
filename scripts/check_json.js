const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const files = ['admin.json', 'event.json', 'org.json', 'registrations.json'];
const results = {};

for (const file of files) {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      results[file] = Array.isArray(content) ? content.length : 1;
    } catch (e) {
      results[file] = 'Error: ' + e.message;
    }
  } else {
    results[file] = 'Not found';
  }
}

console.log(JSON.stringify(results, null, 2));
