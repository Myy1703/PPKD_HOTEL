import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('hotel_user', JSON.stringify(data.user))
        navigate('/')
      } else {
        setError(data.error || 'Login gagal. Cek username/password.')
      }
    } catch (err) {
      setError('Gagal menghubungi server. Pastikan backend menyala di port 5000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-[fadeIn_0.4s_ease]">
        {/* Logo / Header Area */}
        <div className="text-center mb-8">
           <div className="w-24 h-24 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center border border-primary-100 shadow-sm">
             <img src="/logo_ppkd.jpg" alt="PPKD Logo" className="w-16 h-16 object-contain" />
           </div>
           <h1 className="text-3xl font-bold text-gray-800 tracking-tight">PPKD Hotel</h1>
           <p className="text-gray-500 mt-2 font-medium">Sistem Management Resepsionis</p>
        </div>

        {/* Login Card */}
        <div className="card p-8 shadow-xl border-t-4 border-t-primary-600">
           <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3 3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
           </h2>

           {error && (
             <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3 animate-[shake_0.4s_ease]">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
             </div>
           )}

           <form onSubmit={handleLogin} className="space-y-5">
              <div>
                 <label className="input-label" htmlFor="username">Username</label>
                 <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                       </svg>
                    </span>
                    <input 
                       id="username"
                       type="text" 
                       className="input-field pl-10" 
                       placeholder="Masukkan username"
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}
                       required
                    />
                 </div>
              </div>

              <div>
                 <label className="input-label" htmlFor="password">Password</label>
                 <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2a3 3 0 01-3 3H6a3 3 0 01-3-3v-6a3 3 0 013-3h10a3 3 0 013 3v4M12 11V7a3 3 0 116 0v4m-3-6V3m-3 3V3" />
                       </svg>
                    </span>
                    <input 
                       id="password"
                       type="password" 
                       className="input-field pl-10" 
                       placeholder="********"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                    />
                 </div>
              </div>

              <button 
                 type="submit" 
                 className={`btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-4 text-lg transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed scale-[0.98]' : 'hover:scale-[1.01]'}`}
                 disabled={loading}
              >
                 {loading ? (
                   <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                   </>
                 ) : 'Sign In'}
              </button>
           </form>

           <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Default Admin Credentials</p>
              <div className="flex justify-center gap-4 text-sm text-gray-500 font-medium">
                 <span>User: <strong className="text-primary-600">admin</strong></span>
                 <span>Pass: <strong className="text-primary-600">admin123</strong></span>
              </div>
           </div>
        </div>
        
        <p className="text-center text-gray-400 text-xs mt-8">© 2026 PPKD Hotel — Manajemen Resepsionis Terpadu</p>
      </div>
    </div>
  )
}
