import * as React from 'react'
import Sidebar from './sidebar/Sidebar'
import classes from './layout.module.css'

interface LayoutProps {
  children: JSX.Element
}

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/lib/index.prod.js').then(d => ({
    default: d.ReactQueryDevtools,
  })),
)

export default function Layout({children}: LayoutProps) {
  const [showDevtools, setShowDevtools] = React.useState(false)

  React.useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools(old => !old)
  }, [])

  return (
    <div className={classes.container}>
      <Sidebar />
      <div className={classes.box}>{children}</div>

      {showDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction position='bottom-right' />
        </React.Suspense>
      )}
    </div>
  )
}
