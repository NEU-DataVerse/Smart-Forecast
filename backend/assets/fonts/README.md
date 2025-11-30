# Fonts for PDF Reports

This directory contains fonts for PDF report generation with Vietnamese character support.

## Required Font

To properly display Vietnamese characters in PDF reports, you need to add a Unicode-compatible font to this directory.

### Recommended Fonts (choose one):

1. **Roboto** (Google Fonts - Apache 2.0 License)
   - Download: https://fonts.google.com/specimen/Roboto
   - File needed: `Roboto-Regular.ttf`

2. **Noto Sans** (Google Fonts - OFL License)
   - Download: https://fonts.google.com/specimen/Noto+Sans
   - File needed: `NotoSans-Regular.ttf`

3. **DejaVu Sans** (Free License)
   - Download: https://dejavu-fonts.github.io/
   - File needed: `DejaVuSans.ttf`

## Installation

1. Download one of the recommended fonts
2. Copy the `.ttf` file to this directory (`backend/assets/fonts/`)
3. Restart the backend server

## Example

```bash
# Using curl to download Roboto font
curl -L "https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf" -o Roboto-Regular.ttf
```

## Notes

- The system will automatically detect and use any of the supported fonts
- If no font is found, PDF reports will use the default PDFKit font (which may not display Vietnamese characters correctly)
- Only one font file is needed
