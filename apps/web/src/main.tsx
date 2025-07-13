import './index.css'
import '@fontsource/spartan/400.css'
import '@fontsource/spartan/500.css'
import '@fontsource/spartan/700.css'
import * as React from 'react'
import App from './App'
import Layout from '@/components/layout/Layout'
import AuthProvider from '@/components/auth/AuthProvider'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, useLocation} from 'react-router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { useUserPreferences } from '@/stores/user-preferences'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'always',
    },
    mutations: {
      networkMode: 'always',
    },
  },
})

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const { theme } = useUserPreferences()
  
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  
  return <>{children}</>
}

function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isAuthRoute = location.pathname.startsWith('/auth')
  
  if (isAuthRoute) {
    return <>{children}</>
  }
  
  return <Layout>{children}</Layout>
}

function Root() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ThemeInitializer>
              <ConditionalLayout>
                <App />
              </ConditionalLayout>
            </ThemeInitializer>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(<Root />)
