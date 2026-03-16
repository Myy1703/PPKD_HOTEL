import { useState } from 'react'

const initialFormData = {
  roomNo1: '',
  roomNo2: '',
  jumlahTamu: '',
  jumlahKamar: '',
  jenisKamar: '',
  receptionist: '',
  nama: '',
  pekerjaan: '',
  perusahaan: '',
  kebangsaan: '',
  noKtp: '',
  tanggalLahir: '',
  alamat: '',
  telepon: '',
  email: '',
  waktuKedatangan: '',
  tanggalKedatangan: '',
  tanggalKeberangkatan: '',
  noMember: '',
  safetyDepositBox: '',
  dikeluarkanOleh: '',
  tanggal: '',
  metodePembayaran: '',
  cardNumber: '',
  cardHolderName: '',
  cardType: '',
  expiredDate: '',
  bankTransferTo: '',
  mandiriAccount: '',
  mandiriNameAccount: '',
}

import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function RegistrationForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const editData = location.state?.editData
  const printData = location.state?.printData

  const [formData, setFormData] = useState(initialFormData)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSuccessScreen, setIsSuccessScreen] = useState(false)

  // Pre-fill form jika membawa data dari Dashboard (Edit atau Print)
  useEffect(() => {
    if (editData) {
      setIsEditMode(true)
      const cleanData = { ...editData }
      delete cleanData.id
      delete cleanData.created_at
      
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === null) cleanData[key] = ''
      })
      
      setFormData(prev => ({ ...prev, ...cleanData }))
    } else if (printData) {
      const cleanData = { ...printData }
      delete cleanData.id
      delete cleanData.created_at
      
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === null) cleanData[key] = ''
      })
      
      setFormData(prev => ({ ...prev, ...cleanData }))
      setIsSuccessScreen(true)
      
      // Clear location state to prevent stuck on print screen if refreshed
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [editData, printData, navigate, location.pathname])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    
    try {
      const endpoint = isEditMode 
        ? `/api/guests/${editData.id}` 
        : '/api/guests'
        
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Terjadi kesalahan pada server');
      }
      
      // Jika berhasil 
      console.log(isEditMode ? "Data Diperbarui:" : "Tersimpan di Database:", result.data)
      setSubmitted(true)
      setIsSuccessScreen(true)
      
    } catch (err) {
      console.error("Gagal menyimpan ke database:", err)
      setErrorMsg(err.message)
      alert("Gagal menyimpan ke database: " + err.message + "\n\nPastikan backend server sudah menyala.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin mereset semua isian form?")) {
      setFormData(initialFormData)
      setSubmitted(false)
      setErrorMsg('')
    }
  }

  // Calculate Price Preview
  const roomRates = {
    standard: 500000,
    deluxe: 850000,
    suite: 1500000,
    family: 1200000
  }

  const calculateTotal = () => {
    if (!formData.jenisKamar || !formData.tanggalKedatangan || !formData.tanggalKeberangkatan) return 0;
    
    const start = new Date(formData.tanggalKedatangan);
    const end = new Date(formData.tanggalKeberangkatan);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const nights = diffDays > 0 ? diffDays : 1; // Minimum 1 night
    const rate = roomRates[formData.jenisKamar] || 0;
    const qty = parseInt(formData.jumlahKamar) || 1;
    
    return rate * nights * qty;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isSuccessScreen) {
    return (
      <div className="space-y-6">
        {/* Success Banner - Hidden on print */}
        <div className="print-hidden bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-gray-600 mb-6">Data tamu <strong>{formData.nama}</strong> telah berhasil disimpan ke dalam database.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => navigate('/', { state: { successMsg: isEditMode ? "Data tamu berhasil diperbarui!" : "Data tamu baru berhasil dideklarasikan dan disimpan ke database!" } })} className="btn-secondary">
              Kembali ke Dashboard
            </button>
            <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Cetak Profil Tamu
            </button>
          </div>
        </div>

        {/* Printable Card */}
        <div className="print-area max-w-3xl mx-auto bg-white p-8 sm:p-10 text-black font-serif text-[13px] leading-tight">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-2">
              <img src="/logo_ppkd.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-lg font-bold uppercase tracking-widest text-black">PPKD HOTEL</h2>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-[14px]">Reservation Confirmation</p>
            <div className="border-b border-black w-full mt-1 mb-3"></div>
          </div>

          {/* Block 1 */}
          <div className="grid grid-cols-2 gap-0 mb-4">
            <div className="col-span-2 flex mb-4">
              <span className="w-48 inline-block">To.</span>
              <span>: {formData.nama || ''}</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex"><span className="w-48 inline-block">Company / Agent</span><span>: {formData.perusahaan || ''}</span></div>
              <div className="flex"><span className="w-48 inline-block">Booking No.</span><span>: </span></div>
              <div className="flex"><span className="w-48 inline-block">Book By</span><span>: {formData.receptionist || ''}</span></div>
              <div className="flex"><span className="w-48 inline-block">Phone</span><span>: {formData.telepon || ''}</span></div>
              <div className="flex"><span className="w-48 inline-block">Email</span><span>: {formData.email || ''}</span></div>
            </div>
            <div className="flex flex-col gap-1 pl-12">
              <div className="flex"><span className="w-24 inline-block">Telp</span><span>: </span></div>
              <div className="flex"><span className="w-24 inline-block">Fax</span><span>: </span></div>
              <div className="flex"><span className="w-24 inline-block">Email</span><span>: {formData.email || ''}</span></div>
              <div className="flex"><span className="w-24 inline-block">Date</span><span>: {formData.tanggalKedatangan ? formatDate(formData.tanggalKedatangan) : ''}</span></div>
            </div>
          </div>

          <div className="border-b border-black w-full mb-3"></div>

          {/* Block 2 */}
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex"><span className="w-48 inline-block">First Name</span><span>: {formData.nama || ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Arrival Date</span><span>: {formData.tanggalKedatangan ? formatDate(formData.tanggalKedatangan) : ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Departure Date</span><span>: {formData.tanggalKeberangkatan ? formatDate(formData.tanggalKeberangkatan) : ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Total Night</span><span>: {formData.tanggalKedatangan && formData.tanggalKeberangkatan ? Math.max(1, Math.ceil(Math.abs(new Date(formData.tanggalKeberangkatan) - new Date(formData.tanggalKedatangan)) / (1000 * 60 * 60 * 24))) : ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Room/Unit Type</span><span className="capitalize">: {formData.jenisKamar || ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Person Pax</span><span>: {formData.jumlahTamu || ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Room Rate Net</span><span>: Rp {calculateTotal().toLocaleString('id-ID')}</span></div>
          </div>

          {/* Text Paragraph */}
          <div className="mb-4 pr-12 text-justify">
            <p>Please guarantee this booking with credit card number with clear copy of the card both sides and card holder signature in the column provided the copy of credit card both sides should be faxed to hotel fax number.</p>
            <p className="mt-1">Please settle your outstanding to or account:</p>
          </div>

          {/* Block 3 - Bank Transfer */}
          <div className="flex flex-col gap-1 mb-3">
            <div className="font-semibold mb-1 text-[13px]">Bank Transfer</div>
            <div className="flex"><span className="w-48 inline-block">Mandiri Account</span><span>: {formData.mandiriAccount || ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Mandiri Name Account</span><span>: {formData.mandiriNameAccount || ''}</span></div>
          </div>

          <div className="border-b border-black w-full mb-3"></div>

          {/* Block 4 - Credit Card */}
          <div className="flex flex-col gap-1 mb-3">
            <div className="font-semibold mb-1 text-[13px]">Reservation guaranteed by the following credit card:</div>
            <div className="flex"><span className="w-56 inline-block">Card Number</span><span>: {formData.cardNumber || ''}</span></div>
            <div className="flex"><span className="w-56 inline-block">Card holder name</span><span>: {formData.cardHolderName || ''}</span></div>
            <div className="flex"><span className="w-56 inline-block">Card Type</span><span className="capitalize">: {formData.cardType || ''}</span></div>
            <div className="flex"><span className="w-56 inline-block">Or by Bank Transfer to</span><span>: {formData.bankTransferTo || ''}</span></div>
            <div className="flex"><span className="w-56 inline-block">Expired date/month/year</span><span>: {formData.expiredDate || ''}</span></div>
            <div className="flex"><span className="w-56 inline-block">Card holder signature</span><span>: </span></div>
          </div>

          <div className="border-b border-black w-full mb-2"></div>

          {/* Block 5 - Cancellation Policy */}
          <div className="text-xs mb-8 pr-8">
            <div className="underline mb-1">Cancellation policy:</div>
            <ol className="list-decimal pl-4 space-y-0.5">
              <li>Please note that check in time is 02.00 pm and check out time 12.00 pm.</li>
              <li>All non guaranteed reservations will automatically be released on 6 pm.</li>
              <li>The Hotel will charge 1 night for guaranteed reservations that have not been canceling before the day of arrival. Please carefully note your cancellation number.</li>
            </ol>
          </div>

          {/* Signature Line */}
          <div className="flex justify-end mt-12 pr-12">
            <div className="w-48 border-b border-black"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto print-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Formulir Pendaftaran</h1>
          <p className="text-sm text-gray-500 mt-1">Registration Form — Harap tulis dengan huruf cetak</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Check Out Time: 12.00 Siang / Noon</span>
        </div>
      </div>

      {/* Success Notification */}
      {submitted && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 animate-[fadeIn_0.3s_ease]">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Data tamu berhasil disimpan!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Informasi Kamar */}
        <div className="card p-6">
          <h3 className="section-title flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Informasi Kamar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="input-label" htmlFor="roomNo1">Room No. 1</label>
              <input id="roomNo1" name="roomNo1" type="text" className="input-field" placeholder="Contoh: 0601" value={formData.roomNo1} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="roomNo2">Room No. 2</label>
              <input id="roomNo2" name="roomNo2" type="text" className="input-field" placeholder="Contoh: 0602" value={formData.roomNo2} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="jumlahTamu">Jumlah Tamu / No. of Person</label>
              <input id="jumlahTamu" name="jumlahTamu" type="number" min="1" className="input-field" placeholder="Jumlah orang" value={formData.jumlahTamu} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="jumlahKamar">Jumlah Kamar / No. of Room</label>
              <input id="jumlahKamar" name="jumlahKamar" type="number" min="1" className="input-field" placeholder="Jumlah kamar" value={formData.jumlahKamar} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="jenisKamar">Jenis Kamar / Room Type</label>
              <select id="jenisKamar" name="jenisKamar" className="input-field" value={formData.jenisKamar} onChange={handleChange}>
                <option value="">Pilih jenis kamar</option>
                <option value="standard">Standard (Rp 500.000/Malam)</option>
                <option value="deluxe">Deluxe (Rp 850.000/Malam)</option>
                <option value="family">Family Room (Rp 1.200.000/Malam)</option>
                <option value="suite">Suite (Rp 1.500.000/Malam)</option>
              </select>
            </div>
            <div>
              <label className="input-label" htmlFor="receptionist">Receptionist</label>
              <input id="receptionist" name="receptionist" type="text" className="input-field" placeholder="Nama resepsionis" value={formData.receptionist} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Section: Data Tamu */}
        <div className="card p-6">
          <h3 className="section-title flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Data Tamu / Guest Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="input-label" htmlFor="nama">Nama / Name</label>
              <input id="nama" name="nama" type="text" className="input-field" placeholder="Nama lengkap tamu (huruf cetak)" value={formData.nama} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="pekerjaan">Pekerjaan / Profession</label>
              <input id="pekerjaan" name="pekerjaan" type="text" className="input-field" placeholder="Pekerjaan tamu" value={formData.pekerjaan} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="perusahaan">Perusahaan / Company</label>
              <input id="perusahaan" name="perusahaan" type="text" className="input-field" placeholder="Nama perusahaan" value={formData.perusahaan} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="kebangsaan">Kebangsaan / Nationality</label>
              <input id="kebangsaan" name="kebangsaan" type="text" className="input-field" placeholder="Contoh: Indonesia" value={formData.kebangsaan} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="noKtp">No. KTP / Passport No.</label>
              <input id="noKtp" name="noKtp" type="text" className="input-field" placeholder="Nomor identitas" value={formData.noKtp} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="tanggalLahir">Tanggal Lahir / Birth Date</label>
              <input id="tanggalLahir" name="tanggalLahir" type="date" className="input-field" value={formData.tanggalLahir} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Section: Kontak & Alamat */}
        <div className="card p-6">
          <h3 className="section-title flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Kontak & Alamat
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="input-label" htmlFor="alamat">Alamat / Address</label>
              <textarea id="alamat" name="alamat" rows="3" className="input-field resize-none" placeholder="Alamat lengkap tamu" value={formData.alamat} onChange={handleChange}></textarea>
            </div>
            <div>
              <label className="input-label" htmlFor="telepon">Telepon / Phone / HP</label>
              <input id="telepon" name="telepon" type="tel" className="input-field" placeholder="+62 xxx-xxxx-xxxx" value={formData.telepon} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="input-field" placeholder="email@contoh.com" value={formData.email} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Section: Jadwal Menginap */}
        <div className="card p-6 border-l-4 border-l-primary-500">
          <h3 className="section-title flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Jadwal Menginap & Estimasi Harga
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="input-label" htmlFor="waktuKedatangan">Waktu Kedatangan / Arrival Time</label>
              <input id="waktuKedatangan" name="waktuKedatangan" type="time" className="input-field" value={formData.waktuKedatangan} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="tanggalKedatangan">Tanggal Kedatangan / Arrival Date</label>
              <input id="tanggalKedatangan" name="tanggalKedatangan" type="date" className="input-field" value={formData.tanggalKedatangan} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="tanggalKeberangkatan">Tgl Keberangkatan / Departure Date</label>
              <input id="tanggalKeberangkatan" name="tanggalKeberangkatan" type="date" className="input-field" value={formData.tanggalKeberangkatan} onChange={handleChange} />
            </div>
          </div>
          
          {/* Price Preview Banner */}
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Preview Detail Harga</span>
              <span className="text-sm text-gray-600 mt-1">
                Tipe: <strong className="capitalize">{formData.jenisKamar || '-'}</strong> • 
                Kamar: <strong>{formData.jumlahKamar || '1'}</strong> • 
                 <span> {formData.tanggalKedatangan && formData.tanggalKeberangkatan ? 
                  `${Math.max(1, Math.ceil(Math.abs(new Date(formData.tanggalKeberangkatan) - new Date(formData.tanggalKedatangan)) / (1000 * 60 * 60 * 24)))} Malam` 
                  : '0 Malam'} 
                </span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block mb-1">Estimasi Total Biaya</span>
              <span className="text-2xl font-bold text-primary-700">
                Rp {calculateTotal().toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Section: Informasi Tambahan */}
        <div className="card p-6">
          <h3 className="section-title flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Informasi Tambahan & Pembayaran
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="input-label" htmlFor="metodePembayaran">Metode Pembayaran</label>
              <select id="metodePembayaran" name="metodePembayaran" className="input-field" value={formData.metodePembayaran} onChange={handleChange} required>
                <option value="">-- Pilih Metode --</option>
                <option value="cash">Uang Tunai (Cash)</option>
                <option value="debit">Kartu Debit / Kredit</option>
              </select>
            </div>
            
            {/* Conditional Payment Details */}
            {formData.metodePembayaran === 'debit' && (
              <>
                <div>
                  <label className="input-label" htmlFor="cardType">Jenis Kartu / Card Type</label>
                  <select id="cardType" name="cardType" className="input-field" value={formData.cardType} onChange={handleChange}>
                    <option value="">Pilih</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="jcb">JCB</option>
                    <option value="amex">American Express</option>
                  </select>
                </div>
                <div>
                  <label className="input-label" htmlFor="cardNumber">Nomor Kartu / Card No.</label>
                  <input id="cardNumber" name="cardNumber" type="text" className="input-field" placeholder="xxxx-xxxx-xxxx-xxxx" value={formData.cardNumber} onChange={handleChange} />
                </div>
                <div>
                  <label className="input-label" htmlFor="cardHolderName">Nama di Kartu</label>
                  <input id="cardHolderName" name="cardHolderName" type="text" className="input-field" placeholder="Sesuai kartu" value={formData.cardHolderName} onChange={handleChange} />
                </div>
                <div>
                  <label className="input-label" htmlFor="expiredDate">Masa Berlaku (MM/YY)</label>
                  <input id="expiredDate" name="expiredDate" type="text" className="input-field" placeholder="Contoh: 12/28" value={formData.expiredDate} onChange={handleChange} />
                </div>
              </>
            )}

            {formData.metodePembayaran === 'cash' && (
              <>
                <div>
                  <label className="input-label" htmlFor="bankTransferTo">Transfer Ke (Bank)</label>
                  <input id="bankTransferTo" name="bankTransferTo" type="text" className="input-field" placeholder="Nama Bank" value={formData.bankTransferTo} onChange={handleChange} />
                </div>
                <div>
                  <label className="input-label" htmlFor="mandiriAccount">Nomor Rekening</label>
                  <input id="mandiriAccount" name="mandiriAccount" type="text" className="input-field" placeholder="No Rek" value={formData.mandiriAccount} onChange={handleChange} />
                </div>
                <div>
                  <label className="input-label" htmlFor="mandiriNameAccount">Nama Rekening</label>
                  <input id="mandiriNameAccount" name="mandiriNameAccount" type="text" className="input-field" placeholder="Nama Pemilik" value={formData.mandiriNameAccount} onChange={handleChange} />
                </div>
              </>
            )}

            <div>
              <label className="input-label" htmlFor="safetyDepositBox">Nomor Kotak Deposit</label>
              <input id="safetyDepositBox" name="safetyDepositBox" type="text" className="input-field" placeholder="Nomor kotak deposit" value={formData.safetyDepositBox} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="noMember">No. Member</label>
              <input id="noMember" name="noMember" type="text" className="input-field" placeholder="Nomor member (jika ada)" value={formData.noMember} onChange={handleChange} />
            </div>
            <div>
              <label className="input-label" htmlFor="dikeluarkanOleh">Dikeluarkan Oleh / Issued</label>
              <input id="dikeluarkanOleh" name="dikeluarkanOleh" type="text" className="input-field" placeholder="Nama petugas" value={formData.dikeluarkanOleh} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button type="button" onClick={handleReset} className="btn-secondary w-full sm:w-auto" id="btn-reset">
            Reset Form
          </button>
          <button type="submit" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2" id="btn-submit" disabled={loading}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {loading ? 'Menyimpan...' : (isEditMode ? 'Perbarui Data Tamu' : 'Simpan Data Tamu')}
          </button>
        </div>
      </form>
    </div>
  )
}
