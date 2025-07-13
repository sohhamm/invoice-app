import { useState, useEffect } from 'react'
import { StorageService } from '@/services/storage'
import { apiAxios } from '@/configs/axios'
import type { User } from '../../../../packages/shared-types/src'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = StorageService.getAccessToken()
      const userStr = StorageService.get('user')
      
      if (!token || !userStr) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
        return
      }

      const user = JSON.parse(userStr)
      
      // Verify token is still valid by checking profile
      try {
        await apiAxios.get('/auth/profile')
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        })
      } catch (error) {
        // Token is invalid, clear storage
        logout()
      }
    } catch (error) {
      logout()
    }
  }

  const logout = () => {
    StorageService.setAccessToken('')
    StorageService.set('user', '')
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    })
  }

  return {
    ...authState,
    logout,
    checkAuthStatus
  }
}