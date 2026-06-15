import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-ink-950/90 backdrop-blur-md border-b border-ink-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-ink-950 font-display font-bold text-sm group-hover:bg-amber-400 transition-colors">
            B
          </div>
          <span className="font-display text-lg font-semibold text-ink-100 tracking-tight">
            Bookify
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden sm:flex items-center gap-1">
          <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
          <NavLink to="/books" active={isActive('/books')}>All Books</NavLink>
          <NavLink to="/books/new" active={isActive('/books/new')}>+ Add Book</NavLink>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-full bg-ink-700 border border-ink-600 flex items-center justify-center text-xs font-semibold text-amber-400">
              {user?.firstName?.[0]?.toUpperCase()}
            </div>
            <span className="text-ink-400 font-body">{user?.firstName}</span>
          </div>
          <button onClick={handleLogout} className="btn-secondary text-xs px-4 py-2">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-ink-800 text-amber-400'
          : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/60'
      }`}
    >
      {children}
    </Link>
  )
}
