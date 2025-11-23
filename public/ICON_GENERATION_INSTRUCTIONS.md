# Generate Icon for TON Connect

## Quick Fix: Convert SVG to PNG

The `icon.svg` file has been created. You need to convert it to `icon-512x512.png`.

### Option 1: Using Online Tool (Fastest)
1. Go to https://svgtopng.com/ or https://cloudconvert.com/svg-to-png
2. Upload `mini-app/public/icon.svg`
3. Set dimensions to **512x512**
4. Download the PNG
5. Rename it to `icon-512x512.png`
6. Place it in `mini-app/public/icon-512x512.png`

### Option 2: Using ImageMagick (CLI)
```bash
cd mini-app/public
convert icon.svg -resize 512x512 icon-512x512.png
```

### Option 3: Using Node.js Script
```bash
cd mini-app
npm install sharp --save-dev
node -e "const sharp = require('sharp'); sharp('public/icon.svg').resize(512, 512).png().toFile('public/icon-512x512.png');"
```

### Option 4: Using Inkscape (CLI)
```bash
cd mini-app/public
inkscape icon.svg --export-filename=icon-512x512.png --export-width=512 --export-height=512
```

### Verification
After creating the PNG, verify it exists:
```bash
ls -lh mini-app/public/icon-512x512.png
```

The file should be approximately 20-50 KB in size.
