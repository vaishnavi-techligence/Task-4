const fs = require('fs');
const content = fs.readFileSync('src/index.css', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('product-3d') || line.includes('3d') || line.includes('caption')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
