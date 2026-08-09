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

// Sync directly to Docker web container volume config.js
try {
    const dockerCfgDir = path.join(process.env.USERPROFILE || 'C:/Users/Admin', '.jitsi-meet-cfg/web');
    const dockerCustomCfg = path.join(dockerCfgDir, 'custom-config.js');
    const dockerConfigJs = path.join(dockerCfgDir, 'config.js');

    if (fs.existsSync(dockerCfgDir)) {
        fs.writeFileSync(dockerCustomCfg, combinedContent, 'utf8');
        console.log(`✅ Synced to Docker volume: ${dockerCustomCfg}`);

        if (fs.existsSync(dockerConfigJs)) {
            let baseConfig = fs.readFileSync(dockerConfigJs, 'utf8');
            const marker = '// ==========================================\n// VIETSURE ENGLISH - JITSI CUSTOM CONFIG';
            const markerIdx = baseConfig.indexOf('// ==========================================\n// VIETSURE ENGLISH');
            if (markerIdx !== -1) {
                baseConfig = baseConfig.substring(0, markerIdx).trimEnd();
            }
            const updatedConfig = baseConfig + '\n\n' + combinedContent;
            fs.writeFileSync(dockerConfigJs, updatedConfig, 'utf8');
            console.log(`🚀 Successfully updated Docker active config: ${dockerConfigJs}`);
        }
    }

    try {
        const { execSync } = require('child_process');
        execSync('docker exec jitsi-demo-web-1 mkdir -p /usr/share/jitsi-meet/images', { stdio: 'ignore' });
        execSync(`docker cp "${path.join(modulesDir, 'teacher-background.jpg')}" jitsi-demo-web-1:/usr/share/jitsi-meet/images/teacher-background.jpg`, { stdio: 'ignore' });
        execSync(`docker cp "${path.join(modulesDir, 'branding.json')}" jitsi-demo-web-1:/usr/share/jitsi-meet/images/branding.json`, { stdio: 'ignore' });
        console.log('✅ Synced branding.json & teacher-background.jpg into Docker container images directory');
    } catch (e) {
        console.log('✅ branding.json & teacher-background.jpg are permanently mounted via docker-compose volumes');
    }
} catch (err) {
    console.warn('⚠️ Could not auto-sync to Docker volume:', err.message);
}
