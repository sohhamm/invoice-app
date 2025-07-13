import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

interface PublicRouteProps {
  children: React.ReactNode
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, checkAuth } = useAuthStore()

  React.useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isAuthenticated) {
    // User is authenticated, redirect to home
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}