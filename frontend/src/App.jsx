import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import ScrollToTop from './components/ScrollToTop'

const getBasename = () => {
  if (typeof window !== 'undefined' && window.location.pathname.includes('/atas-resort/backend/public')) {
    return '/atas-resort/backend/public'
  }
  return ''
}

function App() {
  return (
    <BrowserRouter basename={getBasename()}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App