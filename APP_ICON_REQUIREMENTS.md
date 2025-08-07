# App Icon Requirements for Active Club

## iOS App Icon Requirements

For iOS/TestFlight, you need a **1024x1024px** icon that will be automatically resized by the build process.

### Icon Specifications:
- **Size**: 1024x1024 pixels
- **Format**: PNG (no transparency)
- **Color Space**: sRGB or P3
- **No rounded corners** (iOS adds them automatically)
- **No transparency** (must have solid background)

### Design Guidelines:
1. **Simple and recognizable** at small sizes
2. **Avoid text** (except single letters/numbers)
3. **Use bold shapes** that scale well
4. **Consider the Active Club brand**:
   - Yellow primary color (#F1C229)
   - Fitness/rewards theme
   - Could incorporate the star or "AC" letters

### Quick Icon Ideas for Active Club:
1. **Star Badge** - Yellow star on dark background (matches tier icons)
2. **AC Monogram** - Stylized "AC" letters
3. **Trophy/Medal** - Representing rewards/achievements
4. **Abstract Fitness Symbol** - Geometric shapes suggesting movement

## Android Adaptive Icon Requirements

Android needs two layers:
- **Foreground**: 108x108dp with safe zone of 66x66dp
- **Background**: Can be solid color or image

## Where to Create Icons:

### Free Tools:
1. **Figma** (Free with account)
   - Template: https://www.figma.com/community/file/893681757847439257
2. **Canva** (Free tier available)
3. **GIMP** (Open source)

### AI Tools:
1. **DALL-E 3** - "Create an app icon for Active Club fitness rewards app, minimalist design, yellow accent color"
2. **Midjourney** - "/imagine app icon design, fitness rewards, yellow and dark theme, minimal, flat design"

### Icon Generators:
1. **IconKitchen** (https://icon.kitchen) - Quick app icon generator
2. **Makeappicon** (https://makeappicon.com) - Generates all sizes
3. **App Icon Generator** (https://www.appicon.co)

## Quick Solution Using Existing Assets:

Based on your app's design, here's a quick approach:

```bash
# If you have ImageMagick installed:
# Create a simple icon from existing assets
convert -size 1024x1024 xc:'#F1C229' \
  -draw "image over 256,256 512,512 'assets/notifications/star_first.png'" \
  assets/images/icon-new.png
```

## Implementation Steps:

1. **Create your 1024x1024px icon**
2. **Replace the default icon**:
   ```bash
   # Backup existing
   mv assets/images/icon.png assets/images/icon-default.png
   
   # Add your new icon
   cp your-new-icon.png assets/images/icon.png
   ```

3. **Update adaptive icon for Android** (optional):
   - Edit `assets/images/adaptive-icon.png`
   - Or create separate foreground/background

4. **Test icon appearance**:
   ```bash
   # Preview on iOS simulator
   npx expo run:ios
   ```

## Temporary Solution:

For immediate TestFlight submission, you could:
1. Use the Active Club logo on a solid background
2. Create a simple "AC" monogram
3. Use a yellow star (matching your tier system)

## Professional Solution:

Consider hiring a designer on:
- Fiverr ($5-50)
- 99designs ($299+)
- Dribbble (varies)

## Validation:

Before submitting, ensure:
- [ ] Icon is exactly 1024x1024px
- [ ] No transparency (solid background)
- [ ] Looks good at small sizes (try 60x60px)
- [ ] Matches your brand colors
- [ ] No copyright/trademark issues