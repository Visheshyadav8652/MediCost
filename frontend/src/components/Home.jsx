import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { formatCurrency, formatNumber } from '../lib/utils'
import { insuranceAPI } from '../services/api'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Activity,
  Clock,
  ArrowRight,
  Heart,
  Shield,
  BarChart3,
  Calculator
} from 'lucide-react'

const Home = ({ setActiveSection }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await insuranceAPI.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        // Use fallback data
        setStats({
          total_predictions: 1247,
          avg_cost: 13270,
          high_risk_patients: 312,
          recent_predictions: 47
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const quickActions = [
    {
      title: 'New Prediction',
      description: 'Calculate insurance cost',
      icon: Calculator,
      action: () => setActiveSection('prediction'),
      color: 'medical-gradient'
    },
    {
      title: 'View Analytics',
      description: 'Explore data insights',
      icon: BarChart3,
      action: () => setActiveSection('analytics'),
      color: 'health-gradient'
    }
  ]

  const recentActivity = [
    { action: 'High-risk patient identified', time: '2 min ago', type: 'warning' },
    { action: 'New prediction completed', time: '5 min ago', type: 'success' },
    { action: 'Analytics report generated', time: '12 min ago', type: 'info' },
    { action: 'Model accuracy improved', time: '1 hour ago', type: 'success' }
  ]

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to MediCost Dashboard</h1>
            <p className="text-blue-100 text-lg">
              Intelligent medical insurance cost prediction powered by machine learning
            </p>
            <p className="text-blue-200 text-sm mt-2">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <div className="hidden md:block">
            <Shield className="h-20 w-20 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(stats?.total_predictions || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats?.avg_cost || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Patients</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatNumber(stats?.high_risk_patients || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Predictions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(stats?.recent_predictions || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" />
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <Card 
              key={action.title} 
              className="animate-slide-up cursor-pointer group hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity & Health Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest system activities and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Health Tips */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Health Tips</span>
            </CardTitle>
            <CardDescription>Daily recommendations for better health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">BMI Management</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Maintaining a healthy BMI between 18.5-24.9 can significantly reduce insurance costs.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Smoking Cessation</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Quitting smoking can reduce insurance premiums by up to 50% and improve overall health.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Regular Checkups</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Annual health screenings help catch issues early and may qualify for insurance discounts.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Home