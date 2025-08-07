#!/usr/bin/env node

/**
 * Create app icon using existing Active Club logo
 */

const fs = require('fs');
const path = require('path');

// Read the existing logo
const logoPath = path.join(__dirname, '..', 'assets', 'active_club_logo.svg');
const logoSVG = fs.readFileSync(logoPath, 'utf8');

// Extract viewBox or default dimensions
const viewBoxMatch = logoSVG.match(/viewBox="([^"]+)"/);
const widthMatch = logoSVG.match(/width="([^"]+)"/);
const heightMatch = logoSVG.match(/height="([^"]+)"/);

console.log('📖 Reading existing Active Club logo...');

// Create icon with logo on colored background
const createLogoIcon = () => {
  // Remove the outer svg tag from logo
  const logoContent = logoSVG
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    // Ensure logo is white for dark background
    .replace(/fill="#[^"]+"/g, 'fill="#FFFFFF"')
    .replace(/fill:\s*#[^;]+/g, 'fill: #FFFFFF');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background with gradient -->
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F1C229"/>
      <stop offset="100%" style="stop-color:#E5B420"/>
    </linearGradient>
  </defs>
  
  <rect width="1024" height="1024" fill="url(#bgGrad)"/>
  
  <!-- Dark circle background for logo -->
  <circle cx="512" cy="512" r="380" fill="#1A1A1A"/>
  
  <!-- Active Club Logo centered and scaled -->
  <g transform="translate(512, 512) scale(6, 6) translate(-72, -28)">
    ${logoContent}
  </g>
</svg>`;
};

// Alternative clean design
const createCleanIcon = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Clean yellow background -->
  <rect width="1024" height="1024" fill="#F1C229"/>
  
  <!-- White circle -->
  <circle cx="512" cy="512" r="400" fill="#FFFFFF"/>
  
  <!-- AC letters in bold -->
  <text x="512" y="600" 
        font-family="Arial, sans-serif" 
        font-size="420" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="#1A1A1A">AC</text>
</svg>`;
};

// Save the icons
const outputPath1 = path.join(__dirname, '..', 'assets', 'images', 'icon-logo-based.svg');
const outputPath2 = path.join(__dirname, '..', 'assets', 'images', 'icon-clean-ac.svg');

fs.writeFileSync(outputPath1, createLogoIcon());
fs.writeFileSync(outputPath2, createCleanIcon());

console.log('✅ Created icon-logo-based.svg');
console.log('✅ Created icon-clean-ac.svg');
console.log('\n🎯 Quick conversion options:');
console.log('1. Visit https://cloudconvert.com/svg-to-png');
console.log('2. Upload the SVG file');
console.log('3. Set size to 1024x1024');
console.log('4. Download as PNG');
console.log('\n📱 Then replace: assets/images/icon.png');