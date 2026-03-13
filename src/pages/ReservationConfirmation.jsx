import { useState } from 'react'

const initialFormData = {
  // Penerima
  to: '',
  companyAgent: '',
  bookingNo: '',
  bookBy: '',
  phone: '',
  email: '',
  telp: '',
  fax: '',
  emailContact: '',
  date: '',
  // Detail Reservasi
  firstName: '',
  arrivalDate: '',
  departureDate: '',
  totalNight: '',
  roomType: '',
  personPax: '',
  roomRateNet: '',
  // Pembayaran Bank Transfer
  mandiriAccount: '',
  mandiriNameAccount: '',
  // Kartu Kredit
  cardNumber: '',
  cardHolderName: '',
  cardType: '',
  bankTransferTo: '',
  expiredDate: '',
}

export default function ReservationConfirmation() {
  const [formData, setFormData] = useState(initialFormData)
  const [showPreview, setShowPreview] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-calculate total nights
    if (name === 'arrivalDate' || name === 'departureDate') {
      const arrival = name === 'arrivalDate' ? value : formData.arrivalDate
      const departure = name === 'departureDate' ? value : formData.departureDate
      if (arrival && departure) {
        const diff = Math.ceil(
          (new Date(departure) - new Date(arrival)) / (1000 * 60 * 60 * 24)
        )
        if (diff > 0) {
          setFormData((prev) => ({ ...prev, [name]: value, totalNight: diff.toString() }))
        }
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Auto populate the calculated room rate net to the form data
    const total = calculateTotal()
    setFormData(prev => ({ ...prev, roomRateNet: `Rp ${total.toLocaleString('id-ID')}` }))
    setShowPreview(true)
  }

  // Calculate Price Preview
  const roomRates = {
    standard: 500000,
    deluxe: 850000,
    suite: 1500000,
    family: 1200000
  }

  const calculateTotal = () => {
    if (!formData.roomType || !formData.arrivalDate || !formData.departureDate) return 0;
    
    // Total nights is already calculated in handle change and stored in formData.totalNight
    const nights = parseInt(formData.totalNight) || 1; 
    const rate = roomRates[formData.roomType] || 0;
    
    return rate * nights;
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Konfirmasi Reservasi</h1>
        <p className="text-sm text-gray-500 mt-1">Reservation Confirmation — PPKD Hotel</p>
      </div>

      {/* Toggle View */}
      <div className="flex border border-surface-200 rounded-lg overflow-hidden w-fit">
        <button
          onClick={() => setShowPreview(false)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${!showPreview ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-surface-50'}`}
          id="btn-form-view"
        >
          Form Input
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${showPreview ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-surface-50'}`}
          id="btn-preview-view"
        >
          Preview Dokumen
        </button>
      </div>

      {!showPreview ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Informasi Penerima */}
          <div className="card p-6">
            <h3 className="section-title flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informasi Penerima
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="input-label" htmlFor="to">Kepada / To</label>
                <input id="to" name="to" type="text" className="input-field" placeholder="Nama penerima" value={formData.to} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="companyAgent">Company / Agent</label>
                <input id="companyAgent" name="companyAgent" type="text" className="input-field" placeholder="Nama perusahaan / agen" value={formData.companyAgent} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="bookingNo">Booking No.</label>
                <input id="bookingNo" name="bookingNo" type="text" className="input-field" placeholder="Nomor booking" value={formData.bookingNo} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="bookBy">Book By</label>
                <input id="bookBy" name="bookBy" type="text" className="input-field" placeholder="Dipesan oleh" value={formData.bookBy} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" className="input-field" placeholder="+62 xxx-xxxx-xxxx" value={formData.phone} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" className="input-field" placeholder="email@contoh.com" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="telp">Telp</label>
                <input id="telp" name="telp" type="tel" className="input-field" placeholder="Nomor telepon" value={formData.telp} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="fax">Fax</label>
                <input id="fax" name="fax" type="text" className="input-field" placeholder="Nomor fax" value={formData.fax} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="date">Date</label>
                <input id="date" name="date" type="date" className="input-field" value={formData.date} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Section: Detail Reservasi */}
          <div className="card p-6">
            <h3 className="section-title flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Detail Reservasi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="input-label" htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" type="text" className="input-field" placeholder="Nama depan tamu" value={formData.firstName} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="arrivalDate">Arrival Date</label>
                <input id="arrivalDate" name="arrivalDate" type="date" className="input-field" value={formData.arrivalDate} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="departureDate">Departure Date</label>
                <input id="departureDate" name="departureDate" type="date" className="input-field" value={formData.departureDate} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="totalNight">Total Night</label>
                <input id="totalNight" name="totalNight" type="number" className="input-field bg-surface-50" placeholder="Otomatis" value={formData.totalNight} onChange={handleChange} readOnly />
              </div>
              <div>
                <label className="input-label" htmlFor="roomType">Room / Unit Type</label>
                <select id="roomType" name="roomType" className="input-field" value={formData.roomType} onChange={handleChange}>
                  <option value="">Pilih tipe kamar</option>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                  <option value="family">Family Room</option>
                </select>
              </div>
              <div>
                <label className="input-label" htmlFor="personPax">Person Pax</label>
                <input id="personPax" name="personPax" type="number" min="1" className="input-field" placeholder="Jumlah orang" value={formData.personPax} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="roomRateNet">Room Rate Net</label>
                <input id="roomRateNet" name="roomRateNet" type="text" className="input-field bg-surface-50" placeholder="Terisi otomatis" value={`Rp ${calculateTotal().toLocaleString('id-ID')}`} readOnly />
              </div>
            </div>
            {/* Price Preview Banner */}
            <div className="mt-6 bg-primary-50 rounded-xl p-4 border border-primary-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Preview Harga Kamar</span>
                <span className="text-sm text-gray-600 mt-1">
                  Tipe: <strong className="capitalize">{formData.roomType || '-'}</strong> • 
                  Durasi: <strong>{formData.totalNight || '0'} Malam</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block mb-1">Total Biaya</span>
                <span className="text-2xl font-bold text-primary-700">
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Pembayaran - Bank Transfer */}
          <div className="card p-6">
            <h3 className="section-title flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Pembayaran — Bank Transfer
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label" htmlFor="mandiriAccount">Mandiri Account</label>
                <input id="mandiriAccount" name="mandiriAccount" type="text" className="input-field" placeholder="Nomor rekening Mandiri" value={formData.mandiriAccount} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="mandiriNameAccount">Mandiri Name Account</label>
                <input id="mandiriNameAccount" name="mandiriNameAccount" type="text" className="input-field" placeholder="Atas nama rekening" value={formData.mandiriNameAccount} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Section: Pembayaran - Kartu Kredit */}
          <div className="card p-6">
            <h3 className="section-title flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Pembayaran — Kartu Kredit
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="input-label" htmlFor="cardNumber">Card Number</label>
                <input id="cardNumber" name="cardNumber" type="text" className="input-field" placeholder="Nomor kartu kredit" value={formData.cardNumber} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="cardHolderName">Card Holder Name</label>
                <input id="cardHolderName" name="cardHolderName" type="text" className="input-field" placeholder="Nama pemegang kartu" value={formData.cardHolderName} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="cardType">Card Type</label>
                <select id="cardType" name="cardType" className="input-field" value={formData.cardType} onChange={handleChange}>
                  <option value="">Pilih tipe kartu</option>
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                  <option value="jcb">JCB</option>
                </select>
              </div>
              <div>
                <label className="input-label" htmlFor="bankTransferTo">Or by Bank Transfer to</label>
                <input id="bankTransferTo" name="bankTransferTo" type="text" className="input-field" placeholder="Transfer ke rekening" value={formData.bankTransferTo} onChange={handleChange} />
              </div>
              <div>
                <label className="input-label" htmlFor="expiredDate">Expired Date (MM/YY)</label>
                <input id="expiredDate" name="expiredDate" type="text" className="input-field" placeholder="MM/YY" value={formData.expiredDate} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="card p-6 bg-slate-50 border-slate-200">
            <h3 className="section-title flex items-center gap-2 text-slate-600 border-slate-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cancellation Policy
            </h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex gap-2">
                <span className="text-slate-400 font-semibold flex-shrink-0">1.</span>
                <p>Please note that check in time is 02.00 pm and check out time 12.00 pm.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 font-semibold flex-shrink-0">2.</span>
                <p>All non guaranteed reservations will automatically be released on 6 pm.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 font-semibold flex-shrink-0">3.</span>
                <p>The Hotel will charge 1 night for guaranteed reservations that have not been canceling before the day of arrival. Please carefully note your cancellation number.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => setFormData(initialFormData)} className="btn-secondary w-full sm:w-auto" id="btn-reset-confirm">
              Reset Form
            </button>
            <button type="submit" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2" id="btn-preview">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Lihat Preview
            </button>
          </div>
        </form>
      ) : (
        /* Preview Document */
        <div className="space-y-6">
          <div className="print-area max-w-3xl mx-auto bg-white p-8 sm:p-10 text-black font-serif text-[13px] leading-tight">
          {/* Header */}
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
              <span>: {formData.to || ''}</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex"><span className="w-48 inline-block">Company / Agent</span><span>: {formData.companyAgent || ''}</span></div>
              <div className="flex"><span className="w-48 inline-block">Booking No.</span><span>: {formData.bookingNo || ''}</span></div>
              <div className="flex"><span className="w-48 inline-block">Book By</span><span>: {formData.bookBy || ''}</span></div>
              <div className="flex"><span className="w-48 inline-block">Phone</span><span>: {formData.phone || ''}</span></div>
              <div className="flex"><span className="w-48 inline-block">Email</span><span>: {formData.email || ''}</span></div>
            </div>
            <div className="flex flex-col gap-1 pl-12">
              <div className="flex"><span className="w-24 inline-block">Telp</span><span>: {formData.telp || ''}</span></div>
              <div className="flex"><span className="w-24 inline-block">Fax</span><span>: {formData.fax || ''}</span></div>
              <div className="flex"><span className="w-24 inline-block">Email</span><span>: {formData.emailContact || ''}</span></div>
              <div className="flex"><span className="w-24 inline-block">Date</span><span>: {formData.date ? formatDate(formData.date) : ''}</span></div>
            </div>
          </div>

          <div className="border-b border-black w-full mb-3"></div>

          {/* Block 2 */}
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex"><span className="w-48 inline-block">First Name</span><span>: {formData.firstName || ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Arrival Date</span><span>: {formData.arrivalDate ? formatDate(formData.arrivalDate) : ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Departure Date</span><span>: {formData.departureDate ? formatDate(formData.departureDate) : ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Total Night</span><span>: {formData.totalNight || ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Room/Unit Type</span><span className="capitalize">: {formData.roomType || ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Person Pax</span><span>: {formData.personPax || ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Room Rate Net</span><span>: {formData.roomRateNet || `Rp ${calculateTotal().toLocaleString('id-ID')}`}</span></div>
          </div>

          {/* Text Paragraph */}
          <div className="mb-4 pr-12 text-justify">
            <p>Please guarantee this booking with credit card number with clear copy of the card both sides and card holder signature in the column provided the copy of credit card both sides should be faxed to hotel fax number.</p>
            <p className="mt-1">Please settle your outstanding to or account:</p>
          </div>

          {/* Block 3 - Bank Transfer */}
          <div className="flex flex-col gap-1 mb-3">
            <div className="font-semibold mb-1">Bank Transfer</div>
            <div className="flex"><span className="w-48 inline-block">Mandiri Account</span><span>: {formData.mandiriAccount || ''}</span></div>
            <div className="flex"><span className="w-48 inline-block">Mandiri Name Account</span><span>: {formData.mandiriNameAccount || ''}</span></div>
          </div>

          <div className="border-b border-black w-full mb-3"></div>

          {/* Block 4 - Credit Card */}
          <div className="flex flex-col gap-1 mb-3">
            <div className="font-semibold mb-1">Reservation guaranteed by the following credit card:</div>
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

          {/* Print / Back Buttons */}
          <div className="flex items-center justify-center gap-3 pb-4 pt-4 print-hidden">
            <button
              onClick={() => setShowPreview(false)}
              className="btn-secondary flex items-center gap-2"
              id="btn-back-form"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Form
            </button>
            <button
              onClick={() => window.print()}
              className="btn-primary flex items-center gap-2"
              id="btn-print"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak Dokumen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
