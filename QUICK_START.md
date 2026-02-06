# Quick Start Guide

## 🚀 Get Running in 30 Seconds

### Just Want to See It?
1. Extract the archive
2. Open `industrial_dashboard_suite.html` in your browser
3. Done! ✅

---

## 🛠️ Want to Develop?

```bash
# Extract and enter directory
tar -xzf industrial-dashboard-suite.tar.gz
cd industrial-dashboard-suite

# Install and run
npm install
npm run dev
```

Opens at: `http://localhost:3000`

---

## ✨ Common Tasks

### Add a New Dashboard

Edit `src/App.jsx` and add:

```javascript
// 1. Create component
const MyDashboard = ({ darkMode }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold">My Dashboard</h1>
  </div>
);

// 2. Add to useCases array
{
  id: 'my-dashboard',
  name: 'My Dashboard',
  icon: Activity,
  description: 'My description',
  component: MyDashboard
}
```

### Change Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: { 500: '#YOUR_COLOR' }
}
```

### Build for Production

```bash
npm run build
# Output in dist/
```

---

## 📁 What's Included?

```
├── industrial_dashboard_suite.html  ← Open this!
├── IndustrialDashboardSuite.jsx     ← Upload to Claude
├── src/App.jsx                       ← Main code
├── README.md                         ← Full docs
└── package.json                      ← Dependencies
```

---

## 🎯 Use Cases

1. **Client Demos** - Show dashboard concepts instantly
2. **Prototyping** - Rapid iteration with Claude.ai
3. **Portfolio** - Professional project showcase
4. **Development** - Full React project setup

---

## 💡 Tips

- **Dark Mode**: Click moon icon in header
- **Sidebar**: Click arrow to collapse
- **Responsive**: Works on mobile, tablet, desktop
- **No Backend**: Everything runs client-side

---

## 🆘 Problems?

- **Won't start**: Run `npm install` again
- **Port in use**: Change port in `vite.config.js`
- **Styles broken**: Run `npm run build`

---

## 📚 More Info

- Full docs: `README.md`
- Setup guide: `SETUP.md`
- Contributing: `CONTRIBUTING.md`

**That's it! Happy building! 🎉**
