import * as React from 'react'
import { useNavigate } from 'react-router'
import logo from '@/assets/logo.svg'
import sun from '@/assets/icon-sun.svg'
import moon from '@/assets/icon-moon.svg'
import { Avatar } from '@/components/ui/avatar'
import classes from './sidebar.module.css'
import { useUserPreferences } from '@/stores/user-preferences'
import { useAuthActions, useCurrentUser } from '@/stores/auth'

export default function Sidebar() {
  const { theme, toggleTheme } = useUserPreferences()
  const { logout } = useAuthActions()
  const user = useCurrentUser()
  const navigate = useNavigate()
  const [showLogoutMenu, setShowLogoutMenu] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <div className={classes.box}>
      <div className={classes.topBox}>
        <div className={classes.topBoxBottom} />
        <img src={logo} alt='invoice logo' className={classes.logo} />
      </div>

      <div className={classes.bottomBox}>
        <div className={classes.toggle}>
          {theme === 'dark' ? (
            <img
              src={sun}
              alt='sun icon'
              className={classes.toggleIcon}
              onClick={toggleTheme}
            />
          ) : (
            <img
              src={moon}
              alt='moon icon'
              className={classes.toggleIcon}
              onClick={toggleTheme}
            />
          )}
        </div>

        <div className={classes.avatarContainer}>
          {user ? (
            <Avatar
              name={user.name}
              size="md"
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
              className={classes.avatar}
            />
          ) : (
            <div className={classes.avatarPlaceholder} />
          )}
          {showLogoutMenu && user && (
            <div className={classes.logoutMenu}>
              <div className={classes.userInfo}>
                <div className={classes.userName}>{user.name}</div>
                <div className={classes.userEmail}>{user.email}</div>
              </div>
              <button onClick={handleLogout} className={classes.logoutBtn}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
