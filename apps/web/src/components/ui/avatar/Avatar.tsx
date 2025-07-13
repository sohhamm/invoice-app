import React from 'react'
import classes from './avatar.module.css'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
}

export default function Avatar({ name, size = 'md', onClick, className }: AvatarProps) {
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ')
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  const getColorFromName = (name: string): string => {
    // Generate consistent color based on name
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const colors = [
      '#7c5dfa', // Primary purple
      '#33d69f', // Success green  
      '#ff8f00', // Warning orange
      '#ec5757', // Error red
      '#888eb0', // Muted blue
      '#9277ff', // Light purple
    ]
    
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div
      className={`${classes.avatar} ${classes[size]} ${className || ''}`}
      onClick={onClick}
      style={{ backgroundColor: getColorFromName(name) }}
    >
      <span className={classes.initials}>
        {getInitials(name)}
      </span>
    </div>
  )
}