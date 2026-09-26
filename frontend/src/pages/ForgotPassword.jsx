import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { IconKey, IconCheck, IconAlert, IconArrowLeft } from '../components/Icons'

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('success')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const notify = (m, t = 'success') => {
    setMsg(m)
    setMsgType(t)
  }

  const sendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      const res = await api.post('/admin/forgot-password/send-otp', { backup_email: email.trim() })
      setStep(2)
      if (res.data?.dev_otp) {
        notify(`OTP Code: ${res.data.dev_otp} (Sent to ${email.trim()})`)
      } else {
        notify(res.data?.message || 'OTP sent successfully to your backup email!')
      }
    } catch (err) {
      notify(err.response?.data?.error || 'Email not registered as admin backup.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      await api.post('/admin/forgot-password/verify-otp', {
        otp_code: otp.trim(),
        backup_email: email.trim(),
      })
      setStep(3)
      notify('OTP verified! Please set your new password.')
    } catch (err) {
      notify(err.response?.data?.error || 'Invalid or expired OTP.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const resetPwd = async (e) => {
    e.preventDefault()
    if (newPwd !== confirmPwd) {
      notify('Passwords do not match!', 'error')
      return
    }
    setLoading(true)
    setMsg('')
    try {
      await api.post('/admin/forgot-password/reset', {
        new_password: newPwd,
        confirm_password: confirmPwd,
        backup_email: email.trim(),
      })
      alert('Password reset successful! Please login with your new password.')
      navigate('/admin/login')
    } catch (err) {
      notify(err.response?.data?.error || 'Password reset failed.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #003a45 0%, #005461 50%, #018790 100%)' }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 fade-in border border-white/20">
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-md"
              style={{ background: 'linear-gradient(135deg, #005461, #018790)' }}
            >
              <IconKey className="w-8 h-8 text-[#00B7B5]" />
            </div>
            <h1 className="text-xl font-black text-[#005461] tracking-tight font-serif">
              FORGOT PASSWORD
            </h1>
            <div className="flex gap-2.5 mt-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`w-8 h-1.5 rounded-full transition-all ${
                    step >= n ? 'bg-[#018790]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {msg && (
            <div
              className={`rounded-xl px-4 py-3 text-xs mb-5 flex items-center gap-2 ${
                msgType === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-600'
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}
            >
              {msgType === 'error' ? (
                <IconAlert className="w-4 h-4 text-red-500 shrink-0" />
              ) : (
                <IconCheck className="w-4 h-4 text-green-600 shrink-0" />
              )}
              <span>{msg}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={sendOtp} className="space-y-4">
              <p className="text-gray-500 text-xs text-center mb-4 leading-relaxed">
                Enter your registered admin backup email address to receive a 6-digit OTP.
              </p>
              <div>
                <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-1.5">
                  Backup Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-2 border-[#e0eaed] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#018790]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md"
                style={{ background: 'linear-gradient(135deg, #00B7B5, #018790)' }}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={verifyOtp} className="space-y-4">
              <p className="text-gray-500 text-xs text-center mb-4 leading-relaxed">
                Enter the 6-digit OTP code sent to <strong>{email}</strong>
              </p>
              <div>
                <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-1.5">
                  OTP Code
                </label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="123456"
                  maxLength={6}
                  className="w-full border-2 border-[#e0eaed] rounded-xl px-4 py-3 text-center tracking-[10px] text-xl font-bold font-mono focus:outline-none focus:border-[#018790]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md"
                style={{ background: 'linear-gradient(135deg, #00B7B5, #018790)' }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={resetPwd} className="space-y-4">
              <p className="text-gray-500 text-xs text-center mb-4 leading-relaxed">
                Create a new secure password for your admin account.
              </p>
              <div>
                <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  required
                  minLength={4}
                  placeholder="Enter new password"
                  className="w-full border-2 border-[#e0eaed] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#018790]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  required
                  minLength={4}
                  placeholder="Confirm new password"
                  className="w-full border-2 border-[#e0eaed] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#018790]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md"
                style={{ background: 'linear-gradient(135deg, #00B7B5, #018790)' }}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/admin/login" className="text-gray-400 text-xs hover:text-[#018790] transition-colors inline-flex items-center gap-1.5">
              <IconArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}