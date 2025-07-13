import React from 'react'
import { useAuthStore } from '@/stores/auth'
import AuthLoading from './AuthLoading'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const isInitialized = useAuthStore((state) => state.isInitialized)

  React.useEffect(() => {
    if (!isInitialized) {
      useAuthStore.getState().initialize()
    }
  }, [isInitialized])

  if (!isInitialized) {
    return <AuthLoading text="Initializing..." />
  }

  return <>{children}</>
}

export default AuthProvider