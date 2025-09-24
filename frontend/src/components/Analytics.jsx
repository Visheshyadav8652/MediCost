import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

// Sample data for analytics
const smokerData = [
  { name: 'Non-Smoker', averageCost: 8434, count: 1064 },
  { name: 'Smoker', averageCost: 32050, count: 274 }
]

const ageDistributionData = [
  { ageGroup: '18-25', count: 145, avgCost: 9500 },
  { ageGroup: '26-35', count: 280, avgCost: 10800 },
  { ageGroup: '36-45', count: 267, avgCost: 13200 },
  { ageGroup: '46-55', count: 290, avgCost: 16800 },
  { ageGroup: '56-65', count: 356, avgCost: 21500 }
]

const bmiVsChargesData = [
  { bmi: '18.5-25', avgCost: 8200, category: 'Normal' },
  { bmi: '25-30', avgCost: 11400, category: 'Overweight' },
  { bmi: '30-35', avgCost: 15600, category: 'Obese I' },
  { bmi: '35-40', avgCost: 19800, category: 'Obese II' },
  { bmi: '40+', avgCost: 24500, category: 'Obese III' }
]

const regionData = [
  { name: 'Northeast', value: 324, color: '#3b82f6' },
  { name: 'Northwest', value: 325, color: '#10b981' },
  { name: 'Southeast', value: 364, color: '#f59e0b' },
  { name: 'Southwest', value: 325, color: '#ef4444' }
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

const Analytics = () => {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Comprehensive insights into medical insurance cost patterns and trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Smoker vs Non-Smoker */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Average Costs by Smoking Status</CardTitle>
            <CardDescription>Impact of smoking on insurance premiums</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={smokerData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Average Cost']} 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="averageCost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle>Age Distribution & Average Costs</CardTitle>
            <CardDescription>Cost trends across different age groups</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ageDistributionData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="ageGroup" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'avgCost' ? `$${value.toLocaleString()}` : value,
                    name === 'avgCost' ? 'Average Cost' : 'Count'
                  ]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="avgCost" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* BMI vs Charges */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle>BMI Categories vs Average Costs</CardTitle>
            <CardDescription>Health impact on insurance premiums</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bmiVsChargesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Average Cost']} 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="avgCost" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>Policyholders by geographic region</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1,338</div>
            <p className="text-xs text-muted-foreground">Active insurance policies</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$13,270</div>
            <p className="text-xs text-muted-foreground">Across all policies</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smoking Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">+278%</div>
            <p className="text-xs text-muted-foreground">Higher cost for smokers</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Age Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">+126%</div>
            <p className="text-xs text-muted-foreground">Cost increase with age</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Analytics