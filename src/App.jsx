import { useState } from 'react'
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import RegistrationForm from './pages/RegistrationForm'
import ReservationConfirmation from './pages/ReservationConfirmation'
import Login from './pages/Login'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('hotel_user')
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-surface-50">
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-surface-50">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content Area */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          <Header onMenuToggle={toggleSidebar} />

          <main className="p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/registration" element={<RegistrationForm />} />
              <Route path="/confirmation" element={<ReservationConfirmation />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="px-6 py-4 text-center text-xs text-gray-400 border-t border-surface-200">
            © 2026 PPKD Hotel — Sistem Resepsionis v1.0
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default App
