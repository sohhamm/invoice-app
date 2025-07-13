import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '@/components/ui/button/Button'
import { AuthCard } from '@/components/auth'
import { useAuthActions, useAuthError } from '@/stores/auth'
import type { SignupRequest } from '@/types/auth'
import classes from '../../../components/auth/auth-card.module.css'

interface SignupFormData extends SignupRequest {
  confirmPassword: string
}

export default function Signup() {
  const navigate = useNavigate()
  const { signup, clearError } = useAuthActions()
  const error = useAuthError()
  const [isLoading, setIsLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    
    // Clear errors when user types
    if (error) clearError()
    if (validationError) setValidationError(null)
  }

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }

    // Validate password strength
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setValidationError(passwordError)
      return
    }

    setIsLoading(true)

    try {
      // Extract only the fields needed for signup
      const { name, email, password } = formData
      await signup({ name, email, password })
      
      // Navigate to home after successful signup
      navigate('/')
    } catch (err) {
      // Error is handled by the store
      setIsLoading(false)
    }
  }

  const displayError = validationError || error

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join us to manage your invoices efficiently"
    >
      <form onSubmit={handleSubmit} className={classes.form}>
        {displayError && (
          <div className={classes.error} role="alert">
            {displayError}
          </div>
        )}

        <div className={classes.field}>
          <label htmlFor="name" className={classes.label}>
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={classes.input}
            placeholder="Enter your full name"
            autoComplete="name"
            required
            disabled={isLoading}
          />
        </div>

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
            placeholder="Create a strong password"
            autoComplete="new-password"
            required
            disabled={isLoading}
          />
          <div className={classes.passwordHint}>
            Password must be at least 8 characters with uppercase, lowercase, and number
          </div>
        </div>

        <div className={classes.field}>
          <label htmlFor="confirmPassword" className={classes.label}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={classes.input}
            placeholder="Confirm your password"
            autoComplete="new-password"
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </form>

      <div className={classes.footer}>
        <p className={classes.footerText}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            className={classes.link}
            disabled={isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthCard>
  )
}