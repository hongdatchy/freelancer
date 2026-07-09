const fs = require('fs');
const file = 'D:/freelancer/vietsure_english/jitsi-demo/lib-jitsi-meet.min.js';
let data = fs.readFileSync(file, 'utf8');

const target = 'jt.ENDPOINT_MESSAGE_RECEIVED,(e,t)=>{"stats"===t.type&&this._updateRemoteStats(e.getId(),t.values)})';
const replacement = 'jt.ENDPOINT_MESSAGE_RECEIVED,(e,t)=>{t&&"stats"===t.type&&this._updateRemoteStats(e.getId(),t.values)})';

if (data.includes(target)) {
    data = data.replace(target, replacement);
    fs.writeFileSync(file, data);
    console.log('Patched successfully');
} else {
    console.log('Target string not found');
}
