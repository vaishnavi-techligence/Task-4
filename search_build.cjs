const fs = require('fs');
const content = fs.readFileSync('dist/assets/index-CyozkmFO.js', 'utf8');

// Find occurrences of gown / isGown / dress / includes in the file
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('isGown') || line.includes('gown') || line.includes('clothing')) {
    // Print a slice of the line around the match
    const pos = line.indexOf('isGown');
    if (pos !== -1) {
      console.log(`Line ${idx + 1} match 'isGown': ... ${line.substring(Math.max(0, pos - 100), Math.min(line.length, pos + 300))} ...`);
    }
    const pos2 = line.indexOf('isClothing');
    if (pos2 !== -1) {
      console.log(`Line ${idx + 1} match 'isClothing': ... ${line.substring(Math.max(0, pos2 - 100), Math.min(line.length, pos2 + 300))} ...`);
    }
  }
});
