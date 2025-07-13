import React from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/stores/auth'
import AuthLoading from './AuthLoading'

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function PublicRoute({ 
  children, 
  redirectTo = '/' 
}: PublicRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isInitialized } = useAuth()
  
  // Get the intended destination
  const from = (location.state as any)?.from?.pathname || redirectTo

  // Wait for auth to initialize
  if (!isInitialized) {
    return <AuthLoading />
  }

  // Already authenticated - redirect to intended destination
  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  // Not authenticated - render children (auth pages)
  return <>{children}</>
}