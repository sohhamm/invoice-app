import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import Button from '@/components/ui/button/Button'
import { AuthCard } from '@/components/auth'
import { useAuthActions, useAuthError } from '@/stores/auth'
import { Toast } from '@/components/ui/toast'
import type { LoginRequest } from '@/types/auth'
import classes from '../../../components/auth/auth-card.module.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, clearError } = useAuthActions()
  const error = useAuthError()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  })
  const [showToast, setShowToast] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    
    // Clear error when user types
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData)
      
      // Navigate to the intended destination or home
      const from = (location.state as any)?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (err) {
      // Error is handled by the store
      setIsLoading(false)
    }
  }

  const handleTestLogin = async () => {
    const testCredentials = {
      email: 'demo@example.com',
      password: 'demo123456'
    }
    
    setFormData(testCredentials)
    setIsLoading(true)

    try {
      await login(testCredentials)
      
      const from = (location.state as any)?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (err) {
      setIsLoading(false)
    }
  }

  return (
    <>
      {showToast && (
        <Toast
          message="🚀 Try the demo! Click 'Use Test Account' below to explore with sample data. Email: demo@example.com"
          type="info"
          duration={0}
          onClose={() => setShowToast(false)}
        />
      )}
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your invoice management account"
    >
      <form onSubmit={handleSubmit} className={classes.form}>
        {error && (
          <div className={classes.error} role="alert">
            {error}
          </div>
        )}

        <div className={classes.field}>
          <label htmlFor="email" className={classes.label}>
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={classes.input}
            placeholder="Enter your email"
            autoComplete="email"
            required
            disabled={isLoading}
          />
        </div>

        <div className={classes.field}>
          <label htmlFor="password" className={classes.label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={classes.input}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            disabled={isLoading}
          />
        </div>

        <div className={classes.actions}>
          <Button
            type="submit"
            variant="default"
            overrideStyles={{ width: '100%' }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            overrideStyles={{ width: '100%', marginTop: '8px' }}
            disabled={isLoading}
            onClick={handleTestLogin}
          >
            Use Test Account
          </Button>
        </div>
      </form>

      <div className={classes.footer}>
        <p className={classes.footerText}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/auth/signup')}
            className={classes.link}
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
        <button
          type="button"
          onClick={() => navigate('/auth/forgot-password')}
          className={classes.link}
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>
    </AuthCard>
    </>
  )
}