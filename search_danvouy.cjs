const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      searchDir(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes('danvouy')) {
          console.log(`${filePath}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  });
}

searchDir('src');
