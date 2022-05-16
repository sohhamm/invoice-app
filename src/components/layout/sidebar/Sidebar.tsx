import * as React from 'react'
import styles from './sidebar.module.css'
import logo from '@/assets/logo.svg'
import {Container, Image} from '@nextui-org/react'

export default function Sidebar() {
  return (
    <Container className={styles.box}>
      <Container className={styles.topBox}>
        <Container className={styles.topBoxBottom} />
        <Image
          src={logo}
          alt="invoice logo"
          className={styles.logo}
          width={'40px'}
          height={'45px'}
        />
      </Container>
      Sidebar
    </Container>
  )
}
