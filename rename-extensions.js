/**
 * 批次替換圖片副檔名腳本
 * 將 .jpg/.png 改為 .webp（排除 favicon 和外部 URL）
 * 
 * 用法：node rename-extensions.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

// 不替換的模式
const SKIP_PATTERNS = [
    'favicon.png',        // favicon 保留 PNG
    'qing-shan.vercel.app', // 外部已部署的 URL 不動
];

// 要處理的檔案類型
const FILE_EXTENSIONS = ['.svelte', '.css', '.ts', '.js', '.html'];

function getAllFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // 跳過 node_modules
            if (entry.name === 'node_modules') continue;
            getAllFiles(fullPath, files);
        } else {
            const ext = path.extname(entry.name).toLowerCase();
            if (FILE_EXTENSIONS.includes(ext)) {
                files.push(fullPath);
            }
        }
    }
    return files;
}

function shouldSkipLine(line) {
    return SKIP_PATTERNS.some(pattern => line.includes(pattern));
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let changes = 0;

    // 逐行處理，跳過要排除的行
    const lines = content.split('\n');
    const newLines = lines.map(line => {
        if (shouldSkipLine(line)) return line;

        let newLine = line;
        // 替換 /images/xxx.jpg -> /images/xxx.webp
        // 替換 /images/xxx.jpeg -> /images/xxx.webp
        // 替換 /images/xxx.png -> /images/xxx.webp
        const regex = /(\/images\/[^'")\s]+)\.(jpg|jpeg|png)/gi;
        newLine = line.replace(regex, (match, name, ext) => {
            // 額外檢查 favicon
            if (match.includes('favicon')) return match;
            changes++;
            return `${name}.webp`;
        });
        return newLine;
    });

    if (changes > 0) {
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
        console.log(`✅ ${path.relative(SRC_DIR, filePath)}: ${changes} 處替換`);
    }
    return changes;
}

function main() {
    const files = getAllFiles(SRC_DIR);
    console.log(`\n🔍 掃描到 ${files.length} 個原始碼檔案\n`);

    let totalChanges = 0;
    for (const file of files) {
        totalChanges += processFile(file);
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`🎉 完成！共替換 ${totalChanges} 處`);
    console.log(`${'='.repeat(50)}`);
    console.log(`\n⚠️  注意：以下項目未被替換（刻意保留）：`);
    console.log(`   - favicon.png（瀏覽器圖示保留 PNG）`);
    console.log(`   - qing-shan.vercel.app 開頭的 OG 圖片 URL`);
}

main();
