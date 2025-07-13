import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiAxios } from '@/configs/axios'
import { StorageService } from '@/services/storage'
import type { User, LoginRequest, SignupRequest, AuthResponse } from '../../../../../packages/shared-types/src'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>
  signup: (userData: SignupRequest) => Promise<void>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  checkAuth: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await apiAxios.post<AuthResponse>('/auth/login', credentials)
          const { user, token } = response.data

          // Store in localStorage via StorageService
          StorageService.setAccessToken(token)
          StorageService.set('user', JSON.stringify(user))

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          })
          throw error
        }
      },

      signup: async (userData: SignupRequest) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await apiAxios.post<AuthResponse>('/auth/signup', userData)
          const { user, token } = response.data

          // Store in localStorage via StorageService
          StorageService.setAccessToken(token)
          StorageService.set('user', JSON.stringify(user))

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          })
          throw error
        }
      },

      logout: () => {
        // Clear localStorage
        StorageService.setAccessToken('')
        StorageService.set('user', '')

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      clearError: () => {
        set({ error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true })

          const storedToken = StorageService.getAccessToken()
          const storedUser = StorageService.get('user')

          if (!storedToken || !storedUser) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            })
            return
          }

          const user = JSON.parse(storedUser)

          // Verify token is still valid
          try {
            await apiAxios.get('/auth/profile')
            set({
              user,
              token: storedToken,
              isAuthenticated: true,
              isLoading: false,
            })
          } catch (error) {
            // Token is invalid, clear everything
            get().logout()
          }
        } catch (error) {
          get().logout()
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)