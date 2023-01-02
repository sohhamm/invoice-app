import Sidebar from './sidebar/Sidebar'
import classes from './layout.module.css'

interface LayoutProps {
  children: JSX.Element
}

export default function Layout({children}: LayoutProps) {
  return (
    <>
      <Sidebar />
      <div className={classes.box}>{children}</div>
    </>
  )
}
