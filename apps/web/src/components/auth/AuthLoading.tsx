import React from 'react'
import classes from './auth-loading.module.css'

interface AuthLoadingProps {
  text?: string
}

export function AuthLoading({ text = 'Loading...' }: AuthLoadingProps) {
  return (
    <div className={classes.authLoading}>
      <div>
        <div className={classes.spinner} role="status" aria-label="Loading" />
        {text && <p className={classes.loadingText}>{text}</p>}
      </div>
    </div>
  )
}

export default AuthLoading