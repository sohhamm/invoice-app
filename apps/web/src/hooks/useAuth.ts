import { useCallback, useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuthActions, useAuth as useAuthState, useAuthError } from '@/stores/auth'
import type { LoginRequest, SignupRequest } from '@/types/auth'

interface UseAuthOptions {
  redirectTo?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useAuth(options: UseAuthOptions = {}) {
  const navigate = useNavigate()
  const location = useLocation()
  const authState = useAuthState()
  const authActions = useAuthActions()
  const authError = useAuthError()
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true)
    try {
      await authActions.login(credentials)
      
      // Get redirect destination
      const from = (location.state as any)?.from?.pathname || options.redirectTo || '/'
      
      // Call success callback if provided
      options.onSuccess?.()
      
      // Navigate to destination
      navigate(from, { replace: true })
    } catch (error: any) {
      // Call error callback if provided
      options.onError?.(error.message)
      setIsLoading(false)
    }
  }, [authActions, navigate, location, options])

  const signup = useCallback(async (userData: SignupRequest) => {
    setIsLoading(true)
    try {
      await authActions.signup(userData)
      
      // Call success callback if provided
      options.onSuccess?.()
      
      // Navigate to destination
      navigate(options.redirectTo || '/', { replace: true })
    } catch (error: any) {
      // Call error callback if provided
      options.onError?.(error.message)
      setIsLoading(false)
    }
  }, [authActions, navigate, options])

  const logout = useCallback(() => {
    authActions.logout()
    navigate('/auth/login')
  }, [authActions, navigate])

  return {
    ...authState,
    ...authActions,
    login,
    signup,
    logout,
    error: authError,
    isLoading: isLoading || authState.isLoading,
  }
}

// Specialized hooks for common use cases
export function useAuthUser() {
  const { user } = useAuthState()
  return user
}

export function useAuthStatus() {
  const { isAuthenticated, isInitialized } = useAuthState()
  return { isAuthenticated, isInitialized }
}

export function useLogout() {
  const navigate = useNavigate()
  const { logout } = useAuthActions()
  
  return useCallback(() => {
    logout()
    navigate('/auth/login')
  }, [logout, navigate])
}