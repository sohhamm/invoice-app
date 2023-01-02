import './index.css'
import '@fontsource/spartan/400.css'
import '@fontsource/spartan/500.css'
import '@fontsource/spartan/700.css'
import * as React from 'react'
import App from './App'
import Layout from '@/components/layout/Layout'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'

function Root() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Layout>
          <App />
        </Layout>
      </BrowserRouter>
    </React.StrictMode>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(<Root />)
