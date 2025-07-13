import React, { useEffect, useState } from 'react'
import classes from './toast.module.css'

interface ToastProps {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  onClose?: () => void
  visible?: boolean
}

export default function Toast({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  visible = true 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(visible)

  useEffect(() => {
    setIsVisible(visible)
  }, [visible])

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  return (
    <div className={`${classes.toast} ${classes[type]}`}>
      <div className={classes.content}>
        <span className={classes.message}>{message}</span>
        <button 
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
          className={classes.closeButton}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}