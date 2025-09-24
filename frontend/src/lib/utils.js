import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}

export const getHealthStatus = (bmi) => {
  if (bmi < 18.5) return { status: 'Underweight', color: 'text-blue-600' }
  if (bmi < 25) return { status: 'Normal', color: 'text-green-600' }
  if (bmi < 30) return { status: 'Overweight', color: 'text-yellow-600' }
  return { status: 'Obese', color: 'text-red-600' }
}

export const getRiskLevel = (prediction) => {
  if (prediction < 5000) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' }
  if (prediction < 15000) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' }
  return { level: 'High', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' }
}