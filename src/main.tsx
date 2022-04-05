import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import './index.css'
import App from './App'

function Root() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
const root = ReactDOMClient.createRoot(document.getElementById('root')!)
root.render(<Root />)
