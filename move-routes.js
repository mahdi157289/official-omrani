const fs = require('fs');
const path = require('path');

const basePath = path.join(process.cwd(), 'app', '[locale]');
const destPath = path.join(basePath, '(shop)');

if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath);
}

const itemsToMove = ['about', 'cart', 'checkout', 'contact', 'faq', 'login', 'orders', 'packages', 'profile', 'register', 'shop', 'page.tsx'];

for (const item of itemsToMove) {
    const src = path.join(basePath, item);
    const dest = path.join(destPath, item);

    if (fs.existsSync(src)) {
        try {
            if (fs.statSync(src).isDirectory()) {
                fs.cpSync(src, dest, { recursive: true });
                fs.rmSync(src, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
            } else {
                fs.copyFileSync(src, dest);
                fs.unlinkSync(src);
            }
            console.log(`Successfully moved ${item}`);
        } catch (e) {
            console.error(`Error copying/removing ${item}:`, e);
        }
    } else {
        console.log(`Not found (already moved?): ${item}`);
    }
}
