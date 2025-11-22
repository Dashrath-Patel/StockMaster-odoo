import { supabase } from '../config/supabase'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:54321/api'

/**
 * Get the current Supabase session token
 */
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

/**
 * Make an authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error('Not authenticated')
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null
  }

  return response.json()
}

// Products API
export const productsApi = {
  list: () => apiRequest('/products'),
  get: (id) => apiRequest(`/products/${id}`),
  create: (data) => apiRequest('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
}

// Categories API
export const categoriesApi = {
  list: () => apiRequest('/categories'),
  create: (data) => apiRequest('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/categories/${id}`, { method: 'DELETE' }),
}

// Suppliers API
export const suppliersApi = {
  list: () => apiRequest('/suppliers'),
  create: (data) => apiRequest('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/suppliers/${id}`, { method: 'DELETE' }),
}

// Stock Movements API
export const stockMovementsApi = {
  list: () => apiRequest('/stock-movements'),
  create: (data) => apiRequest('/stock-movements', { method: 'POST', body: JSON.stringify(data) }),
}

// Reports API
export const reportsApi = {
  dashboard: () => apiRequest('/reports/dashboard'),
  inventoryValue: () => apiRequest('/reports/inventory-value'),
  stockMovements: (params) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/reports/stock-movements${query ? `?${query}` : ''}`)
  },
  lowStock: (threshold) => apiRequest(`/reports/low-stock?threshold=${threshold || 10}`),
}

export default {
  products: productsApi,
  categories: categoriesApi,
  suppliers: suppliersApi,
  stockMovements: stockMovementsApi,
  reports: reportsApi,
}
