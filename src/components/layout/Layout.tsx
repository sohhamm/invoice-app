import type {LayoutProps} from '@/types/prop-types'
import {Container} from '@nextui-org/react'
import Sidebar from './sidebar/Sidebar'

export default function Layout({children}: LayoutProps) {
  return (
    <>
      <Sidebar />
      <Container>{children}</Container>
    </>
  )
}
