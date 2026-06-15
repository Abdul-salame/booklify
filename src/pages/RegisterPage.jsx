import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../services/api'
import toast from 'react-hot-toast'

const sanitizeText = (value) => String(value ?? '').trim().replace(/\s+/g, ' ')

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanedForm = {
      firstName: sanitizeText(form.firstName),
      lastName: sanitizeText(form.lastName),
      email: sanitizeText(form.email),
      password: sanitizeText(form.password),
    }

    if (!cleanedForm.firstName || !cleanedForm.lastName || !cleanedForm.email || !cleanedForm.password) {
      toast.error('Please fill in all fields')
      return
    }
    if (cleanedForm.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await userService.register(cleanedForm)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-ink-950 font-display font-bold text-sm">B</div>
          <span className="font-display text-lg font-semibold text-ink-100">Bookify</span>
        </div>

        <h1 className="font-display text-3xl font-semibold text-ink-100 mb-1">Create account</h1>
        <p className="text-ink-500 text-sm mb-8 font-body">Start managing your book collection</p>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
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
                  placeholder="Min. 6 characters"
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
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Spinner /> Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-500 font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-500 hover:text-purple-400 font-medium transition-colors">
            Sign in
          </Link>
        </p>
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
