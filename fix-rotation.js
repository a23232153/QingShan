/**
 * 檢查缺失的 WebP 檔案，並從 images-backup 補轉
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, 'static', 'images-backup');
const OUTPUT_DIR = path.join(__dirname, 'static', 'images');

// 不轉的檔案
const SKIP = ['favicon.png'];

async function main() {
    const pngFiles = fs.readdirSync(BACKUP_DIR).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ext === '.png' && !SKIP.includes(f);
    });

    console.log(`\n🔍 images-backup 中有 ${pngFiles.length} 個 PNG 檔（不含 favicon）\n`);

    let missing = 0;
    let converted = 0;

    for (const f of pngFiles) {
        const webpName = f.replace(/\.png$/i, '.webp');
        const webpPath = path.join(OUTPUT_DIR, webpName);

        if (fs.existsSync(webpPath)) {
            // 已存在，跳過
            continue;
        }

        missing++;
        console.log(`❌ 缺失: ${webpName}`);

        // 補轉
        const inputPath = path.join(BACKUP_DIR, f);
        try {
            await sharp(inputPath)
                .rotate()
                .resize(1920, null, { withoutEnlargement: true, fit: 'inside' })
                .webp({ quality: 78 })
                .toFile(webpPath);
            converted++;
            const inSize = fs.statSync(inputPath).size;
            const outSize = fs.statSync(webpPath).size;
            console.log(`   ✅ 已轉換: ${f} (${(inSize / 1024).toFixed(0)}KB → ${(outSize / 1024).toFixed(0)}KB)`);
        } catch (err) {
            console.log(`   ❌ 轉換失敗: ${err.message}`);
        }
    }

    // 複製 favicon.png（保留原格式）
    const faviconSrc = path.join(BACKUP_DIR, 'favicon.png');
    const faviconDst = path.join(OUTPUT_DIR, 'favicon.png');
    if (fs.existsSync(faviconSrc) && !fs.existsSync(faviconDst)) {
        fs.copyFileSync(faviconSrc, faviconDst);
        console.log(`\n📋 已複製 favicon.png（保留 PNG 格式）`);
    }

    if (missing === 0) {
        console.log('✅ 所有 PNG 都已有對應的 WebP，沒有缺失！');
    } else {
        console.log(`\n🎉 補轉完成！共補上 ${converted} 張`);
    }
}

main().catch(console.error);
