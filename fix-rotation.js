/**
 * 修正旋轉問題的圖片
 * 從 images-backup 讀取原始檔，重新壓縮到 images/
 */
const sharp = require('sharp');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, 'static', 'images-backup');
const OUTPUT_DIR = path.join(__dirname, 'static', 'images');

// 需要修正的圖片清單
const FIX_FILES = [
    'scene4.jpg',
    '西門紅樓-2.jpg',
];

async function fix(filename) {
    const input = path.join(BACKUP_DIR, filename);
    const output = path.join(OUTPUT_DIR, filename.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

    try {
        await sharp(input)
            .rotate()  // 根據 EXIF 自動旋轉
            .resize(1920, null, { withoutEnlargement: true, fit: 'inside' })
            .webp({ quality: 78 })
            .toFile(output);
        console.log(`✅ 修正完成: ${filename} → ${path.basename(output)}`);
    } catch (err) {
        console.log(`❌ 失敗: ${filename} - ${err.message}`);
    }
}

async function main() {
    for (const f of FIX_FILES) {
        await fix(f);
    }
    console.log('\n🎉 修正完成！重新整理瀏覽器即可看到效果。');
}

main();
