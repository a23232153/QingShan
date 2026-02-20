/**
 * 圖片批次壓縮腳本
 * 將 static/images 下的 JPG/PNG 壓縮為 WebP
 * 
 * 用法：
 *   1. npm install sharp  (先安裝 sharp)
 *   2. node compress-images.js  (執行壓縮)
 *   3. 壓完後原始檔案會留著，壓縮後的放在 static/images-optimized/
 *   4. 確認沒問題後，把 images-optimized 改名成 images 即可
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, 'static', 'images-backup');
const OUTPUT_DIR = path.join(__dirname, 'static', 'images');

// 品質設定
const WEBP_QUALITY = 78;

// 大圖最大寬度 (scene, grid, cover, 正殿 等背景大圖)
const MAX_WIDTH_LARGE = 1920;
// 小圖最大寬度 (fortune_poem, logo, icon 等)
const MAX_WIDTH_SMALL = 800;

// 不需要壓縮的檔案 (favicon 等)
const SKIP_FILES = ['favicon.png'];

// 判斷是否為「小圖」類別
function isSmallImage(filename) {
    const lower = filename.toLowerCase();
    return (
        lower.startsWith('fortune_poem') ||
        lower.startsWith('logo') ||
        lower.startsWith('icon') ||
        lower.startsWith('team') ||
        lower.startsWith('slip') ||
        lower.startsWith('st') ||
        lower.startsWith('t2') ||
        lower.startsWith('t3') ||
        lower.startsWith('lantern') ||
        lower.startsWith('hero-bg') ||
        lower.startsWith('google-map') ||
        lower.startsWith('news') ||
        lower.startsWith('黑白')
    );
}

async function compressImage(inputPath, outputPath, filename) {
    const ext = path.extname(filename).toLowerCase();
    const maxWidth = isSmallImage(filename) ? MAX_WIDTH_SMALL : MAX_WIDTH_LARGE;

    try {
        const metadata = await sharp(inputPath).metadata();
        let pipeline = sharp(inputPath).rotate(); // 自動根據 EXIF 旋轉

        // 只在圖片寬度超過限制時才縮放
        if (metadata.width && metadata.width > maxWidth) {
            pipeline = pipeline.resize(maxWidth, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }

        // PNG 有透明度的保留為 WebP (支援透明)，JPG 也轉 WebP
        const webpPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

        await pipeline
            .webp({ quality: WEBP_QUALITY })
            .toFile(webpPath);

        const inputSize = fs.statSync(inputPath).size;
        const outputSize = fs.statSync(webpPath).size;
        const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);

        return { filename, inputSize, outputSize, savings, success: true };
    } catch (err) {
        return { filename, error: err.message, success: false };
    }
}

async function main() {
    // 建立輸出目錄
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const files = fs.readdirSync(INPUT_DIR).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ['.jpg', '.jpeg', '.png'].includes(ext) && !SKIP_FILES.includes(f);
    });

    console.log(`\n🖼️  找到 ${files.length} 張圖片，開始壓縮...\n`);

    let totalInputSize = 0;
    let totalOutputSize = 0;
    let successCount = 0;
    let failCount = 0;

    // 分批處理，每次 10 張避免記憶體爆掉
    const BATCH_SIZE = 10;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(
            batch.map(f => compressImage(
                path.join(INPUT_DIR, f),
                path.join(OUTPUT_DIR, f),
                f
            ))
        );

        for (const r of results) {
            if (r.success) {
                totalInputSize += r.inputSize;
                totalOutputSize += r.outputSize;
                successCount++;
                console.log(`✅ ${r.filename}: ${(r.inputSize / 1024 / 1024).toFixed(1)}MB → ${(r.outputSize / 1024 / 1024).toFixed(1)}MB (${r.savings}% 節省)`);
            } else {
                failCount++;
                console.log(`❌ ${r.filename}: ${r.error}`);
            }
        }

        // 進度
        const progress = Math.min(i + BATCH_SIZE, files.length);
        console.log(`\n📊 進度: ${progress}/${files.length}\n`);
    }

    console.log('\n' + '='.repeat(60));
    console.log(`🎉 壓縮完成！`);
    console.log(`   成功: ${successCount} 張`);
    console.log(`   失敗: ${failCount} 張`);
    console.log(`   原始總大小: ${(totalInputSize / 1024 / 1024).toFixed(1)} MB`);
    console.log(`   壓縮後大小: ${(totalOutputSize / 1024 / 1024).toFixed(1)} MB`);
    console.log(`   節省空間:   ${((1 - totalOutputSize / totalInputSize) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));
    console.log(`\n📁 壓縮後的圖片在: ${OUTPUT_DIR}`);
    console.log(`\n⚠️  下一步：`);
    console.log(`   1. 確認 images-optimized 的圖片品質OK`);
    console.log(`   2. 把原始 images 資料夾重命名為 images-backup`);
    console.log(`   3. 把 images-optimized 重命名為 images`);
    console.log(`   4. 更新程式碼中的副檔名 .jpg/.png → .webp`);
}

main().catch(console.error);
