import * as React from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import '@fontsource/spartan'
import App from './App'
import Layout from '@/components/layout/Layout'
import {BrowserRouter} from 'react-router-dom'
import {NextUIProvider} from '@nextui-org/react'
import {theme} from '@/styles/nextui-theme'

function Root() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <NextUIProvider theme={theme}>
          <Layout>
            <App />
          </Layout>
        </NextUIProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(<Root />)
