import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header({ onMenuToggle }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('hotel_user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('hotel_user')
    navigate('/login')
  }

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <header className="bg-white border-b border-surface-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-surface-100 text-gray-500 transition-colors"
          id="menu-toggle"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">PPKD Hotel</h2>
          <p className="text-xs text-gray-400">Formulir Pendaftaran & Konfirmasi</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Check-out time reminder */}
        <div className="hidden sm:flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium">Check-out: 12.00 Siang</span>
        </div>

        {/* Date & Time */}
        <div className="text-right border-r border-gray-200 pr-4 mr-2 hidden md:block">
          <p className="text-xs font-semibold text-gray-700">{formatTime(currentTime)}</p>
          <p className="text-[0.65rem] text-gray-400">{formatDate(currentTime)}</p>
        </div>

        {/* User & Logout */}
        <div className="flex items-center gap-3 pl-2">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-gray-800">{user.username || 'Staff'}</p>
            <p className="text-[10px] text-primary-600 uppercase font-bold tracking-tighter">{user.role || 'User'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors tooltip flex items-center gap-2"
            title="Keluar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-xs font-bold hidden lg:block">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  )
}
