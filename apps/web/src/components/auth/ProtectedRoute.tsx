import React from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/stores/auth'
import AuthLoading from './AuthLoading'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isInitialized } = useAuth()

  // Wait for auth to initialize
  if (!isInitialized) {
    return <AuthLoading />
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    )
  }

  // Authenticated - render children
  return <>{children}</>
}