import * as React from 'react'
import styles from './sidebar.module.css'
import logo from '@/assets/logo.svg'

export default function Sidebar() {
  return (
    <div className={styles.box}>
      <div className={styles.topBox}>
        <div className={styles.topBoxBottom} />
        <img src={logo} alt='invoice logo' className={styles.logo} />
      </div>
      Sidebar
    </div>
  )
}
