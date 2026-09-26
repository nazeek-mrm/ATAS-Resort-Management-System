import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ClassicalModal from '../components/ClassicalModal'
import { validateEmail, getEmailSuggestion } from '../utils/validation'
import api from '../api'
import {
  IconSun,
  IconSunset,
  IconMoon,
  IconClock,
  IconUsers,
  IconBank,
  IconUpload,
  IconCheck,
  IconParty,
  IconSparkle,
  IconAlert,
  IconArrowLeft,
  IconArrowRight
} from '../components/Icons'

const DEFAULT_PACKAGES = [
  { id: 1,  type: 'Day',       time: '7.00 AM  -  5.00 PM',  persons: 20,  price: 4000 },
  { id: 2,  type: 'Day-Night', time: '7.00 AM  -  10.00 PM', persons: 20,  price: 6000 },
  { id: 3,  type: 'Night',     time: '8.00 PM  -  6.00 AM',  persons: 20,  price: 8000 },
  { id: 4,  type: 'Day',       time: '7.00 AM  -  5.00 PM',  persons: 40,  price: 7000 },
  { id: 5,  type: 'Day-Night', time: '7.00 AM  -  10.00 PM', persons: 40,  price: 9000 },
  { id: 6,  type: 'Night',     time: '8.00 PM  -  6.00 AM',  persons: 40,  price: 11000 },
  { id: 7,  type: 'Day',       time: '7.00 AM  -  5.00 PM',  persons: 80,  price: 10000 },
  { id: 8,  type: 'Day-Night', time: '7.00 AM  -  10.00 PM', persons: 80,  price: 12000 },
  { id: 9,  type: 'Night',     time: '8.00 PM  -  6.00 AM',  persons: 80,  price: 14000 },
  { id: 10, type: 'Day',       time: '7.00 AM  -  5.00 PM',  persons: 100, price: 13000 },
  { id: 11, type: 'Day-Night', time: '7.00 AM  -  10.00 PM', persons: 100, price: 15000 },
  { id: 12, type: 'Night',     time: '8.00 PM  -  6.00 AM',  persons: 100, price: 17000 },
  { id: 13, type: 'Day',       time: '7.00 AM  -  5.00 PM',  persons: 150, price: 16000 },
  { id: 14, type: 'Day-Night', time: '7.00 AM  -  10.00 PM', persons: 150, price: 18000 },
  { id: 15, type: 'Night',     time: '8.00 PM  -  6.00 AM',  persons: 150, price: 20000 },
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Calendar({ bookedDates, selectedDate, onSelect }) {
  const [year, setYear] = useState(() => (selectedDate ? new Date(selectedDate + 'T00:00:00').getFullYear() : new Date().getFullYear()))
  const [month, setMonth] = useState(() => (selectedDate ? new Date(selectedDate + 'T00:00:00').getMonth() : new Date().getMonth()))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const getStatus = (d) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return bookedDates[key] || 'available'
  }

  const isPast = (d) => new Date(year, month, d) < today

  const handleClick = (d) => {
    const status = getStatus(d)
    if (status === 'confirmed' || isPast(d)) return
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    onSelect(key, status)
  }

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  const canGoPrev = year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth())

  return (
    <div className="bg-[#f4f5f7] rounded-3xl p-5 sm:p-7 md:p-8">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-10 h-10 rounded-xl border border-teal-200/80 bg-white flex items-center justify-center text-[#009688] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
          title="Previous Month"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h3 className="text-lg md:text-xl font-bold text-[#005461] tracking-wide">
          {MONTHS[month]} {year}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          className="w-10 h-10 rounded-xl border border-teal-200/80 bg-white flex items-center justify-center text-[#009688] hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          title="Next Month"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 mb-4 text-center text-xs sm:text-sm font-semibold text-slate-500">
        {DAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1
          const status = getStatus(d)
          const past = isPast(d)
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const isSelected = selectedDate === dateKey
          const isBooked = status === 'confirmed'
          const isPending = status === 'pending'
          const dotColor = isBooked ? 'bg-[#ef4444]' : isPending ? 'bg-[#f59e0b]' : 'bg-[#10b981]'

          if (past) {
            return (
              <div
                key={d}
                className="aspect-square rounded-xl sm:rounded-2xl bg-[#eaedf0] text-[#cbd5e1] font-medium flex items-center justify-center text-xs sm:text-sm md:text-base cursor-not-allowed select-none"
              >
                {d}
              </div>
            )
          }

          return (
            <button
              key={d}
              type="button"
              disabled={isBooked}
              onClick={() => handleClick(d)}
              className={`aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative select-none transition-all text-xs sm:text-sm md:text-base ${
                isSelected
                  ? 'bg-white border-2 border-[#009688] text-slate-900 font-bold shadow-sm ring-2 ring-[#009688]/20'
                  : isBooked
                  ? 'bg-white text-slate-300 cursor-not-allowed'
                  : 'bg-white text-slate-700 font-semibold shadow-2xs hover:shadow-md hover:border-teal-200 border border-transparent cursor-pointer active:scale-95'
              }`}
              title={
                isBooked
                  ? 'Booked'
                  : isPending
                  ? 'Reserved'
                  : 'Available'
              }
            >
              <span className="leading-none">{d}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor} absolute bottom-2 sm:bottom-3`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepBar({ step }) {
  const steps = ['Choose Date', 'Pick Package', 'Your Details', 'Pay Advance']
  return (
    <div className="flex items-center justify-center gap-3 md:gap-6 py-8">
      {steps.map((s, i) => {
        const n = i + 1
        const active = n === step
        const done = n < step
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                  active
                    ? 'text-white scale-110 ring-4 ring-[#00B7B5]/20'
                    : done
                    ? 'text-white'
                    : 'bg-[#e0eaed] text-[#6b7c82]'
                }`}
                style={
                  active
                    ? { background: 'linear-gradient(135deg, #00B7B5, #018790)' }
                    : done
                    ? { background: '#018790' }
                    : {}
                }
              >
                {done ? <IconCheck className="w-4 h-4" /> : n}
              </div>
              <span
                className={`text-xs mt-1.5 hidden sm:block ${
                  active ? 'text-[#018790] font-bold' : done ? 'text-[#018790] font-medium' : 'text-gray-400'
                }`}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 md:w-16 h-0.5 rounded transition-all ${
                  n < step ? 'bg-[#018790]' : 'bg-[#e0eaed]'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

const parseErrorDetails = (err) => {
  if (!err) return null
  if (typeof err === 'object') {
    return {
      title: err.title || 'Notice Required',
      message: err.message || '',
      buttonText: err.buttonText || 'Fix it!',
      targetId: err.targetId || null
    }
  }

  const str = String(err).trim()
  const lower = str.toLowerCase()

  if (lower.includes('full name') || lower.includes('name')) {
    return {
      title: 'Name Required',
      message: 'Please enter your full name to continue.',
      buttonText: 'Fix it!',
      targetId: 'customer-name'
    }
  }
  if (lower.includes('available date') || lower.includes('calendar') || lower.includes('date')) {
    return {
      title: 'Date Required',
      message: 'Please select an available date from the calendar first to continue.',
      buttonText: 'Fix it!',
      targetId: 'calendar-section'
    }
  }
  if (lower.includes('package')) {
    return {
      title: 'Package Required',
      message: 'Please select a package before proceeding to the next step.',
      buttonText: 'Fix it!',
      targetId: 'packages-section'
    }
  }
  if (lower.includes('mobile') || lower.includes('digits') || lower.includes('phone')) {
    return {
      title: 'Mobile Required',
      message: 'Sri Lanka mobile numbers must be 10 digits starting with 0 (e.g. 0771234567).',
      buttonText: 'Fix it!',
      targetId: 'customer-mobile'
    }
  }
  if (lower.includes('email') || lower.includes('gmail') || lower.includes('yahoo') || lower.includes('domain') || lower.includes('@')) {
    return {
      title: 'Invalid Email',
      message: str,
      buttonText: 'Fix it!',
      targetId: 'customer-email'
    }
  }
  if (lower.includes('receipt') || lower.includes('5mb')) {
    return {
      title: 'File Too Large',
      message: 'The uploaded receipt file must be smaller than 5MB.',
      buttonText: 'Fix it!',
      targetId: 'receiptInput'
    }
  }
  if (lower.includes('payment proof') || lower.includes('reference')) {
    return {
      title: 'Payment Proof Required',
      message: 'Please upload your payment receipt OR enter the bank reference number to continue.',
      buttonText: 'Fix it!',
      targetId: 'receiptInput'
    }
  }

  return {
    title: 'Attention Required',
    message: str,
    buttonText: 'Fix it!',
    targetId: null
  }
}

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [packages, setPackages] = useState(DEFAULT_PACKAGES)
  const [bookedDates, setBookedDates] = useState({})
  const [selectedDate, setSelectedDate] = useState('')
  const [pendingDateNotice, setPendingDateNotice] = useState(false)
  const [selectedPkg, setSelectedPkg] = useState(null)
  const [form, setForm] = useState({ name: '', mobile: '', email: '' })
  const [receipt, setReceipt] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [refNum, setRefNum] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successRef, setSuccessRef] = useState(null)
  const [error, setError] = useState('')
  const modalProps = parseErrorDetails(error)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    api.get('/packages')
      .then((r) => { if (Array.isArray(r.data) && r.data.length > 0) setPackages(r.data) })
      .catch(() => {})

    api.get('/booked-dates')
      .then((r) => setBookedDates(r.data || {}))
      .catch(() => {})
  }, [])

  // Background session timers: 6 mins for steps 1-3, 12 mins for step 4
  // If user holds on any step past the session time, page automatically refreshes and restarts session
  useEffect(() => {
    if (successRef) return

    const durationMinutes = step === 4 ? 12 : 6
    const durationMs = durationMinutes * 60 * 1000
    const expiresAt = Date.now() + durationMs

    const timeoutId = setTimeout(() => {
      window.location.reload()
    }, durationMs)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && Date.now() >= expiresAt) {
        window.location.reload()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [step, successRef])

  const handleDateSelect = (date, status) => {
    if (status === 'pending') {
      setPendingDateNotice(true)
    } else {
      setPendingDateNotice(false)
    }
    setSelectedDate(date)
    setError('')
  }

  const handleReceiptChange = (file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Receipt file must be smaller than 5MB.')
      return
    }
    setReceipt(file)
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl('')
    }
    setError('')
  }

  const goTo = (n) => {
    if (n === 2 && !selectedDate) {
      setError('Please select an available date from the calendar first!')
      return
    }
    if (n === 3 && !selectedPkg) {
      setError('Please select a package before proceeding!')
      return
    }
    if (n === 4) {
      if (!form.name.trim()) {
        setError('Please enter your full name!')
        return
      }
      let mobile = form.mobile.replace(/[\s\-\(\)\+]/g, '')
      if (mobile.startsWith('94') && mobile.length === 11) {
        mobile = '0' + mobile.slice(2)
      }
      if (!/^0[0-9]{9}$/.test(mobile)) {
        setError('Invalid mobile number! Sri Lanka mobile numbers must be 10 digits starting with 0 (e.g. 0771234567).')
        return
      }
      const emailCheck = validateEmail(form.email)
      if (!emailCheck.isValid) {
        setError({
          title: emailCheck.title,
          message: emailCheck.message,
          buttonText: 'Fix it!',
          targetId: 'customer-email'
        })
        return
      }
    }
    setError('')
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!receipt && !refNum.trim()) {
      setError('Payment proof required! Please upload your payment receipt OR enter the bank reference number.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('customer_name', form.name)
      fd.append('mobile_number', form.mobile)
      fd.append('email', form.email)
      fd.append('booking_date', selectedDate)
      fd.append('package_id', selectedPkg.id)
      fd.append('package_name', `${selectedPkg.type} - Up to ${selectedPkg.persons} Persons`)
      fd.append('package_price', selectedPkg.price)
      if (receipt) fd.append('receipt_image', receipt)
      if (refNum.trim()) fd.append('reference_number', refNum.trim())

      const r = await api.post('/bookings', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setSuccessRef(r.data.reference_code)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const advance = selectedPkg ? Math.round(selectedPkg.price * 0.3) : 0
  const fmtDate = (d) =>
    d
      ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : ' - '

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col justify-between">
      <Navbar />

      <div className="pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-black text-[#005461] font-serif">
            Reserve Your Private Resort
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Complete the steps below to secure your exclusive booking
          </p>
        </div>

        {/* Steps Tracker */}
        {!successRef && <StepBar step={step} />}

        {/* Modern & Classical Modal Popup for Errors */}
        <ClassicalModal
          isOpen={!!error}
          title={modalProps?.title}
          message={modalProps?.message}
          buttonText={modalProps?.buttonText}
          targetId={modalProps?.targetId}
          onClose={() => setError('')}
        />

        {/* SUCCESS VIEW */}
        {successRef ? (
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#e0eaed] text-center fade-in max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-teal-50 text-[#00B7B5]">
              <IconParty className="w-10 h-10" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#005461] font-serif mb-3">
              Booking Submitted!
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
              Your booking request has been received. Our admin will verify your payment and confirm your booking via email.
            </p>

            <div className="inline-block bg-teal-50/80 border border-teal-200 px-6 py-3 rounded-2xl mb-4 font-mono font-bold text-lg md:text-xl text-[#005461]">
              Reference: <span className="text-[#018790]">{successRef}</span>
            </div>

            <p className="text-gray-400 text-xs mb-8">
              Please save this reference code for your tracking and communication.
            </p>

            <div className="flex justify-center gap-4">
              <Link to="/" className="btn-primary text-sm px-8 py-3.5 inline-flex items-center gap-2">
                <IconArrowLeft className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* STEP 1: CHOOSE DATE */}
            {step === 1 && (
              <div className="fade-in">
                <div id="calendar-section" className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-[#e0eaed] mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#005461] font-serif mb-1">
                    Choose Your Date
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Select an available date for your resort stay.
                  </p>

                  {/* Availability Legend */}
                  <div className="flex flex-wrap items-center gap-6 mb-7 text-sm font-semibold text-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#10b981] inline-block" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#f59e0b] inline-block" />
                      <span>Reserved</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444] inline-block" />
                      <span>Booked</span>
                    </div>
                  </div>

                  {/* Interactive Calendar */}
                  <Calendar
                    bookedDates={bookedDates}
                    selectedDate={selectedDate}
                    onSelect={handleDateSelect}
                  />

                  {/* Notice for pending date */}
                  {pendingDateNotice && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3.5 rounded-2xl flex items-center gap-2.5">
                      <IconAlert className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>This date currently has a pending reservation waiting for payment confirmation. You may still select it, but confirmed bookings have priority.</span>
                    </div>
                  )}

                  {/* Choose Package Action Button */}
                  <div className="flex justify-end mt-8">
                    <button
                      type="button"
                      onClick={() => goTo(2)}
                      disabled={!selectedDate}
                      className="bg-[#009688] hover:bg-[#008276] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-2xl shadow-sm hover:shadow-md flex items-center gap-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                    >
                      <span>Choose Package</span>
                      <span className="text-lg leading-none">→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PICK PACKAGE */}
            {step === 2 && (
              <div className="fade-in">
                <div id="packages-section" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#e0eaed] mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-[#005461] font-serif mb-1">
                        Pick Your Package
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Selected Date: <strong className="text-[#018790]">{fmtDate(selectedDate)}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Package Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {packages.map((pkg) => {
                      const isSelected = selectedPkg?.id === pkg.id
                      const adv = Math.round(pkg.price * 0.3)
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPkg(pkg)}
                          className={`package-card flex flex-col justify-between ${
                            isSelected ? 'selected' : ''
                          }`}
                        >
                          <div>
                            {/* Type badge */}
                            <div className="flex items-center justify-between mb-3">
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${
                                  pkg.type === 'Day'
                                    ? 'bg-amber-100 text-amber-800'
                                    : pkg.type === 'Day-Night'
                                    ? 'bg-cyan-100 text-cyan-800'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}
                              >
                                {pkg.type === 'Day' ? (
                                  <>
                                    <IconSun className="w-3.5 h-3.5" />
                                    <span>Day</span>
                                  </>
                                ) : pkg.type === 'Day-Night' ? (
                                  <>
                                    <IconSunset className="w-3.5 h-3.5" />
                                    <span>Day-Night</span>
                                  </>
                                ) : (
                                  <>
                                    <IconMoon className="w-3.5 h-3.5" />
                                    <span>Night</span>
                                  </>
                                )}
                              </span>
                              {isSelected && (
                                <span className="w-5 h-5 rounded-full bg-[#018790] text-white flex items-center justify-center text-xs font-bold">
                                  <IconCheck className="w-3 h-3" />
                                </span>
                              )}
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-medium">
                              <IconClock className="w-3.5 h-3.5 text-gray-400" />
                              <span>{pkg.time}</span>
                            </div>

                            {/* Persons */}
                            <div className="flex items-center gap-2 text-sm font-semibold text-[#005461] mb-4">
                              <IconUsers className="w-4 h-4 text-[#005461]" />
                              <span>Up to {pkg.persons} Persons</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100">
                            <div className="flex items-baseline justify-between mb-1">
                              <span className="text-xl font-black text-[#005461]">
                                Rs.{Number(pkg.price).toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-400">/ package</span>
                            </div>
                            <div className="text-xs font-semibold text-[#018790]">
                              Advance (30%): Rs.{adv.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Selected Package Banner */}
                  {selectedPkg && (
                    <div className="mt-6 p-4 rounded-xl flex flex-wrap items-center justify-between gap-2" style={{ background: 'rgba(0, 183, 181, 0.08)', border: '1px solid rgba(0, 183, 181, 0.25)' }}>
                      <div>
                        <span className="text-xs text-gray-500 font-medium block">Selected Package:</span>
                        <strong className="text-sm md:text-base text-[#005461] font-bold">
                          {selectedPkg.type}  -  Up to {selectedPkg.persons} Persons (Rs.{Number(selectedPkg.price).toLocaleString()})
                        </strong>
                      </div>
                      <span className="text-sm font-bold text-[#018790]">
                        Advance: Rs.{advance.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => goTo(1)}
                    className="px-6 py-3 rounded-xl border border-gray-300 font-semibold text-gray-600 hover:bg-gray-100 transition-colors text-sm inline-flex items-center gap-1.5"
                  >
                    <IconArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => goTo(3)}
                    disabled={!selectedPkg}
                    className="btn-primary text-sm px-8 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-md inline-flex items-center gap-2"
                  >
                    <span>Your Details</span>
                    <IconArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: YOUR DETAILS */}
            {step === 3 && (
              <div className="fade-in">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#e0eaed] mb-6">
                  <h2 className="text-2xl font-bold text-[#005461] font-serif mb-1">
                    Your Details
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    We need your contact information for booking confirmations and updates.
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-2">
                          Full Name *
                        </label>
                        <input
                          id="customer-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#018790] transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-2">
                          Mobile Number *
                        </label>
                        <input
                          id="customer-mobile"
                          type="tel"
                          value={form.mobile}
                          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#018790] transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider">
                          Email Address *
                        </label>
                        {getEmailSuggestion(form.email) && (
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, email: getEmailSuggestion(form.email) })}
                            className="text-xs text-[#009688] hover:text-[#00796b] font-medium cursor-pointer flex items-center gap-1 transition-colors"
                          >
                            <span>Did you mean</span>
                            <span className="font-bold underline">{getEmailSuggestion(form.email)}</span>?
                          </button>
                        )}
                      </div>
                      <input
                        id="customer-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#018790] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="mt-8 p-5 rounded-2xl bg-[#f0f4f8] border border-[#e0eaed]">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-3">
                      Booking Summary Preview
                    </span>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date:</span>
                        <strong className="text-[#005461]">{fmtDate(selectedDate)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Package:</span>
                        <strong className="text-[#005461]">{selectedPkg?.type} ({selectedPkg?.persons} Persons)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Price:</span>
                        <span className="font-semibold text-gray-800">Rs.{Number(selectedPkg?.price || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-bold text-[#018790]">Advance to Pay (30%):</span>
                        <strong className="font-bold text-base text-[#018790]">Rs.{advance.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => goTo(2)}
                    className="px-6 py-3 rounded-xl border border-gray-300 font-semibold text-gray-600 hover:bg-gray-100 transition-colors text-sm inline-flex items-center gap-1.5"
                  >
                    <IconArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => goTo(4)}
                    className="btn-primary text-sm px-8 py-3.5 shadow-md inline-flex items-center gap-2"
                  >
                    <span>Pay Advance</span>
                    <IconArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PAY ADVANCE & UPLOAD RECEIPT */}
            {step === 4 && (
              <div className="fade-in space-y-6">
                {/* Total Advance Summary Card */}
                <div className="bg-gradient-to-br from-[#005461] to-[#018790] rounded-3xl p-6 md:p-8 text-white shadow-lg">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1">
                    Advance Payment Required (30%)
                  </span>
                  <div className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                    Rs.{advance.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/80 mb-6">
                    Full package amount: Rs.{Number(selectedPkg?.price || 0).toLocaleString()} (Remaining due at check-in)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15 text-xs">
                    <div>
                      <span className="text-white/60 block">Date</span>
                      <strong className="font-semibold">{fmtDate(selectedDate)}</strong>
                    </div>
                    <div>
                      <span className="text-white/60 block">Package</span>
                      <strong className="font-semibold">{selectedPkg?.type} ({selectedPkg?.persons} Persons)</strong>
                    </div>
                    <div>
                      <span className="text-white/60 block">Customer</span>
                      <strong className="font-semibold">{form.name}</strong>
                    </div>
                  </div>
                </div>

                {/* Bank Transfer Box */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#e0eaed]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#005461]">
                      <IconBank className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#005461]">Bank Transfer Details</h3>
                      <p className="text-gray-400 text-xs">Transfer the 30% advance amount to the account below</p>
                    </div>
                  </div>

                  <div className="bg-teal-50/70 border border-teal-100 rounded-2xl p-5 mb-8 space-y-2 text-sm text-[#1a2e35]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bank:</span>
                      <strong className="font-bold text-[#005461]">HATTON NATIONAL BANK</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Account Number:</span>
                      <strong className="font-mono font-bold text-base text-[#018790]">159020057676</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Account Name:</span>
                      <strong className="font-bold text-[#005461]">Nazeek MRM</strong>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Drag & Drop Receipt Upload */}
                    <div>
                      <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-2">
                        Upload Payment Receipt (JPG, PNG, PDF max 5MB)
                      </label>
                      <div
                        onClick={() => document.getElementById('receiptInput').click()}
                        className="upload-zone"
                      >
                        <input
                          id="receiptInput"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,application/pdf"
                          onChange={(e) => handleReceiptChange(e.target.files[0])}
                          className="hidden"
                        />
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-3 text-[#018790]">
                          <IconUpload className="w-6 h-6" />
                        </div>
                        <strong className="text-[#005461] text-sm block mb-1">
                          {receipt ? receipt.name : 'Click to Upload Receipt'}
                        </strong>
                        <p className="text-gray-400 text-xs">
                          {receipt ? `${(receipt.size / 1024).toFixed(1)} KB selected` : 'Drag and drop your file or browse'}
                        </p>
                      </div>

                      {/* Preview if image */}
                      {previewUrl && (
                        <div className="mt-4 flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <img
                            src={previewUrl}
                            alt="Receipt Preview"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-gray-700 truncate block">
                              {receipt?.name}
                            </span>
                            <span className="text-[11px] text-green-600 font-medium">Ready to submit</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setReceipt(null); setPreviewUrl('') }}
                            className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span>OR enter bank reference number</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Bank Reference Number */}
                    <div>
                      <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-2">
                        Bank Reference / Transaction ID
                      </label>
                      <input
                        id="reference-number"
                        type="text"
                        value={refNum}
                        onChange={(e) => setRefNum(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#018790] transition-colors"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => goTo(3)}
                        className="px-6 py-3 rounded-xl border border-gray-300 font-semibold text-gray-600 hover:bg-gray-100 transition-colors text-sm inline-flex items-center gap-1.5"
                      >
                        <IconArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary text-sm px-10 py-3.5 disabled:opacity-60 shadow-lg inline-flex items-center gap-2"
                      >
                        <IconSparkle className="w-4 h-4" />
                        <span>{submitting ? 'Submitting...' : 'Submit Booking'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}