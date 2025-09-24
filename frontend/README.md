# 🎨 Frontend - Modern Medical Dashboard

## 🌟 Features

### **Modern Sidebar Navigation**
- Sticky positioning with smooth animations
- Active state indicators with visual feedback
- Dark/Light mode toggle with system preference
- Quick access to all sections

### **Enhanced Components**
- **Home**: Welcome dashboard with stats and quick actions
- **Analytics**: Interactive charts with enhanced styling
- **Prediction**: Smart form with real-time validation

### **Theme System**
- React Context for theme management
- CSS custom properties for smooth transitions
- Automatic dark mode detection
- Persistent theme preference

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── Home.jsx         # Dashboard home page
│   ├── Analytics.jsx    # Charts and analytics
│   ├── PredictionForm.jsx # ML prediction form
│   └── Sidebar.jsx      # Navigation sidebar
├── context/
│   └── ThemeContext.jsx # Theme management
├── lib/
│   └── utils.js         # Utility functions
├── services/
│   └── api.js           # API integration
└── App.jsx              # Main application
```

## 🎨 Styling System

- **Tailwind CSS** for utility-first styling
- **CSS Custom Properties** for theme variables
- **Dark Mode Classes** for automatic theming
- **Animation Classes** for smooth transitions

## 📱 Responsive Breakpoints

- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up

## 🎯 Key Components

### **Sidebar**
- Fixed positioning with overlay on mobile
- Theme toggle integration
- Active state management
- Smooth hover effects

### **Home Dashboard**
- Real-time stats display
- Quick action buttons
- Recent activity feed
- Health tips panel

### **Analytics**
- Interactive Recharts integration
- Responsive chart containers
- Custom color schemes
- Tooltip enhancements

### **Prediction Form**
- Real-time validation
- Health status indicators
- Risk level assessment
- Enhanced result display
