# Setup Instructions

## Quick Start Options

You have **3 ways** to use this project:

### Option 1: Standalone HTML (Easiest)
**No installation required!**

1. Open `industrial_dashboard_suite.html` directly in your browser
2. That's it! Fully functional dashboard

**Best for**: Quick demos, presentations, sharing with non-technical users

---

### Option 2: React Artifact in Claude.ai
**Perfect for rapid iteration**

1. Go to [Claude.ai](https://claude.ai)
2. Upload `IndustrialDashboardSuite.jsx`
3. It will render as an interactive artifact
4. Ask Claude to modify it: "Add a new dashboard for X"

**Best for**: Prototyping, iterating with AI assistance

---

### Option 3: Full React Project
**For development and customization**

#### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn package manager
- Git (optional)

#### Installation Steps

1. **Clone or Download**
   ```bash
   git clone https://github.com/YOUR_USERNAME/industrial-dashboard-suite.git
   cd industrial-dashboard-suite
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This installs:
   - React & React DOM
   - Vite (build tool)
   - Tailwind CSS (styling)
   - Lucide React (icons)

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Opens at: `http://localhost:3000`

4. **Build for Production**
   ```bash
   npm run build
   ```
   Output: `dist/` folder

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

**Best for**: Full development, version control, production deployment

---

## Development Workflow

### Project Structure
```
industrial-dashboard-suite/
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles (Tailwind imports)
├── industrial_dashboard_suite.html  # Standalone version
├── IndustrialDashboardSuite.jsx     # Single-file artifact
├── index.html               # Vite HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── README.md                # Documentation
```

### Adding a New Dashboard

1. **Edit `src/App.jsx`**
2. **Create your component**:
   ```javascript
   const MyDashboard = ({ darkMode }) => {
     return (
       <div className="p-6">
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
           My Dashboard
         </h1>
         {/* Your content */}
       </div>
     );
   };
   ```

3. **Add to useCases array**:
   ```javascript
   {
     id: 'my-dashboard',
     name: 'My Dashboard',
     icon: YourIcon,
     description: 'Description',
     component: MyDashboard
   }
   ```

4. **Save and refresh** - Hot reload will update automatically

---

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process or use a different port
npm run dev -- --port 3001
```

### Tailwind styles not applying
```bash
# Rebuild Tailwind
npm run build
```

### Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Dark mode not working
- Ensure you're toggling the dark mode button
- Check browser console for errors
- Verify `document.documentElement.classList` includes 'dark'

---

## Deployment

### Deploy to Netlify
1. Push to GitHub
2. Connect repository to [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

### Deploy to Vercel
1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Framework preset: Vite
4. Deploy!

### Deploy to GitHub Pages
```bash
# Build
npm run build

# Deploy (requires gh-pages package)
npm install -D gh-pages
npx gh-pages -d dist
```

---

## Environment Variables

Currently, this project doesn't use environment variables. If you need to add API endpoints or configuration:

1. Create `.env` file in root
2. Add variables: `VITE_API_URL=https://api.example.com`
3. Access in code: `import.meta.env.VITE_API_URL`

---

## Performance Tips

- Use React DevTools to profile components
- Lazy load dashboards if adding many use cases
- Optimize SVG charts for large datasets
- Use `React.memo()` for expensive components

---

## Browser Compatibility

Tested and working on:
- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

---

## Need Help?

- 📖 [React Documentation](https://react.dev)
- 🎨 [Tailwind CSS Docs](https://tailwindcss.com/docs)
- ⚡ [Vite Documentation](https://vitejs.dev)
- 💬 Open an issue on GitHub
