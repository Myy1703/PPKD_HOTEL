import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [successMsg, setSuccessMsg] = useState(location.state?.successMsg || '')

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg('')
        // Clear state from history to prevent reappearing on reload
        navigate(location.pathname, { replace: true, state: {} })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMsg, navigate, location.pathname])

  const fetchGuests = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/guests')
      const result = await res.json()
      if (res.ok) {
        setGuests(result.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch guests', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGuests()
  }, [])

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data tamu ${nama}?`)) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/guests/${id}`, { method: 'DELETE' })
        if (res.ok) {
          fetchGuests() // Refresh data
        } else {
          alert('Gagal menghapus data')
        }
      } catch (err) {
        alert('Terjadi kesalahan server saat menghapus data')
      }
    }
  }

  const handleEdit = (guest) => {
    // Navigasi ke form registrasi dengan membawa data guest
    navigate('/registration', { state: { editData: guest } })
  }

  const handlePrint = (guest) => {
    // Navigasi ke form registrasi langsung ke tampilan preview cetak
    navigate('/registration', { state: { printData: guest } })
  }

  const stats = {
    totalGuests: guests.length,
    availableRooms: 50 - guests.length, // asumsi 50 kamar total
    checkInsToday: guests.filter(g => {
      const today = new Date().toISOString().split('T')[0]
      return g.tanggalKedatangan === today
    }).length,
    checkOutsToday: guests.filter(g => {
      const today = new Date().toISOString().split('T')[0]
      return g.tanggalKeberangkatan === today
    }).length,
  }

  const statCards = [
    {
      title: 'Total Tamu',
      value: loading ? '...' : stats.totalGuests,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      border: 'border-blue-100',
    },
    {
      title: 'Kamar Tersedia',
      value: loading ? '...' : stats.availableRooms,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      border: 'border-emerald-100',
    },
    {
      title: 'Check-in Hari Ini',
      value: loading ? '...' : stats.checkInsToday,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      ),
      bg: 'bg-violet-50',
      iconColor: 'text-violet-500',
      border: 'border-violet-100',
    },
    {
      title: 'Check-out Hari Ini',
      value: loading ? '...' : stats.checkOutsToday,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      bg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      border: 'border-amber-100',
    },
  ]

  const formatTime = (isoString) => {
    if (!isoString) return '-'
    const date = new Date(isoString)
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg relative flex items-center justify-between gap-3 shadow-sm animate-[fadeIn_0.3s_ease]">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium text-sm">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="p-1 hover:bg-emerald-100 rounded text-emerald-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Selamat datang di Sistem Resepsionis PPKD Hotel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`card p-5 border ${stat.border} hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.iconColor}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions + Recent Guests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="section-title">Aksi Cepat</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/registration')}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors text-sm font-medium"
              id="quick-registration"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Registrasi Tamu Baru
            </button>
            <button
              onClick={() => navigate('/confirmation')}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-sm font-medium"
              id="quick-confirmation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Konfirmasi Reservasi
            </button>
          </div>
        </div>

        {/* Recent Guests */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="section-title">Aktivitas Tamu Terbaru (Database)</h3>
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-sm text-gray-500 py-4 text-center">Memuat data dari database...</p>
            ) : guests.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">Belum ada data tamu. Silakan lakukan registrasi.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-surface-200">
                    <th className="pb-3 pr-4">Nama</th>
                    <th className="pb-3 pr-4">Kamar</th>
                    <th className="pb-3 pr-4">Tipe</th>
                    <th className="pb-3 pr-4">Waktu Daftar</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {guests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-surface-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold uppercase">
                            {(guest.nama || '?').charAt(0)}
                          </div>
                          <span className="font-medium text-gray-700">{guest.nama || 'Tanpa Nama'}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{guest.roomNo1 || '-'}</td>
                      <td className="py-3 pr-4 text-gray-600 capitalize">{guest.jenisKamar || '-'}</td>
                      <td className="py-3 pr-4 text-gray-500">{formatTime(guest.created_at)}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handlePrint(guest)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Cetak Data"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleEdit(guest)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Data"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(guest.id, guest.nama)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Hapus Data"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

