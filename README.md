# Industrial Dashboard Suite

An extensible, interactive click dummy framework for industrial manufacturing dashboards. Built with React, TypeScript, and Tailwind CSS, featuring a professional wireframe aesthetic perfect for prototyping and demonstrations.

![Dashboard Preview](https://img.shields.io/badge/status-active-success)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

- **Extensible Architecture** - Easily add new dashboard use cases
- **Dark Mode** - Full dark mode support with smooth transitions
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Live Data Simulation** - Real-time data updates and animations
- **Professional UI** - Clean, modern interface with Balsamiq Sans font
- **No Backend Required** - Fully client-side, perfect for demos

## 📊 Included Dashboards

### 1. Thermal Processing
- Real-time temperature monitoring
- Conveyor speed tracking
- 24-hour timeline visualization
- Process control metrics

### 2. Production Tracking
- Hourly production logs
- Target vs actual performance
- KPI cards with color-coded status
- CSV export functionality (UI only)

### 3. Placeholder Dashboards
- Energy Management
- Quality Control
- Inventory Tracking

## 🚀 Quick Start

### As a React Artifact (Claude.ai)
Upload the `IndustrialDashboardSuite.jsx` file directly to Claude and it will render as an interactive artifact.

### As a Standalone HTML File
1. Open `industrial_dashboard_suite.html` in any modern browser
2. No build process or dependencies required

### As a React Project
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/industrial-dashboard-suite.git
cd industrial-dashboard-suite

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🏗️ Project Structure

```
industrial-dashboard-suite/
├── src/
│   ├── components/
│   │   ├── ThermalProcessingDashboard.jsx
│   │   ├── ProductionTrackingDashboard.jsx
│   │   └── ComingSoonView.jsx
│   ├── utils/
│   │   └── mockData.js
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── industrial_dashboard_suite.html
├── IndustrialDashboardSuite.jsx (single-file version)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## ➕ Adding New Dashboards

1. Create your dashboard component:

```javascript
const MyNewDashboard = ({ darkMode }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">My Dashboard</h1>
      {/* Your dashboard content */}
    </div>
  );
};
```

2. Add it to the `useCases` array in `App.jsx`:

```javascript
{
  id: 'my-dashboard',
  name: 'My Dashboard',
  icon: YourIcon,
  description: 'Dashboard description',
  component: MyNewDashboard
}
```

That's it! Your dashboard will automatically appear in the sidebar.

## 🎨 Design Principles

- **Wireframe Aesthetic** - Uses Balsamiq Sans font for a deliberate "prototype" look
- **Color Schema**:
  - Primary: Blue tones (#3b82f6, #2563eb)
  - Success: Green (#10b981, #059669)
  - Warning: Orange/Amber (#f59e0b)
  - Error: Red (#ef4444)
  - Neutral: Gray scale

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Vite** - Build tool
- **Balsamiq Sans** - Wireframe font

## 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Template design inspired by modern industrial SCADA systems
- Built for rapid prototyping and client demonstrations
- Perfect for portfolio projects and use case libraries

## 📧 Contact

Jakob Gabriel - Digital Engineer specializing in industrial automation and data integration

Project Link: [https://github.com/YOUR_USERNAME/industrial-dashboard-suite](https://github.com/YOUR_USERNAME/industrial-dashboard-suite)

---

**Note**: This is a click dummy/prototype framework. For production use, integrate with real backend services and implement proper authentication, data validation, and error handling.
