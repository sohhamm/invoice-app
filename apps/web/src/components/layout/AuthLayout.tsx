import React from 'react'
import classes from './auth-layout.module.css'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={classes.container}>
      {/* Background decorative elements */}
      <div className={classes.backgroundDecoration}>
        <div className={classes.circle1}></div>
        <div className={classes.circle2}></div>
        <div className={classes.circle3}></div>
        <div className={classes.wave}></div>
      </div>
      
      {/* Main content */}
      <div className={classes.content}>
        {children}
      </div>
    </div>
  )
}