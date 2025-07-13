import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'
import {apiAxios} from '@/configs/axios'
import {StorageService} from '@/services/storage'
import type {User, LoginRequest, SignupRequest, AuthResponse} from '@/types/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  initialize: () => Promise<void>
  login: (credentials: LoginRequest) => Promise<void>
  signup: (userData: SignupRequest) => Promise<void>
  logout: () => void
  clearError: () => void
  updateUser: (user: User) => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initialize: async () => {
        // Skip if already initialized
        if (get().isInitialized) return

        try {
          const token = StorageService.getAccessToken()
          const storedUser = StorageService.get('user')

          if (!token || !storedUser) {
            set({...initialState, isInitialized: true})
            return
          }

          // Parse stored user
          const user = JSON.parse(storedUser)

          // Validate token with backend
          try {
            const response = await apiAxios.get('/auth/profile')

            // Update user data from backend (in case it changed)
            set({
              user: response.data.data || user,
              token,
              isAuthenticated: true,
              isInitialized: true,
              isLoading: false,
              error: null,
            })
          } catch (error) {
            // Token is invalid, clean up
            StorageService.clear()
            set({...initialState, isInitialized: true})
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({...initialState, isInitialized: true})
        }
      },

      login: async (credentials: LoginRequest) => {
        try {
          set({isLoading: true, error: null})

          const response = await apiAxios.post<AuthResponse>('/auth/login', credentials)
          const {user, token} = response.data

          // Store authentication data
          StorageService.setAccessToken(token)
          StorageService.set('user', JSON.stringify(user))

          set({
            user,
            token,
            isAuthenticated: true,
            isInitialized: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
          set({
            ...initialState,
            isInitialized: true,
            error: errorMessage,
          })
          throw new Error(errorMessage)
        }
      },

      signup: async (userData: SignupRequest) => {
        try {
          set({isLoading: true, error: null})

          const response = await apiAxios.post<AuthResponse>('/auth/signup', userData)
          const {user, token} = response.data

          // Store authentication data
          StorageService.setAccessToken(token)
          StorageService.set('user', JSON.stringify(user))

          set({
            user,
            token,
            isAuthenticated: true,
            isInitialized: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.'
          set({
            ...initialState,
            isInitialized: true,
            error: errorMessage,
          })
          throw new Error(errorMessage)
        }
      },

      logout: () => {
        // Clear all stored data
        StorageService.clear()

        // Reset store to initial state
        set({...initialState, isInitialized: true})

        // Redirect to login (will be handled by ProtectedRoute)
      },

      clearError: () => {
        set({error: null})
      },

      updateUser: (user: User) => {
        StorageService.set('user', JSON.stringify(user))
        set({user})
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

// Selector hooks for better performance in Zustand v5
export const useAuth = () => {
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isInitialized = useAuthStore(state => state.isInitialized)
  const isLoading = useAuthStore(state => state.isLoading)

  return {user, isAuthenticated, isInitialized, isLoading}
}

export const useAuthActions = () => {
  const login = useAuthStore(state => state.login)
  const signup = useAuthStore(state => state.signup)
  const logout = useAuthStore(state => state.logout)
  const initialize = useAuthStore(state => state.initialize)
  const clearError = useAuthStore(state => state.clearError)

  return {login, signup, logout, initialize, clearError}
}

export const useAuthError = () => useAuthStore(state => state.error)
export const useCurrentUser = () => useAuthStore(state => state.user)
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated)
export const useIsInitialized = () => useAuthStore(state => state.isInitialized)
