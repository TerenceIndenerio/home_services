const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && file !== 'node_modules' && file !== '.expo' && file !== 'android' && file !== 'ios') {
            processDirectory(filePath);
        } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(file)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const stripped = strip(content);
            fs.writeFileSync(filePath, stripped, 'utf8');
            console.log(`Processed: ${filePath}`);
        }
    }
}

processDirectory('.');