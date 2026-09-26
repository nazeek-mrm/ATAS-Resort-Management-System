import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import Toast from '../components/Toast'
import {
  IconClipboard,
  IconChart,
  IconSettings,
  IconGlobe,
  IconLogout,
  IconBell,
  IconClock,
  IconCheck,
  IconCross,
  IconBan,
  IconRefresh,
  IconSearch,
  IconPhone,
  IconMail,
  IconReceipt,
  IconNote,
  IconPrinter,
  IconLock,
  IconEye,
  IconEyeOff
} from '../components/Icons'

const STATUS_BADGE = {
  pending:   'badge-pending',
  confirmed: 'badge-confirmed',
  rejected:  'badge-rejected',
  cancelled: 'badge-cancelled',
}

const fmtDate = (d) =>
  d
    ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : ' - '

const fmtPrice = (n) => 'Rs. ' + Number(n || 0).toLocaleString()

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, rejected: 0, cancelled: 0 })
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState('bookings') // 'bookings', 'reports', 'settings'
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Modals
  const [modal, setModal] = useState(null) // { booking, action }
  const [receiptModal, setReceiptModal] = useState(null) // { booking, url }
  const [noteModal, setNoteModal] = useState(null) // { booking, note }

  // Settings
  const [creds, setCreds] = useState({ new_username: '', new_password: '', confirm_password: '' })
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)

  // Reports
  const currentDate = new Date()
  const [reportYear, setReportYear] = useState(currentDate.getFullYear())
  const [reportMonth, setReportMonth] = useState(currentDate.getMonth() + 1)
  const [reportData, setReportData] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)

  const navigate = useNavigate()
  const notify = (msg, type = 'success') => setToast({ msg, type })

  // Auth verification
  const checkAuth = useCallback(async () => {
    try {
      const r = await api.get('/admin/me')
      setUsername(r.data.username)
    } catch {
      navigate('/admin/login')
    }
  }, [navigate])

  // Fetch Bookings
  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)
      if (searchQuery.trim()) params.append('q', searchQuery.trim())
      const r = await api.get(`/admin/bookings?${params.toString()}`)
      setBookings(r.data.bookings)
      setStats(r.data.stats)
    } catch {
      notify('Failed to load bookings from server', 'error')
    } finally {
      setLoading(false)
    }
  }, [filter, searchQuery])

  // Fetch Reports
  const fetchReports = useCallback(async () => {
    setReportLoading(true)
    try {
      const r = await api.get(`/admin/reports?year=${reportYear}&month=${reportMonth}`)
      setReportData(r.data)
    } catch {
      notify('Failed to load report data', 'error')
    } finally {
      setReportLoading(false)
    }
  }, [reportYear, reportMonth])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (page === 'bookings') {
      const delaySearch = setTimeout(() => {
        fetchBookings()
      }, 300)
      return () => clearTimeout(delaySearch)
    }
  }, [filter, searchQuery, page, fetchBookings])

  useEffect(() => {
    if (page === 'reports') {
      fetchReports()
    }
  }, [page, reportYear, reportMonth, fetchReports])

  // Prevent leaving admin dashboard without explicit logout
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href)
      setShowLogoutModal(true)
    }
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const confirmLogout = async () => {
    setShowLogoutModal(false)
    try {
      await api.post('/admin/logout')
    } catch {}
    navigate('/admin/login')
  }

  // Handle action (confirm, reject, cancel, reconfirm)
  const doAction = async () => {
    if (!modal) return
    try {
      await api.post(`/admin/bookings/${modal.booking.id}/action`, { action: modal.action })
      notify(`Booking ${modal.booking.reference_code} status updated to ${modal.action}!`)
      fetchBookings()
    } catch (e) {
      notify(e.response?.data?.error || 'Action failed', 'error')
    } finally {
      setModal(null)
    }
  }

  // Handle note save
  const saveNote = async () => {
    if (!noteModal) return
    try {
      await api.patch(`/admin/bookings/${noteModal.booking.id}/note`, { admin_note: noteModal.note })
      notify('Admin note updated successfully!')
      fetchBookings()
    } catch (e) {
      notify(e.response?.data?.error || 'Failed to save note', 'error')
    } finally {
      setNoteModal(null)
    }
  }

  // Handle credentials update
  const updateCreds = async (e) => {
    e.preventDefault()
    if (creds.new_password !== creds.confirm_password) {
      notify('Passwords do not match!', 'error')
      return
    }
    try {
      await api.put('/admin/credentials', creds)
      notify('Credentials updated successfully!')
      setUsername(creds.new_username)
      setCreds({ new_username: '', new_password: '', confirm_password: '' })
    } catch (e) {
      notify(e.response?.data?.error || 'Failed to update credentials', 'error')
    }
  }

  const printReport = () => {
    window.print()
  }

  const StatCard = ({ label, value, color, icon, bg }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0eaed] flex items-center justify-between">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
          {label}
        </span>
        <div className={`text-2xl md:text-3xl font-black ${color}`}>{value}</div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
        {icon}
      </div>
    </div>
  )

  const ActionBtn = ({ booking }) => {
    const btns = []
    if (booking.status === 'pending') {
      btns.push(
        <button
          key="c"
          onClick={() => setModal({ booking, action: 'confirm' })}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
        >
          <IconCheck className="w-3.5 h-3.5" />
          <span>Confirm</span>
        </button>
      )
      btns.push(
        <button
          key="r"
          onClick={() => setModal({ booking, action: 'reject' })}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          <IconCross className="w-3.5 h-3.5" />
          <span>Reject</span>
        </button>
      )
    }
    if (booking.status === 'confirmed') {
      btns.push(
        <button
          key="can"
          onClick={() => setModal({ booking, action: 'cancel' })}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
        >
          <IconBan className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>
      )
    }
    if (booking.status === 'rejected' || booking.status === 'cancelled') {
      btns.push(
        <button
          key="rc"
          onClick={() => setModal({ booking, action: 'reconfirm' })}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
        >
          <IconRefresh className="w-3.5 h-3.5" />
          <span>Re-confirm</span>
        </button>
      )
    }
    return <div className="flex flex-wrap gap-1.5">{btns}</div>
  }

  const monthsList = [
    { val: 1, name: 'January' }, { val: 2, name: 'February' }, { val: 3, name: 'March' },
    { val: 4, name: 'April' },   { val: 5, name: 'May' },      { val: 6, name: 'June' },
    { val: 7, name: 'July' },    { val: 8, name: 'August' },   { val: 9, name: 'September' },
    { val: 10, name: 'October' },{ val: 11, name: 'November' },{ val: 12, name: 'December' },
  ]

  const yearsList = useMemo(() => {
    const cur = currentDate.getFullYear()
    const list = []
    for (let y = cur - 2; y <= cur + 2; y++) {
      list.push(y)
    }
    return list
  }, [])

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 text-white z-40 flex flex-col justify-between p-5 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ background: 'linear-gradient(180deg, #003a45 0%, #005461 100%)' }}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2 select-none">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md"
              style={{ background: 'linear-gradient(135deg, #00B7B5, #018790)' }}
            >
              A
            </div>
            <div>
              <span className="text-white font-black text-base tracking-wider block leading-tight">
                ATAS RESORT
              </span>
              <span className="text-[#00B7B5] text-[10px] tracking-widest font-semibold uppercase block">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => { setPage('bookings'); setSidebarOpen(false) }}
              className={`sidebar-link w-full text-left justify-between ${page === 'bookings' ? 'active' : ''}`}
            >
              <div className="flex items-center gap-3">
                <IconClipboard className="w-5 h-5 text-[#00B7B5]" />
                <span className="font-semibold text-sm">All Bookings</span>
              </div>
              {stats.pending > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {stats.pending}
                </span>
              )}
            </button>

            <button
              onClick={() => { setPage('reports'); setSidebarOpen(false) }}
              className={`sidebar-link w-full text-left justify-between ${page === 'reports' ? 'active' : ''}`}
            >
              <div className="flex items-center gap-3">
                <IconChart className="w-5 h-5 text-[#00B7B5]" />
                <span className="font-semibold text-sm">Reports</span>
              </div>
            </button>

            <button
              onClick={() => { setPage('settings'); setSidebarOpen(false) }}
              className={`sidebar-link w-full text-left justify-between ${page === 'settings' ? 'active' : ''}`}
            >
              <div className="flex items-center gap-3">
                <IconSettings className="w-5 h-5 text-[#00B7B5]" />
                <span className="font-semibold text-sm">Settings</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-red-300 hover:text-white hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <IconLogout className="w-4 h-4 text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#e0eaed] px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-[#005461] p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1 className="text-xl font-bold text-[#005461] font-serif capitalize">
              {page === 'bookings' ? 'Booking Management' : page === 'reports' ? 'Monthly Reports' : 'Admin Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {stats.pending > 0 && (
              <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <IconBell className="w-4 h-4 text-red-500" />
                <span>{stats.pending} Pending</span>
              </span>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {/* PAGE: BOOKINGS */}
          {page === 'bookings' && (
            <div className="space-y-6 fade-in">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard label="Total" value={stats.total} color="text-[#005461]" icon={<IconClipboard className="w-6 h-6 text-[#005461]" />} bg="bg-teal-50" />
                <StatCard label="Pending" value={stats.pending} color="text-amber-600" icon={<IconClock className="w-6 h-6 text-amber-600" />} bg="bg-amber-50" />
                <StatCard label="Confirmed" value={stats.confirmed} color="text-green-600" icon={<IconCheck className="w-6 h-6 text-green-600" />} bg="bg-green-50" />
                <StatCard label="Rejected" value={stats.rejected} color="text-red-600" icon={<IconCross className="w-6 h-6 text-red-600" />} bg="bg-red-50" />
                <StatCard label="Cancelled" value={stats.cancelled} color="text-gray-500" icon={<IconBan className="w-6 h-6 text-gray-500" />} bg="bg-gray-100" />
              </div>

              {/* Controls: Search and Filter Tabs */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e0eaed] shadow-xs">
                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'confirmed', 'rejected', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                        filter === s
                          ? 'text-white shadow-md'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                      style={filter === s ? { background: 'linear-gradient(135deg, #00B7B5, #018790)' } : {}}
                    >
                      {s}
                      {s !== 'all' && stats[s] !== undefined && (
                        <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${filter === s ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          {stats[s]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <IconSearch className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, phone, ref..."
                    className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#018790] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      <IconCross className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#e0eaed] overflow-hidden">
                {loading ? (
                  <div className="p-16 text-center text-gray-400 text-sm">
                    <IconClock className="w-8 h-8 mx-auto mb-2 text-[#00B7B5] animate-spin" />
                    <p>Loading bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="p-16 text-center text-gray-400 text-sm">
                    <IconClipboard className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="font-semibold text-gray-600">No bookings found</p>
                    <p className="text-xs text-gray-400 mt-1">Try changing the status filter or search query</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#f8fafc] border-b border-[#e0eaed]">
                        <tr>
                          <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Ref Code</th>
                          <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Package</th>
                          <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                          <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Proof</th>
                          <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Admin Note</th>
                          <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-teal-50/20 transition-colors">
                            {/* Ref Code */}
                            <td className="px-5 py-4 font-mono text-xs font-bold text-[#005461]">
                              {b.reference_code}
                            </td>

                            {/* Customer */}
                            <td className="px-5 py-4">
                              <div className="font-semibold text-[#1a2e35]">{b.customer_name}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                                <IconPhone className="w-3.5 h-3.5 text-[#018790]" />
                                <a href={`tel:${b.mobile_number}`} className="hover:text-[#018790]">{b.mobile_number}</a>
                              </div>
                              <div className="text-[11px] text-gray-400 truncate max-w-[150px] flex items-center gap-1.5 mt-0.5">
                                <IconMail className="w-3.5 h-3.5 text-gray-400" />
                                <a href={`mailto:${b.email}`} className="hover:text-[#018790]">{b.email}</a>
                              </div>
                            </td>

                            {/* Date & Package */}
                            <td className="px-5 py-4">
                              <div className="font-semibold text-[#005461]">{fmtDate(b.booking_date)}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{b.package_name}</div>
                            </td>

                            {/* Payment */}
                            <td className="px-5 py-4">
                              <div className="font-bold text-[#005461]">
                                {fmtPrice(b.advance_amount)}
                              </div>
                              <div className="text-xs text-gray-400">
                                of {fmtPrice(b.package_price)}
                              </div>
                            </td>

                            {/* Proof (Receipt / Ref) */}
                            <td className="px-5 py-4">
                              {b.receipt_url ? (
                                <button
                                  onClick={() => setReceiptModal({ booking: b, url: b.receipt_url })}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-[#018790] border border-teal-200 hover:bg-teal-100 transition-colors"
                                >
                                  <IconReceipt className="w-3.5 h-3.5" />
                                  <span>Receipt</span>
                                </button>
                              ) : b.reference_number ? (
                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600 block truncate max-w-[110px]" title={b.reference_number}>
                                  Ref: {b.reference_number}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400"> - </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4">
                              <span className={STATUS_BADGE[b.status] || 'badge-pending'}>
                                {b.status}
                              </span>
                            </td>

                            {/* Admin Note */}
                            <td className="px-5 py-4">
                              <button
                                onClick={() => setNoteModal({ booking: b, note: b.admin_note || '' })}
                                className="text-xs text-gray-500 hover:text-[#018790] flex items-center gap-1.5 transition-colors"
                                title="Click to view/edit note"
                              >
                                <IconNote className="w-3.5 h-3.5 text-gray-400" />
                                <span className="truncate max-w-[90px]">
                                  {b.admin_note ? b.admin_note : <em className="text-gray-300">Add note</em>}
                                </span>
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4">
                              <ActionBtn booking={b} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAGE: REPORTS */}
          {page === 'reports' && (
            <div className="space-y-6 fade-in">
              {/* Period Selectors & Print Button */}
              <div className="bg-white p-5 rounded-2xl border border-[#e0eaed] shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Report Month:</span>

                  {/* Month Dropdown */}
                  <div className="relative inline-block">
                    <select
                      value={reportMonth}
                      onChange={(e) => setReportMonth(Number(e.target.value))}
                      className="appearance-none bg-white border border-gray-200/90 hover:border-[#009688] focus:border-[#009688] focus:ring-2 focus:ring-[#009688]/15 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-[#005461] shadow-2xs hover:shadow-xs transition-all cursor-pointer outline-none"
                    >
                      {monthsList.map((m) => (
                        <option key={m.val} value={m.val} className="text-gray-800 font-medium py-1">
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#009688]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {/* Year Dropdown */}
                  <div className="relative inline-block">
                    <select
                      value={reportYear}
                      onChange={(e) => setReportYear(Number(e.target.value))}
                      className="appearance-none bg-white border border-gray-200/90 hover:border-[#009688] focus:border-[#009688] focus:ring-2 focus:ring-[#009688]/15 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-[#005461] shadow-2xs hover:shadow-xs transition-all cursor-pointer outline-none"
                    >
                      {yearsList.map((y) => (
                        <option key={y} value={y} className="text-gray-800 font-medium py-1">
                          {y}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#009688]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  onClick={printReport}
                  className="btn-primary text-xs px-5 py-2.5 shadow-sm inline-flex items-center gap-2"
                >
                  <IconPrinter className="w-4 h-4" />
                  <span>Print / Export Report</span>
                </button>
              </div>

              {/* Financial KPI Summary */}
              {reportLoading ? (
                <div className="p-16 text-center text-gray-400">Loading report data...</div>
              ) : reportData ? (
                <div className="space-y-6">
                  {/* Financial KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-[#005461] to-[#018790] text-white rounded-2xl p-6 shadow-md">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/70 block mb-1">
                        Total Confirmed Revenue
                      </span>
                      <div className="text-3xl font-black">{fmtPrice(reportData.stats.total_revenue)}</div>
                      <p className="text-xs text-white/70 mt-2">From {reportData.stats.confirmed} confirmed bookings</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0eaed]">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Advance Collected (30%)
                      </span>
                      <div className="text-3xl font-black text-green-600">{fmtPrice(reportData.stats.total_advance)}</div>
                      <p className="text-xs text-gray-400 mt-2">Received into bank account</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0eaed]">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Balance Due at Check-In
                      </span>
                      <div className="text-3xl font-black text-[#005461]">{fmtPrice(reportData.stats.balance_due)}</div>
                      <p className="text-xs text-gray-400 mt-2">To be collected upon arrival</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0eaed]">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Lost / Cancelled Value
                      </span>
                      <div className="text-3xl font-black text-red-500">{fmtPrice(reportData.stats.lost_revenue)}</div>
                      <p className="text-xs text-gray-400 mt-2">{reportData.stats.rejected + reportData.stats.cancelled} cancelled or rejected</p>
                    </div>
                  </div>

                  {/* Volume Breakdown Bar */}
                  <div className="bg-white p-6 rounded-2xl border border-[#e0eaed] shadow-xs">
                    <h3 className="font-bold text-[#005461] text-sm mb-4">
                      Booking Volume Breakdown ({reportData.stats.total} Total)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                        <span className="text-xs text-green-700 font-semibold block">Confirmed</span>
                        <strong className="text-lg text-green-800">{reportData.stats.confirmed} ({reportData.stats.confirmed_pct}%)</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                        <span className="text-xs text-amber-700 font-semibold block">Pending</span>
                        <strong className="text-lg text-amber-800">{reportData.stats.pending} ({reportData.stats.pending_pct}%)</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                        <span className="text-xs text-red-700 font-semibold block">Rejected</span>
                        <strong className="text-lg text-red-800">{reportData.stats.rejected} ({reportData.stats.rejected_pct}%)</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-xs text-gray-600 font-semibold block">Cancelled</span>
                        <strong className="text-lg text-gray-700">{reportData.stats.cancelled} ({reportData.stats.cancelled_pct}%)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Bookings for the Month */}
                  <div className="bg-white rounded-2xl shadow-sm border border-[#e0eaed] overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-[#005461] text-base">
                        Bookings for {monthsList.find((m) => m.val === reportMonth)?.name} {reportYear}
                      </h3>
                      <span className="text-xs font-semibold text-gray-400">
                        {reportData.bookings.length} Record(s)
                      </span>
                    </div>

                    {reportData.bookings.length === 0 ? (
                      <div className="p-12 text-center text-gray-400 text-sm">
                        No bookings recorded for this month.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Ref</th>
                              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Customer</th>
                              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Package</th>
                              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Total Price</th>
                              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Advance</th>
                              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {reportData.bookings.map((b) => (
                              <tr key={b.id} className="hover:bg-gray-50">
                                <td className="px-5 py-3 font-mono text-xs font-bold text-[#005461]">{b.reference_code}</td>
                                <td className="px-5 py-3 font-medium text-gray-800">{b.customer_name}</td>
                                <td className="px-5 py-3 text-gray-600">{fmtDate(b.booking_date)}</td>
                                <td className="px-5 py-3 text-xs text-gray-500">{b.package_name}</td>
                                <td className="px-5 py-3 font-semibold text-gray-700">{fmtPrice(b.package_price)}</td>
                                <td className="px-5 py-3 font-bold text-[#018790]">{fmtPrice(b.advance_amount)}</td>
                                <td className="px-5 py-3">
                                  <span className={STATUS_BADGE[b.status] || 'badge-pending'}>
                                    {b.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* PAGE: SETTINGS */}
          {page === 'settings' && (
            <div className="max-w-md fade-in">
              <div className="bg-white rounded-3xl shadow-sm border border-[#e0eaed] p-8">
                <h2 className="text-xl font-bold text-[#005461] font-serif mb-2">
                  Change Credentials
                </h2>
                <p className="text-gray-500 text-xs mb-6">
                  Update your administrator username and secure login password.
                </p>

                <form onSubmit={updateCreds} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-1.5">
                      New Username
                    </label>
                    <input
                      value={creds.new_username}
                      onChange={(e) => setCreds({ ...creds, new_username: e.target.value })}
                      required
                      placeholder="e.g. admin"
                      className="w-full border-2 border-[#e0eaed] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#018790]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <IconLock className="w-4 h-4" />
                      </span>
                      <input
                        type={showNewPwd ? 'text' : 'password'}
                        value={creds.new_password}
                        onChange={(e) => setCreds({ ...creds, new_password: e.target.value })}
                        required
                        minLength={4}
                        placeholder="Enter new password"
                        className="w-full border-2 border-[#e0eaed] rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none focus:border-[#018790]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#018790] p-1 rounded-lg transition-colors cursor-pointer"
                        title={showNewPwd ? 'Hide password' : 'Show password'}
                        aria-label={showNewPwd ? 'Hide password' : 'Show password'}
                      >
                        {showNewPwd ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <IconLock className="w-4 h-4" />
                      </span>
                      <input
                        type={showConfirmPwd ? 'text' : 'password'}
                        value={creds.confirm_password}
                        onChange={(e) => setCreds({ ...creds, confirm_password: e.target.value })}
                        required
                        minLength={4}
                        placeholder="Confirm new password"
                        className="w-full border-2 border-[#e0eaed] rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none focus:border-[#018790]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#018790] p-1 rounded-lg transition-colors cursor-pointer"
                        title={showConfirmPwd ? 'Hide password' : 'Show password'}
                        aria-label={showConfirmPwd ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPwd ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md mt-2"
                    style={{ background: 'linear-gradient(135deg, #00B7B5, #018790)' }}
                  >
                    Update Credentials
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ACTION CONFIRMATION */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center fade-in">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-teal-50">
              {modal.action === 'confirm' ? (
                <IconCheck className="w-8 h-8 text-green-600" />
              ) : modal.action === 'reject' ? (
                <IconCross className="w-8 h-8 text-red-600" />
              ) : modal.action === 'cancel' ? (
                <IconBan className="w-8 h-8 text-amber-600" />
              ) : (
                <IconRefresh className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <h3 className="text-xl font-black text-[#005461] mb-2 font-serif capitalize">
              {modal.action} Booking?
            </h3>
            <p className="text-gray-700 text-sm font-semibold mb-1">
              {modal.booking.customer_name}
            </p>
            <p className="text-gray-400 text-xs font-mono mb-6">
              {modal.booking.reference_code}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold text-gray-600 hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={doAction}
                className="flex-1 py-3 rounded-xl text-white font-bold capitalize text-sm shadow-md"
                style={{
                  background:
                    modal.action === 'confirm'
                      ? 'linear-gradient(135deg, #059669, #10b981)'
                      : modal.action === 'reject'
                      ? '#dc2626'
                      : 'linear-gradient(135deg, #00B7B5, #018790)',
                }}
              >
                Yes, {modal.action}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RECEIPT LIGHTBOX */}
      {receiptModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col fade-in">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#005461]">
                  Payment Receipt  -  {receiptModal.booking.customer_name}
                </h3>
                <span className="text-xs text-gray-400 font-mono">
                  {receiptModal.booking.reference_code}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={receiptModal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Open in New Tab  &rarr; 
                </a>
                <button
                  onClick={() => setReceiptModal(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                >
                  <IconCross className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-auto flex items-center justify-center bg-gray-50 flex-1">
              {receiptModal.url.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={receiptModal.url}
                  title="Receipt PDF"
                  className="w-full h-96 rounded-xl border border-gray-200"
                />
              ) : (
                <img
                  src={receiptModal.url}
                  alt="Payment Receipt"
                  className="max-h-[70vh] w-auto object-contain rounded-xl shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN NOTE */}
      {noteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl fade-in">
            <h3 className="text-lg font-bold text-[#005461] font-serif mb-1">
              Admin Internal Note
            </h3>
            <p className="text-gray-400 text-xs font-mono mb-4">
              Booking: {noteModal.booking.reference_code} ({noteModal.booking.customer_name})
            </p>

            <textarea
              rows={4}
              value={noteModal.note}
              onChange={(e) => setNoteModal({ ...noteModal, note: e.target.value })}
              placeholder="Add private note..."
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#018790] mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setNoteModal(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                className="btn-primary text-xs px-5 py-2 shadow-sm"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] transition-all animate-fadeIn"
          onClick={() => setShowLogoutModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-[28px] p-7 sm:p-8 max-w-[400px] w-full shadow-2xl flex flex-col items-center text-center transform transition-all animate-[modalPop_0.25s_cubic-bezier(0.16,1,0.3,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Soft Red Badge Icon */}
            <div className="w-[72px] h-[72px] rounded-full bg-[#fff1f2] border border-[#fecdd3] flex items-center justify-center mb-5 shadow-xs">
              <IconLogout className="w-8 h-8 text-[#ef4444]" />
            </div>

            {/* Classical Serif Title */}
            <h3 className="font-serif text-[24px] sm:text-[26px] font-bold text-[#005461] tracking-tight mb-2">
              Are you sure?
            </h3>

            {/* Message Container Box */}
            <div className="bg-[#f8f9fa] border border-[#f1f3f5] rounded-2xl px-5 py-4 w-full mb-6">
              <p className="text-[#52606d] text-[14.5px] leading-relaxed font-sans">
                Are you sure you want to log out of the Admin Dashboard?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}