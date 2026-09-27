const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testTrim() {
  const file = path.join(__dirname, '../dist/univers/dreamworks/title.webp');
  const buffer = fs.readFileSync(file);
  
  const trimmedBuffer = await sharp(buffer).trim().toBuffer();
  
  const resized = await sharp({
    create: { width: 2400, height: 842, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
  .composite([{
    input: await sharp(trimmedBuffer).resize({ width: 2400, height: 842, fit: 'inside' }).toBuffer(),
    gravity: 'center'
  }])
  .webp({ quality: 92 })
  .toBuffer();

  fs.writeFileSync(path.join(__dirname, 'dreamworks_test.webp'), resized);
  console.log('Test completed.');
}
testTrim().catch(console.error);
