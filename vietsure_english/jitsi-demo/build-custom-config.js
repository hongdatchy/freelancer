const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'custom-modules');
const outputFile = path.join(__dirname, 'custom-config.js');

console.log('🔄 Building custom-config.js from modules...');

const files = fs.readdirSync(modulesDir)
    .filter(f => f.endsWith('.js'))
    .sort();

let combinedContent = `// ==========================================
// VIETSURE ENGLISH - JITSI CUSTOM CONFIG
// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// EDIT FILES IN ./custom-modules/ AND RUN node build-custom-config.js
// ==========================================\n\n`;

files.forEach(file => {
    const filePath = path.join(modulesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    combinedContent += `\n/* --- MODULE: ${file} --- */\n` + content + '\n';
    console.log(`  + Bundled: ${file}`);
});

fs.writeFileSync(outputFile, combinedContent, 'utf8');
console.log(`✅ Successfully generated ${outputFile} (${fs.statSync(outputFile).size} bytes)`);
