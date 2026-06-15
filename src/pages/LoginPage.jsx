
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/api'
import toast from 'react-hot-toast'

const sanitizeText = (value) => String(value ?? '').trim().replace(/\s+/g, ' ')

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanedForm = {
      email: sanitizeText(form.email),
      password: sanitizeText(form.password),
    }

    if (!cleanedForm.email || !cleanedForm.password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const data = await userService.login(cleanedForm)
      login(data.user)
      toast.success(`Welcome back, ${data.user.firstName}!`)
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ backgroundColor: '#1e1230' }}
      >
        {/* Subtle vignette overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(109,40,217,0.10) 0%, transparent 55%)',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-white"
            style={{ backgroundColor: '#7c3aed' }}
          >
            B
          </div>
          <span className="font-display text-xl font-semibold text-white tracking-tight">
            Bookify
          </span>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <div
            className="w-10 h-0.5 mb-6"
            style={{ backgroundColor: '#7c3aed' }}
          />
          <blockquote
            className="font-display text-3xl italic leading-snug mb-6"
            style={{ color: '#e9d5ff' }}
          >
            "A room without books is like a body without a soul."
          </blockquote>
          <p className="text-sm font-body" style={{ color: '#a78bfa' }}>
            — Abdulsalam Abdulwasiu
          </p>
        </div>

        {/* Tags */}
        <div className="relative z-10 flex gap-3 flex-wrap">
          {['Philosophy', 'Fiction', 'History', 'Science'].map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full font-body"
              style={{
                color: '#c4b5fd',
                border: '1px solid rgba(139,92,246,0.35)',
                backgroundColor: 'rgba(139,92,246,0.08)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 animate-fade-in">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white"
              style={{ backgroundColor: '#7c3aed' }}
            >
              B
            </div>
            <span className="font-display text-lg font-semibold text-ink-100">Bookify</span>
          </div>

          <h1 className="font-display text-3xl font-semibold text-ink-100 mb-1">Sign in</h1>
          <p className="text-ink-500 text-sm mb-8 font-body">
            Access your book management system
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="input-field pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-400 hover:text-purple-300"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 text-sm tracking-wide active:scale-95 text-white"
              style={{ backgroundColor: '#7c3aed' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6d28d9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7c3aed')}
            >
              {loading ? (
                <>
                  <Spinner />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500 font-body">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium transition-colors"
              style={{ color: '#a78bfa' }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
