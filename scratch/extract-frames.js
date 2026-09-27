const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffmpegPath = require('c:/Users/Kenyd/Documents/Nuvio/test-nuvio/node_modules/ffmpeg-static/index.js');
const baseDir = path.join('c:/Users/Kenyd/Documents/Nuvio/test-nuvio', 'dist/GIF');

const firstFrameDir = path.join(baseDir, 'firstframe');
const lastFrameDir = path.join(baseDir, 'lastframe');

function extractFrames(dir, isLast) {
    if (!fs.existsSync(dir)) return;
    
    const extractedDir = path.join(dir, 'extracted');
    if (!fs.existsSync(extractedDir)) fs.mkdirSync(extractedDir);
    
    const files = fs.readdirSync(dir).filter(f => {
        const ext = f.toLowerCase();
        return ext.endsWith('.gif') || ext.endsWith('.webp');
    });
    
    files.forEach(file => {
        const oldPath = path.join(dir, file);
        if (fs.statSync(oldPath).isDirectory()) return; // skip extracted dir itself
        
        const baseName = path.parse(file).name;
        const newPath = path.join(extractedDir, `${baseName}.webp`);
        
        console.log(`Processing ${file} in ${isLast ? 'lastframe' : 'firstframe'}...`);
        
        try {
            if (isLast) {
                // -vf reverse -vframes 1 safely gets the last frame of any video/gif
                execSync(`"${ffmpegPath}" -i "${oldPath}" -vf "reverse" -vframes 1 -y "${newPath}"`, { stdio: 'ignore' });
            } else {
                // -vframes 1 safely gets the first frame
                execSync(`"${ffmpegPath}" -i "${oldPath}" -vframes 1 -y "${newPath}"`, { stdio: 'ignore' });
            }
            console.log(`-> Saved as ${newPath}`);
        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
        }
    });
}

extractFrames(firstFrameDir, false);
extractFrames(lastFrameDir, true);
console.log('Extraction complete!');
