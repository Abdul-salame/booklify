
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookService.getAll()
      .then((d) => setBooks(d.books || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const available = books.filter((b) => b.status === 'available').length
  const unavailable = books.length - available
  const avgPrice = books.length ? (books.reduce((s, b) => s + b.price, 0) / books.length).toFixed(2) : '0.00'
  const recent = [...books].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <p className="text-ink-500 text-sm font-body mb-1">Good to see you back</p>
        <h1 className="font-display text-4xl font-semibold text-ink-100">
          Hello, {user?.firstName}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Books"
          value={loading ? '—' : books.length}
          accent="violet"
          icon={<BookIcon />}
        />
        <StatCard
          label="Available"
          value={loading ? '—' : available}
          accent="teal"
          icon={<CheckCircleIcon />}
        />
        <StatCard
          label="Unavailable"
          value={loading ? '—' : unavailable}
          accent="rose"
          icon={<XCircleIcon />}
        />
        <StatCard
          label="Avg. Price"
          value={loading ? '—' : `₦${avgPrice}`}
          accent="sky"
          icon={<PriceIcon />}
        />
      </div>

      {/* Quick actions + Recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent books */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-ink-100">Recent Books</h2>
            <Link
              to="/books"
              className="text-xs font-medium transition-colors"
              style={{ color: '#a78bfa' }}
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
            </div>
          ) : recent.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-1">
              {recent.map((book) => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-ink-800/60 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-10 rounded border flex-shrink-0 flex items-center justify-center text-xs font-mono font-bold transition-colors"
                      style={{
                        backgroundColor: 'rgba(124,58,237,0.08)',
                        borderColor: 'rgba(124,58,237,0.2)',
                        color: '#a78bfa',
                      }}
                    >
                      {book.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-200 truncate group-hover:text-ink-100">{book.name}</p>
                      <p className="text-xs text-ink-500 truncate">{book.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <span className="text-sm text-ink-300 font-mono">₦{book.price?.toLocaleString()}</span>
                    <StatusBadge status={book.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions + Library Health */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-display text-lg font-semibold text-ink-100 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to="/books/new"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all group border"
                style={{
                  backgroundColor: 'rgba(124,58,237,0.08)',
                  borderColor: 'rgba(124,58,237,0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.15)'
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'
                }}
              >
                <span style={{ color: '#a78bfa' }}><PlusIcon /></span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#a78bfa' }}>Add New Book</p>
                  <p className="text-xs text-ink-500">Add to the collection</p>
                </div>
              </Link>

              <Link
                to="/books"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-ink-800 border border-ink-700 hover:border-ink-500 transition-all group"
              >
                <span className="text-ink-400 group-hover:text-ink-200 transition-colors"><LibraryIcon /></span>
                <div>
                  <p className="text-sm font-semibold text-ink-200">Browse Library</p>
                  <p className="text-xs text-ink-500">Search & filter books</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="font-display text-base font-semibold text-ink-100 mb-4">Library Health</h2>
            <div className="space-y-4">
              <ProgressBar label="Available" value={available} total={books.length} color="#2dd4bf" trackColor="rgba(45,212,191,0.1)" />
              <ProgressBar label="Unavailable" value={unavailable} total={books.length} color="#fb7185" trackColor="rgba(251,113,133,0.1)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function StatCard({ label, value, icon, accent }) {
  const accents = {
    violet: { bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)', icon: 'rgba(167,139,250,1)', text: '#a78bfa' },
    teal:   { bg: 'rgba(45,212,191,0.07)', border: 'rgba(45,212,191,0.2)',  icon: 'rgba(45,212,191,1)',  text: '#2dd4bf' },
    rose:   { bg: 'rgba(251,113,133,0.07)', border: 'rgba(251,113,133,0.2)', icon: 'rgba(251,113,133,1)', text: '#fb7185' },
    sky:    { bg: 'rgba(56,189,248,0.07)', border: 'rgba(56,189,248,0.2)',  icon: 'rgba(56,189,248,1)',  text: '#38bdf8' },
  }
  const a = accents[accent]
  return (
    <div
      className="card border animate-slide-up"
      style={{ backgroundColor: a.bg, borderColor: a.border }}
    >
      <div className="mb-3" style={{ color: a.icon }}>{icon}</div>
      <p className="text-2xl font-display font-bold text-ink-100">{value}</p>
      <p className="text-xs text-ink-500 mt-0.5 font-body">{label}</p>
    </div>
  )
}


function StatusBadge({ status }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={
        status === 'available'
          ? { backgroundColor: 'rgba(45,212,191,0.12)', color: '#2dd4bf' }
          : { backgroundColor: 'rgba(251,113,133,0.12)', color: '#fb7185' }
      }
    >
      {status}
    </span>
  )
}


function ProgressBar({ label, value, total, color, trackColor }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs text-ink-500 mb-1.5">
        <span>{label}</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: trackColor || '#1c1812' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}


function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 px-3 animate-pulse">
      <div className="w-8 h-10 bg-ink-800 rounded" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-ink-800 rounded w-2/3" />
        <div className="h-2.5 bg-ink-800 rounded w-1/3" />
      </div>
    </div>
  )
}


function EmptyState() {
  return (
    <div className="text-center py-10">
      <div className="flex justify-center mb-3 text-ink-700">
        <EmptyBoxIcon />
      </div>
      <p className="text-ink-400 text-sm">No books yet.</p>
      <Link
        to="/books/new"
        className="text-sm mt-1 inline-block transition-colors"
        style={{ color: '#a78bfa' }}
      >
        Add your first book →
      </Link>
    </div>
  )
}


function BookIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function XCircleIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function PriceIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function LibraryIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
  )
}

function EmptyBoxIcon() {
  return (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}
