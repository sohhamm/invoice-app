import Invoices from '@/pages/invoices'
import InvoiceDetails from '@/pages/invoice-details'
import Login from '@/pages/auth/login'
import Signup from '@/pages/auth/signup'
import ForgotPassword from '@/pages/auth/forgot-password'
import { ProtectedRoute, PublicRoute } from '@/components/auth'
import {Route, Routes} from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path='/auth/login' element={<PublicRoute><Login /></PublicRoute>} />
      <Route path='/auth/signup' element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path='/auth/forgot-password' element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      
      {/* Protected routes */}
      <Route path='/' element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
      <Route path='/invoice/:id' element={<ProtectedRoute><InvoiceDetails /></ProtectedRoute>} />
    </Routes>
  )
}
