import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const insuranceAPI = {
  // Predict insurance cost
  predictCost: async (inputData) => {
    try {
      const response = await api.post('/predict', inputData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to predict insurance cost')
    }
  },

  // Get model info
  getModelInfo: async () => {
    try {
      const response = await api.get('/model-info')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get model info')
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'API health check failed')
    }
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard-stats')
      return response.data
    } catch (error) {
      // Return mock data if API fails
      return {
        total_predictions: 1247,
        avg_cost: 13270,
        high_risk_patients: 312,
        recent_predictions: 47
      }
    }
  }
}

export default api