import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const menuItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: '/registration',
    label: 'Registrasi Tamu',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    path: '/confirmation',
    label: 'Konfirmasi Reservasi',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
]

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-gradient-to-b from-primary-800 to-primary-900 text-white transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'}`}
      >
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center font-bold text-primary-900 text-sm flex-shrink-0 shadow-lg">
            PH
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:opacity-0 lg:w-0'}`}>
            <h1 className="text-base font-bold whitespace-nowrap">PPKD Hotel</h1>
            <p className="text-[0.65rem] text-primary-300 whitespace-nowrap">Sistem Resepsionis</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onToggle()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-primary-200 hover:bg-white/8 hover:text-white'
                }
                ${!isOpen ? 'lg:justify-center' : ''}`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden lg:opacity-0 lg:w-0'}`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center gap-3 ${!isOpen ? 'lg:justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
              R
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:opacity-0 lg:w-0'}`}>
              <p className="text-xs font-medium whitespace-nowrap">Receptionist</p>
              <p className="text-[0.65rem] text-primary-300 whitespace-nowrap">Front Desk</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
