# FlowStack App

This is the official codebase for the FlowStack SaaS ecosystem website.

## Tech Stack
- **Framework**: Vite (Vanilla JS)
- **Styling**: Modern CSS3 (Variables, Flexbox/Grid) with custom Design System
- **Icons**: Lucide
- **Animations**: AOS (Animate on Scroll)

## Project Structure
- `src/style.css`: The core design system (Typography, Colors, Components).
- `src/main.js`: Main logic for the homepage (Data injection, Lucide init).
- `index.html`: Homepage structure.
- `products/`: Individual product landing pages (MPA structure).

## Commands

### Development
Run the local dev server:
```bash
npm run dev
```

### Production Build
Build for production (generates `dist/` folder):
```bash
npm run build
```

## Deployment
This project is Vercel-ready. Simply import the repository into Vercel, and it will automatically detect the Vite settings.
Output directory: `dist`
