import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select } from './ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { insuranceAPI } from '../services/api'
import { formatCurrency, getHealthStatus, getRiskLevel } from '../lib/utils'
import { 
  Loader2, 
  DollarSign, 
  User, 
  Heart, 
  MapPin, 
  Users, 
  Weight,
  Calculator,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    bmi: '',
    children: '',
    smoker: '',
    region: ''
  })

  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Convert string values to appropriate types
      const processedData = {
        age: parseInt(formData.age),
        sex: formData.sex,
        bmi: parseFloat(formData.bmi),
        children: parseInt(formData.children),
        smoker: formData.smoker,
        region: formData.region
      }

      const result = await insuranceAPI.predictCost(processedData)
      setPrediction(result)
    } catch (err) {
      setError(err.message)
      setPrediction(null)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      age: '',
      sex: '',
      bmi: '',
      children: '',
      smoker: '',
      region: ''
    })
    setPrediction(null)
    setError('')
  }

  const isFormValid = Object.values(formData).every(value => value !== '')

  // Calculate health insights
  const healthStatus = formData.bmi ? getHealthStatus(parseFloat(formData.bmi)) : null
  const riskLevel = prediction ? getRiskLevel(prediction.predicted_cost) : null

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Insurance Cost Prediction</h2>
        <p className="text-muted-foreground">
          Get accurate insurance cost estimates using our advanced machine learning model
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prediction Form */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Enter your details below to get an accurate cost estimate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Age
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="100"
                    required
                  />
                </div>

                {/* Sex */}
                <div className="space-y-2">
                  <Label htmlFor="sex" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Sex
                  </Label>
                  <Select
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Select>
                </div>

                {/* BMI */}
                <div className="space-y-2">
                  <Label htmlFor="bmi" className="flex items-center gap-2">
                    <Weight className="h-4 w-4" />
                    BMI
                  </Label>
                  <Input
                    id="bmi"
                    name="bmi"
                    type="number"
                    step="0.1"
                    placeholder="Enter your BMI"
                    value={formData.bmi}
                    onChange={handleInputChange}
                    min="15"
                    max="50"
                    required
                  />
                  {healthStatus && (
                    <p className={`text-xs ${healthStatus.color}`}>
                      Status: {healthStatus.status}
                    </p>
                  )}
                </div>

                {/* Children */}
                <div className="space-y-2">
                  <Label htmlFor="children" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Children
                  </Label>
                  <Input
                    id="children"
                    name="children"
                    type="number"
                    placeholder="Number of children"
                    value={formData.children}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    required
                  />
                </div>

                {/* Smoker */}
                <div className="space-y-2">
                  <Label htmlFor="smoker" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Smoker
                  </Label>
                  <Select
                    id="smoker"
                    name="smoker"
                    value={formData.smoker}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select smoking status</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <Label htmlFor="region" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Region
                  </Label>
                  <Select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select region</option>
                    <option value="northeast">Northeast</option>
                    <option value="northwest">Northwest</option>
                    <option value="southeast">Southeast</option>
                    <option value="southwest">Southwest</option>
                  </Select>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Predict Cost
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results and Information */}
        <div className="space-y-6">
          {/* Prediction Result */}
          {prediction && (
            <Card className="animate-slide-up border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Prediction Result
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-300">
                  Based on the provided information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-800 dark:text-green-200 mb-2">
                    {formatCurrency(prediction.predicted_cost)}
                  </div>
                  <p className="text-green-600 dark:text-green-300 mb-4">Estimated Annual Insurance Cost</p>

                  {riskLevel && (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${riskLevel.bg} ${riskLevel.color}`}>
                      Risk Level: {riskLevel.level}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Age:</span> {prediction.input_data.age}
                  </div>
                  <div>
                    <span className="font-semibold">Sex:</span> {prediction.input_data.sex}
                  </div>
                  <div>
                    <span className="font-semibold">BMI:</span> {prediction.input_data.bmi}
                  </div>
                  <div>
                    <span className="font-semibold">Children:</span> {prediction.input_data.children}
                  </div>
                  <div>
                    <span className="font-semibold">Smoker:</span> {prediction.input_data.smoker}
                  </div>
                  <div>
                    <span className="font-semibold">Region:</span> {prediction.input_data.region}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* How it Works */}
          <Card className="animate-slide-up bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200 text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-700 dark:text-blue-300 space-y-3">
              <p>
                Our prediction model uses <strong>Random Forest machine learning</strong> to estimate insurance costs based on key demographic and health factors.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">Key Factors Considered:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Age (higher age = higher premiums)</li>
                  <li>BMI (health status indicator)</li>
                  <li>Smoking status (major cost factor)</li>
                  <li>Number of dependents</li>
                  <li>Geographic region</li>
                </ul>
              </div>
              <p className="text-xs opacity-80">
                <strong>Note:</strong> This is an estimate for informational purposes. Actual costs may vary based on additional factors and insurance company policies.
              </p>
            </CardContent>
          </Card>

          {/* Cost Factors */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg">Cost Impact Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="font-medium">Smoking</span>
                <span className="text-red-600 font-bold">+200-300%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="font-medium">High BMI (>30)</span>
                <span className="text-yellow-600 font-bold">+20-50%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="font-medium">Age (per decade)</span>
                <span className="text-blue-600 font-bold">+15-25%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="font-medium">Children</span>
                <span className="text-purple-600 font-bold">+5-10% each</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PredictionForm