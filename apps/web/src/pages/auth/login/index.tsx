import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '@/components/ui/button/Button'
import { AuthCard } from '@/components/auth'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '../../../../../packages/shared-types/src'
import classes from '../../../components/auth/auth-card.module.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: LoginRequest) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login(formData)
      
      // Redirect to previous page or home
      const redirectTo = (location.state as any)?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      // Error is handled by the store
      console.error('Login failed:', err)
    }
  }

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your invoice management account"
    >
      <form onSubmit={handleSubmit} className={classes.form}>
        {error && (
          <div className={classes.error}>
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
            required
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
            required
          />
        </div>

        <div className={classes.actions}>
          <Button
            type="submit"
            variant="default"
            overrideStyles={{ width: '100%' }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
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
          >
            Sign up
          </button>
        </p>
        <button
          type="button"
          onClick={() => navigate('/auth/forgot-password')}
          className={classes.link}
        >
          Forgot password?
        </button>
      </div>
    </AuthCard>
  )
}