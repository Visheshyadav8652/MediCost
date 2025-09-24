import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Analytics from './components/Analytics'
import PredictionForm from './components/PredictionForm'
import { insuranceAPI } from './services/api'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [apiHealth, setApiHealth] = useState(null)

  useEffect(() => {
    // Check API health on component mount
    checkApiHealth()
  }, [])

  const checkApiHealth = async () => {
    try {
      const health = await insuranceAPI.healthCheck()
      setApiHealth(health)
    } catch (error) {
      setApiHealth({ status: 'unhealthy', error: error.message })
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <Home setActiveSection={setActiveSection} />
      case 'analytics':
        return <Analytics />
      case 'prediction':
        return <PredictionForm />
      default:
        return <Home setActiveSection={setActiveSection} />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Status Bar */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${
                apiHealth?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-muted-foreground">
                {apiHealth?.status === 'healthy' ? 'API Connected' : 'API Disconnected'}
              </span>
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App