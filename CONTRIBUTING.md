# Contributing to Industrial Dashboard Suite

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/industrial-dashboard-suite.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Start development server: `npm run dev`

## Development Workflow

### Adding a New Dashboard

1. Create your component in `src/components/` (or directly in `src/App.jsx` for simplicity)
2. Follow the existing dashboard structure
3. Add your dashboard to the `useCases` array
4. Test in both light and dark mode
5. Ensure responsive design works on mobile, tablet, and desktop

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS utility classes (no custom CSS)
- Keep components focused and modular
- Add comments for complex logic

### Component Template

```javascript
const MyDashboard = ({ darkMode }) => {
  // State management
  const [data, setData] = useState([]);
  
  // Effects
  useEffect(() => {
    // Setup logic
  }, []);
  
  // Render
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard Title
      </h1>
      {/* Dashboard content */}
    </div>
  );
};
```

## Design Guidelines

### Color Palette
- **Primary**: Blue (#3b82f6, #2563eb, #1d4ed8)
- **Success**: Green (#10b981, #059669)
- **Warning**: Amber (#f59e0b, #d97706)
- **Error**: Red (#ef4444, #dc2626)
- **Neutral**: Gray scale

### Typography
- Use Balsamiq Sans font for wireframe aesthetic
- Headings: `text-2xl`, `text-3xl`, `text-4xl`
- Body: `text-base`
- Labels: `text-sm`

### Spacing
- Card padding: `p-6` or `p-4`
- Section gaps: `gap-4` or `gap-6`
- Generous whitespace

### Components
- Rounded corners: `rounded-lg`, `rounded-xl`
- Shadows: `shadow-sm`, `shadow-md`
- Hover states on all interactive elements
- Smooth transitions: `transition-colors`, `transition-all`

## Testing

Before submitting:
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test on mobile (< 640px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] All interactive elements have hover states
- [ ] No console errors or warnings

## Commit Guidelines

Use clear, descriptive commit messages:

- `feat: Add energy management dashboard`
- `fix: Correct dark mode colors in production table`
- `docs: Update README with new dashboard info`
- `style: Improve spacing in thermal dashboard`
- `refactor: Extract chart component`

## Pull Request Process

1. Update README.md if you add new features
2. Ensure all tests pass
3. Update documentation as needed
4. Request review from maintainers
5. Address any feedback

## Questions?

Open an issue or reach out to the maintainers.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.
