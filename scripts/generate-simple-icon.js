#!/usr/bin/env node

/**
 * Generate a simple app icon for Active Club
 * Creates a 1024x1024 icon with AC monogram
 */

const fs = require('fs');
const path = require('path');

// SVG template for the app icon
const createIconSVG = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1024" height="1024" fill="#1A1A1A"/>
  
  <!-- Yellow accent circle -->
  <circle cx="512" cy="512" r="420" fill="#F1C229" opacity="0.1"/>
  
  <!-- AC Monogram -->
  <g transform="translate(512, 512)">
    <!-- Letter A -->
    <path d="M -180 100 L -100 -140 L -20 100 M -160 20 L -40 20" 
          fill="none" 
          stroke="#F1C229" 
          stroke-width="40" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
    
    <!-- Letter C -->
    <path d="M 180 -100 A 120 120 0 1 1 180 100" 
          fill="none" 
          stroke="#F1C229" 
          stroke-width="40" 
          stroke-linecap="round"/>
  </g>
  
  <!-- Subtle star accents -->
  <g opacity="0.3">
    <circle cx="200" cy="200" r="8" fill="#F1C229"/>
    <circle cx="824" cy="200" r="8" fill="#F1C229"/>
    <circle cx="200" cy="824" r="8" fill="#F1C229"/>
    <circle cx="824" cy="824" r="8" fill="#F1C229"/>
  </g>
</svg>`;
};

// Alternative design with star
const createStarIconSVG = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#2A2A2A"/>
      <stop offset="100%" style="stop-color:#1A1A1A"/>
    </radialGradient>
  </defs>
  
  <rect width="1024" height="1024" fill="url(#bgGradient)"/>
  
  <!-- Large central star -->
  <path d="M 512 200 L 600 420 L 840 420 L 650 560 L 740 780 L 512 640 L 284 780 L 374 560 L 184 420 L 424 420 Z" 
        fill="#F1C229"/>
  
  <!-- Inner shadow for depth -->
  <path d="M 512 200 L 600 420 L 840 420 L 650 560 L 740 780 L 512 640 L 284 780 L 374 560 L 184 420 L 424 420 Z" 
        fill="#000000" 
        opacity="0.2" 
        transform="translate(10, 10)"/>
</svg>`;
};

// Save SVG to file
const saveIcon = (svgContent, filename) => {
  const outputPath = path.join(__dirname, '..', 'assets', 'images', filename);
  fs.writeFileSync(outputPath, svgContent);
  console.log(`✅ Created ${filename}`);
  console.log(`📍 Location: ${outputPath}`);
  console.log('\n💡 To use this icon:');
  console.log('1. Convert to PNG: Use any online SVG to PNG converter');
  console.log('2. Or install librsvg: brew install librsvg');
  console.log(`3. Then run: rsvg-convert -w 1024 -h 1024 ${filename} -o icon.png`);
};

// Generate both designs
console.log('🎨 Generating Active Club app icons...\n');

saveIcon(createIconSVG(), 'icon-ac-monogram.svg');
saveIcon(createStarIconSVG(), 'icon-star.svg');

console.log('\n✨ Done! Choose the design you prefer and convert to PNG.');
console.log('\n🔗 Online converters:');
console.log('   - https://cloudconvert.com/svg-to-png');
console.log('   - https://svgtopng.com/');
console.log('   - https://convertio.co/svg-png/');