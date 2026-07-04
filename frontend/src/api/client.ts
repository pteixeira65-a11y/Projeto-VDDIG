import axios from 'axios'

export const api = axios.create({ baseURL: 'http://localhost:8000' })

// Injeta o token JWT (se houver) em toda requisição.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
