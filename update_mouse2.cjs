const fs = require('fs');
const file = 'src/components/MouseSimulator.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace newlines between onComplete and /> for SuccessOverlay
content = content.replace(/onComplete=\{onComplete\}\s*\/>/g, 'onComplete={onComplete} onRetry={onRetry} />');

fs.writeFileSync(file, content);
console.log('Update finished.');
