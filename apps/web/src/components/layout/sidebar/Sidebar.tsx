import * as React from 'react'
import logo from '@/assets/logo.svg'
import sun from '@/assets/icon-sun.svg'
import moon from '@/assets/icon-moon.svg'
import avatar from '@/assets/image-avatar.jpg'
import classes from './sidebar.module.css'
import { useUserPreferences } from '@/stores/user-preferences'

export default function Sidebar() {
  const { theme, toggleTheme } = useUserPreferences()

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

        <div>
          <img src={avatar} alt='Avatar' className={classes.avatar} />
        </div>
      </div>
    </div>
  )
}
