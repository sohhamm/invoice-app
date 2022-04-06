import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import './index.css'
import App from './App'
import {BrowserRouter} from 'react-router-dom'
import {NextUIProvider} from '@nextui-org/react'
import Layout from './components/layout/Layout'

function Root() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <NextUIProvider>
          <Layout>
            <App />
          </Layout>
        </NextUIProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}
const root = ReactDOMClient.createRoot(document.getElementById('root')!)

root.render(<Root />)
