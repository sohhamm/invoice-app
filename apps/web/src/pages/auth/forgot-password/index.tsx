import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/button/Button'
import { AuthCard } from '@/components/auth'
import { apiAxios } from '@/configs/axios'
import classes from '../../../components/auth/auth-card.module.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      // Note: This endpoint might not exist yet, but shows the intended functionality
      await apiAxios.post('/auth/forgot-password', { email })
      setMessage('Password reset instructions have been sent to your email address.')
      setIsSubmitted(true)
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Password reset functionality is not yet implemented.')
      } else {
        setError(err.response?.data?.message || 'Failed to send reset email. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    setIsSubmitted(false)
    setMessage('')
    setError('')
  }

  if (isSubmitted) {
    return (
      <AuthCard
        title="Check Your Email"
        subtitle={`We've sent password reset instructions to ${email}`}
        logoIcon={<span style={{ fontSize: '2rem' }}>✅</span>}
      >
        <div className={classes.success}>
          {message}
        </div>

        <div className={classes.actions}>
          <Button
            variant="default"
            overrideStyles={{ width: '100%' }}
            onClick={handleResend}
          >
            Send Another Email
          </Button>
        </div>

        <div className={classes.footer}>
          <p className={classes.footerText}>
            Remember your password?{' '}
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

  return (
    <AuthCard
      title="Forgot Password?"
      subtitle="Enter your email address and we'll send you instructions to reset your password"
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError('')
            }}
            className={classes.input}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className={classes.actions}>
          <Button
            type="submit"
            variant="default"
            overrideStyles={{ width: '100%' }}
          >
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
        </div>
      </form>

      <div className={classes.footer}>
        <p className={classes.footerText}>
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            className={classes.link}
          >
            Sign in
          </button>
        </p>
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
      </div>
    </AuthCard>
  )
}