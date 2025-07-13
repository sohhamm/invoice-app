import axios from 'axios'
import {StorageService} from '@/services/storage'
import type {InternalAxiosRequestConfig} from 'axios'

export const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API || 'http://localhost:3000/api',
  timeout: 10000,
})

apiAxios.defaults.headers.common['Content-Type'] = 'application/json'
// apiAxios.defaults.headers.common['Authorization'] = `Bearer ${StorageService.getAccessToken()}`

apiAxios.interceptors.request.use(addAccessToken)

function addAccessToken(config: InternalAxiosRequestConfig) {
  const headers = config.headers || {}
  const accessToken = StorageService.getAccessToken()

  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
  config.headers = headers

  return config
}
