import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import ClassicalModal from '../components/ClassicalModal'
import { IconLock, IconUser, IconAlert, IconArrowLeft, IconEye, IconEyeOff } from '../components/Icons'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/admin/login', form)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Wrong username or password. Please try again.')
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
              <IconLock className="w-8 h-8 text-[#00B7B5]" />
            </div>
            <h1 className="text-2xl font-black text-[#005461] tracking-tight font-serif">
              ADMIN LOGIN
            </h1>
            <p className="text-gray-400 text-xs mt-1 tracking-wider uppercase font-semibold">
              ATAS RESORT Booking System
            </p>
          </div>

          <ClassicalModal
            isOpen={!!error}
            title="Authentication Error"
            message={error}
            buttonText="Try Again"
            onClose={() => setError('')}
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <IconUser className="w-4 h-4" />
                </span>
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter username"
                  required
                  className="w-full border-2 border-[#e0eaed] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#018790] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#005461] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <IconLock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  required
                  className="w-full border-2 border-[#e0eaed] rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none focus:border-[#018790] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#018790] p-1 rounded-lg transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <IconEyeOff className="w-4 h-4" />
                  ) : (
                    <IconEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-95 disabled:opacity-60 shadow-lg mt-2"
              style={{ background: 'linear-gradient(135deg, #00B7B5, #018790)' }}
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/admin/forgot-password" className="text-[#018790] text-xs font-semibold hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Link to="/" className="text-gray-400 text-xs font-medium hover:text-[#018790] transition-colors inline-flex items-center gap-1.5">
              <IconArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Resort Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}