import React from 'react'
import AuthLayout from '@/components/layout/AuthLayout'
import logo from '@/assets/logo.svg'
import classes from './auth-card.module.css'

interface AuthCardProps {
  title: string
  subtitle: string
  children: React.ReactNode
  showLogo?: boolean
  logoIcon?: React.ReactNode
}

export default function AuthCard({ 
  title, 
  subtitle, 
  children, 
  showLogo = true,
  logoIcon 
}: AuthCardProps) {
  return (
    <AuthLayout>
      <div className={classes.card}>
        <div className={classes.header}>
          {showLogo && (
            <div className={classes.logo}>
              <div className={classes.logoIcon}>
                {logoIcon || <img src={logo} alt="Invoice App Logo" />}
              </div>
              <h1 className={classes.title}>{title}</h1>
            </div>
          )}
          <p className={classes.subtitle}>{subtitle}</p>
        </div>

        <div className={classes.content}>
          {children}
        </div>
      </div>
    </AuthLayout>
  )
}