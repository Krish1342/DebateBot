# Frontend - DebateBot UI

A modern, responsive React application for the DebateBot AI debate platform.

## 🎯 Overview

Built with React 18 and Vite, this frontend provides a beautiful dark-themed interface for interacting with the DebateBot API.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Dependencies

- **react** (18.2.0) - UI library
- **react-dom** (18.2.0) - DOM rendering
- **lucide-react** (0.263.1) - Icon library (optional, for future enhancements)

### Dev Dependencies

- **vite** (4.4.5) - Build tool and dev server
- **@vitejs/plugin-react** (4.0.3) - React plugin for Vite
- **TypeScript** support available

## 📁 Project Structure

```
src/
├── main.jsx              # Vite entry point
├── App.jsx               # Root component
├── App.css               # App styles
├── index.css             # Global styles and animations
└── components/
    ├── DebateInput.jsx      # Input form component
    ├── DebateInput.css      # Input form styles
    ├── DebateArena.jsx      # Debate display wrapper
    ├── DebateArena.css      # Arena layout styles
    ├── DebateSide.jsx       # Proposition/Opposition side
    ├── DebateSide.css       # Side styles
    ├── ArgumentCard.jsx     # Individual argument card
    └── ArgumentCard.css     # Card styles and animations
```

## 🎨 Design System

### Colors

- **Primary Background**: `#0a0f1a`
- **Secondary Background**: `#0d1420`
- **Card Background**: `#111827`
- **Cyan Accent**: `#06b6d4` (Proposition)
- **Pink Accent**: `#ec4899` (Opposition)

### Fonts

- **Headings**: Space Grotesk (geometric, modern)
- **Body**: Plus Jakarta Sans (clean, readable)

### Animations

- **fadeInUp**: Fade with upward motion
- **slideInLeft/Right**: Slide from left/right with scale
- **pulse**: Smooth pulsing effect
- **shimmer**: Gradient shimmer effect
- **glow**: Glowing box shadow effect

## 🔧 Configuration

### Vite Config

Edit `vite.config.js` to customize:

- Port (default: 5173)
- API proxy settings
- Build output directory

### API Proxy

The dev server proxies `/api/*` requests to the backend:

```javascript
proxy: {
  '/api': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
  }
}
```

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## ⚡ Performance Optimizations

- Code splitting with Vite
- Lazy component loading possible
- CSS animations use hardware acceleration
- Efficient state management with React hooks
- No unnecessary re-renders

## 🎯 Features

### DebateInput Component

- Auto-expanding textarea
- Sample topic suggestions
- Real-time validation
- Smooth form interactions

### DebateArena Component

- Side-by-side debate layout
- Responsive grid system
- Animated divider between sides

### DebateSide Component

- Color-coded sides (cyan/pink)
- Animated side headers
- Staggered card animations

### ArgumentCard Component

- Expandable/collapsible arguments
- Smooth height transitions
- Hover effects with shadows
- Stage labels and status indicators
- Professional typography

## 🔗 API Integration

Base URL: `http://127.0.0.1:8000` (proxied via `/api`)

### Endpoints Used

- `POST /api/debate` - Generate debate
- `GET /api/health` - Health check

### Example Usage

```javascript
const response = await fetch("/api/debate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ topic: "Should we accelerate AI?" }),
});
const data = await response.json();
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📚 Additional Resources

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Space Grotesk Font](https://fonts.google.com/specimen/Space+Grotesk)
- [Plus Jakarta Sans Font](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

## 🐛 Troubleshooting

### Port Already in Use

Change port in `vite.config.js`:

```javascript
server: {
  port: 5174,
  // ...
}
```

### API Connection Issues

Check that:

1. Backend is running on `http://127.0.0.1:8000`
2. CORS is enabled (should be by default)
3. Network tab in DevTools shows the requests

### Style Issues

Clear browser cache or do a hard refresh (Ctrl+Shift+R)

---

**Last Updated**: January 2026
