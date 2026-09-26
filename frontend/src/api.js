import axios from 'axios'

// Dynamically detect base API path depending on whether running in Vite dev server (:5173) or XAMPP subfolder
const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }
  if (typeof window !== 'undefined' && window.location.pathname.includes('/atas-resort/backend/public')) {
    return '/atas-resort/backend/public/api'
  }
  return '/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

export default api