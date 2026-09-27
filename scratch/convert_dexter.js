const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../dist/univers/dexter');
const files = fs.readdirSync(dir);

async function processFiles() {
  for (const file of files) {
    if (file.endsWith('.gif') || file.endsWith('.webp')) continue;
    
    const ext = path.extname(file);
    if (!['.jpg', '.jpeg', '.png'].includes(ext.toLowerCase())) continue;

    const fullPath = path.join(dir, file);
    const newPath = path.join(dir, path.basename(file, ext) + '.webp');
    
    await sharp(fullPath).webp().toFile(newPath);
    fs.unlinkSync(fullPath);
    console.log(`Converted ${file} to .webp and deleted original.`);
  }
}

processFiles().catch(console.error);
