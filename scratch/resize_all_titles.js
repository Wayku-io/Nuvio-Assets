const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');

function getTitleFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getTitleFiles(fullPath, fileList);
    } else if (file.startsWith('title.') && (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.webp') || file.endsWith('.jpeg')) && !file.includes('_temp')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function processTitles() {
  const titles = getTitleFiles(distDir);
  console.log(`Found ${titles.length} title files.`);

  for (const file of titles) {
    try {
      const parsed = path.parse(file);
      const outputName = path.join(parsed.dir, 'title.webp');
      
      const inputBuffer = fs.readFileSync(file);
      
      const buffer = await sharp(inputBuffer).resize({ width: 2400, height: 842, fit: 'inside' }).toBuffer();
      
      const resized = await sharp({
        create: { width: 2400, height: 842, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
      })
      .composite([{ input: buffer, gravity: 'center' }])
      .webp({ quality: 92 })
      .toBuffer();

      if (file !== outputName) {
        fs.unlinkSync(file);
      }
      fs.writeFileSync(outputName, resized);
      
      console.log(`Processed: ${file}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

processTitles().catch(console.error);
