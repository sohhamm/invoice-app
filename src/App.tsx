import InvoiceDetails from './pages/invoice-details'
import Invoices from './pages/invoices'
import {Route, Routes} from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Invoices />} />
      <Route path="/invoice/:id" element={<InvoiceDetails />} />
    </Routes>
  )
}
