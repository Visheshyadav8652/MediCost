import React from 'react'
import { cn } from '../lib/utils'
import { useTheme } from '../context/ThemeContext'
import { Switch } from './ui/switch'
import { 
  Home, 
  BarChart3, 
  Calculator, 
  Shield, 
  Sun, 
  Moon,
  Activity,
  Settings
} from 'lucide-react'

const Sidebar = ({ activeSection, setActiveSection }) => {
  const { theme, toggleTheme } = useTheme()

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      description: 'Dashboard Overview'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Data Insights'
    },
    {
      id: 'prediction',
      label: 'Prediction',
      icon: Calculator,
      description: 'Cost Predictor'
    }
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">MediCost</h1>
            <p className="text-sm text-muted-foreground">Health Predictor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group',
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 transition-transform duration-200',
                isActive ? 'scale-110' : 'group-hover:scale-105'
              )} />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className={cn(
                  'text-xs',
                  isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}>
                  {item.description}
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Settings & Theme Toggle */}
      <div className="p-4 border-t border-border space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {theme === 'light' ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {theme === 'light' ? 'Light' : 'Dark'} Mode
            </span>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
          />
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Activity className="h-3 w-3 text-green-500" />
          <span>System Online</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar