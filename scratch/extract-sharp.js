const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const baseDir = path.join('c:/Users/Kenyd/Documents/Nuvio/test-nuvio', 'dist/GIF');
const firstFrameDir = path.join(baseDir, 'firstframe');
const lastFrameDir = path.join(baseDir, 'lastframe');

async function extractFrames(dir, isLast) {
    if (!fs.existsSync(dir)) return;
    
    // We will save directly to the folder, replacing the old outputs if any
    const files = fs.readdirSync(dir).filter(f => {
        const ext = f.toLowerCase();
        // Ignore the outputs we already generated, focus on the originals
        // We know originals are bb.gif, pixar.webp, marvel.gif, dw.webp.
        // Wait, pixar.webp and dw.webp have the same extension as the output.
        // To be safe, we will output as `[basename]_output.webp` then rename them,
        // or just rely on sharp.
        return ext.endsWith('.gif') || (ext.endsWith('.webp') && f !== 'bb.webp' && f !== 'marvel.webp');
    });
    
    for (const file of files) {
        const oldPath = path.join(dir, file);
        if (fs.statSync(oldPath).isDirectory()) continue;
        
        // Skip files inside 'extracted' folder, in fact we process files in dir
        if (file.includes('_extracted')) continue;

        const baseName = path.parse(file).name;
        // Temporary path to avoid reading and writing to the exact same webp file simultaneously
        const tempPath = path.join(dir, `${baseName}_temp.webp`);
        const finalPath = path.join(dir, `${baseName}.webp`);
        
        try {
            console.log(`Processing ${file} in ${isLast ? 'lastframe' : 'firstframe'}...`);
            
            const metadata = await sharp(oldPath).metadata();
            const pages = metadata.pages || 1;
            
            const targetPage = isLast ? (pages - 1) : 0;
            
            await sharp(oldPath, { page: targetPage })
                .webp({ lossless: true })
                .toFile(tempPath);
                
            console.log(`-> Saved frame ${targetPage + 1}/${pages} to ${finalPath}`);
            
            // Rename temp to final (this might overwrite the original if it was .webp)
            fs.renameSync(tempPath, finalPath);
            
            // If the original was a .gif, we can keep it or leave it. The user said "j'ai fait un dossier... il faut les extraire".
        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
        }
    }
}

async function run() {
    await extractFrames(firstFrameDir, false);
    await extractFrames(lastFrameDir, true);
    console.log('Extraction complete via sharp!');
}

run();
