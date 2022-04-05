import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import './index.css'
import App from './App'
import {BrowserRouter} from 'react-router-dom'

function Root() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
}
const root = ReactDOMClient.createRoot(document.getElementById('root')!)
root.render(<Root />)
