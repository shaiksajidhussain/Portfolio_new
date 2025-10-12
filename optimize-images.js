#!/usr/bin/env node

/**
 * Image Optimization Script for Frame Animation
 * This script helps optimize the 600 JPG frames for better performance
 */

const fs = require('fs');
const path = require('path');

const NEO_DIR = './public/neo';
const OPTIMIZED_DIR = './public/neo-optimized';

// Check if sharp is available (optional optimization)
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ Sharp found - will use advanced optimization');
} catch (e) {
  console.log('⚠️  Sharp not found - using basic optimization only');
  console.log('   Install with: npm install sharp');
}

async function optimizeImages() {
  if (!fs.existsSync(NEO_DIR)) {
    console.error('❌ Neo directory not found:', NEO_DIR);
    return;
  }

  // Create optimized directory
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
  }

  const files = fs.readdirSync(NEO_DIR).filter(file => file.endsWith('.jpg'));
  console.log(`📁 Found ${files.length} JPG files to optimize`);

  if (sharp) {
    await optimizeWithSharp(files);
  } else {
    console.log('📋 Basic optimization suggestions:');
    console.log('   1. Use WebP format instead of JPG (50-80% smaller)');
    console.log('   2. Reduce image quality to 70-80%');
    console.log('   3. Resize images to match your canvas size');
    console.log('   4. Use progressive JPG encoding');
    console.log('');
    console.log('🛠️  Tools you can use:');
    console.log('   - ImageMagick: convert input.jpg -quality 75 -resize 1920x1080 output.jpg');
    console.log('   - Online tools: TinyPNG, Squoosh.app');
    console.log('   - Install sharp and run this script again');
  }
}

async function optimizeWithSharp(files) {
  console.log('🚀 Starting optimization with Sharp...');
  
  let processed = 0;
  const total = files.length;
  
  for (const file of files) {
    try {
      const inputPath = path.join(NEO_DIR, file);
      const outputPath = path.join(OPTIMIZED_DIR, file);
      
      // Get file info
      const stats = fs.statSync(inputPath);
      const originalSize = stats.size;
      
      await sharp(inputPath)
        .jpeg({ 
          quality: 75,  // Reduce quality for smaller size
          progressive: true,  // Progressive loading
          mozjpeg: true  // Better compression
        })
        .resize(1920, 1080, {  // Resize to common screen resolution
          fit: 'cover',
          position: 'center'
        })
        .toFile(outputPath);
      
      const newStats = fs.statSync(outputPath);
      const newSize = newStats.size;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      
      processed++;
      if (processed % 50 === 0) {
        console.log(`📊 Processed ${processed}/${total} images...`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`✅ Optimization complete! ${processed}/${total} images processed`);
  console.log(`📁 Optimized images saved to: ${OPTIMIZED_DIR}`);
  
  // Calculate total savings
  const originalSize = getTotalSize(NEO_DIR);
  const optimizedSize = getTotalSize(OPTIMIZED_DIR);
  const totalSavings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
  
  console.log(`💾 Total size reduction: ${totalSavings}%`);
  console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`   Optimized: ${(optimizedSize / 1024 / 1024).toFixed(1)} MB`);
}

function getTotalSize(dir) {
  const files = fs.readdirSync(dir);
  return files.reduce((total, file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    return total + stats.size;
  }, 0);
}

// Alternative: WebP conversion
async function convertToWebP() {
  if (!sharp) {
    console.log('❌ Sharp required for WebP conversion');
    return;
  }
  
  const WEBP_DIR = './public/neo-webp';
  if (!fs.existsSync(WEBP_DIR)) {
    fs.mkdirSync(WEBP_DIR, { recursive: true });
  }
  
  const files = fs.readdirSync(NEO_DIR).filter(file => file.endsWith('.jpg'));
  console.log(`🔄 Converting ${files.length} images to WebP...`);
  
  for (const file of files) {
    try {
      const inputPath = path.join(NEO_DIR, file);
      const outputPath = path.join(WEBP_DIR, file.replace('.jpg', '.webp'));
      
      await sharp(inputPath)
        .webp({ quality: 80 })
        .resize(1920, 1080, { fit: 'cover', position: 'center' })
        .toFile(outputPath);
        
    } catch (error) {
      console.error(`❌ Error converting ${file}:`, error.message);
    }
  }
  
  console.log(`✅ WebP conversion complete!`);
  console.log(`📁 WebP images saved to: ${WEBP_DIR}`);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--webp')) {
    convertToWebP();
  } else {
    optimizeImages();
  }
}

module.exports = { optimizeImages, convertToWebP };
