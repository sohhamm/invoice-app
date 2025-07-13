import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/button/Button'
import { AuthCard } from '@/components/auth'
import { useAuthStore } from '@/stores/auth'
import type { SignupRequest } from '../../../../../packages/shared-types/src'
import classes from '../../../components/auth/auth-card.module.css'

export default function Signup() {
  const navigate = useNavigate()
  const { signup, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState<SignupRequest>({
    name: '',
    email: '',
    password: ''
  })
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'confirmPassword') {
      setConfirmPassword(e.target.value)
    } else {
      setFormData((prev: SignupRequest) => ({
        ...prev,
        [e.target.name]: e.target.value
      }))
    }
    if (error) clearError()
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

    // Validate passwords match
    if (formData.password !== confirmPassword) {
      // Use a temporary error for validation
      return
    }

    // Validate password strength
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      // Use a temporary error for validation
      return
    }

    try {
      await signup(formData)
      navigate('/')
    } catch (err) {
      // Error is handled by the store
      console.error('Signup failed:', err)
    }
  }

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join us to manage your invoices efficiently"
    >
      <form onSubmit={handleSubmit} className={classes.form}>
        {error && (
          <div className={classes.error}>
            {error}
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
            required
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
            placeholder="Create a strong password"
            required
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
            value={confirmPassword}
            onChange={handleChange}
            className={classes.input}
            placeholder="Confirm your password"
            required
          />
        </div>

        <div className={classes.actions}>
          <Button
            type="submit"
            variant="default"
            overrideStyles={{ width: '100%' }}
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
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthCard>
  )
}