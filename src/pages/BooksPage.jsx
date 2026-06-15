import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookService } from '../services/api'
import toast from 'react-hot-toast'

export default function BooksPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteId, setDeleteId] = useState(null)

  const fetchBooks = () => {
    setLoading(true)
    bookService.getAll()
      .then((d) => setBooks(d.books || []))
      .catch(() => toast.error('Failed to load books'))
      .finally(() => setLoading(false))
  }

  useEffect(fetchBooks, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this book? This cannot be undone.')) return
    try {
      await bookService.delete(id)
      toast.success('Book deleted')
      setBooks((prev) => prev.filter((b) => b._id !== id))
    } catch (err) {
      toast.error(err.message)
    }
  }

  const filtered = books.filter((b) => {
    const q = search.toLowerCase()
    const matchesSearch =
      b.name?.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q) ||
      b.title?.toLowerCase().includes(q)
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-100">Library</h1>
          <p className="text-ink-500 text-sm mt-0.5">{books.length} books in collection</p>
        </div>
        <Link to="/books/new" className="btn-primary self-start sm:self-auto">
          + Add Book
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, author, title…"
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'available', 'unavailable'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                statusFilter === s
                  ? 'bg-amber-500 text-ink-950'
                  : 'bg-ink-900 border border-ink-700 text-ink-400 hover:text-ink-200 hover:border-ink-500'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="card space-y-3">
          {[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState hasSearch={!!search} />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-800">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-500 uppercase tracking-wider">Book</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-500 uppercase tracking-wider hidden sm:table-cell">Author</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink-500 uppercase tracking-wider hidden md:table-cell">Published</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-ink-500 uppercase tracking-wider">Price</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-ink-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800/60">
                {filtered.map((book, i) => (
                  <tr key={book._id} className="hover:bg-ink-800/40 transition-colors animate-slide-up group" style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="px-5 py-4">
                      <Link to={`/books/${book._id}`} className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-10 bg-ink-800 rounded border border-ink-700 flex-shrink-0 flex items-center justify-center text-xs font-mono text-amber-500/70 group-hover:border-amber-500/30 transition-colors">
                          {book.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink-200 truncate hover:text-amber-400 transition-colors">{book.name}</p>
                          <p className="text-xs text-ink-500 truncate sm:hidden">{book.author}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-sm text-ink-400">{book.author}</span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-ink-500 font-mono">
                        {book.published_date ? new Date(book.published_date).getFullYear() : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-mono text-ink-300">₦{book.price?.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <StatusBadge status={book.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/books/${book._id}/edit`} className="p-1.5 rounded-lg hover:bg-ink-700 transition-colors text-ink-400 hover:text-ink-200">
                          <EditIcon />
                        </Link>
                        <button onClick={() => handleDelete(book._id)} className="p-1.5 rounded-lg hover:bg-red-900/40 transition-colors text-ink-500 hover:text-red-400">
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
      status === 'available' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'available' ? 'bg-emerald-400' : 'bg-red-400'}`} />
      {status}
    </span>
  )
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

function SkeletonRow() {
  return (
    <div className="flex gap-4 py-3 animate-pulse px-2">
      <div className="w-8 h-10 bg-ink-800 rounded" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 bg-ink-800 rounded w-1/3" />
        <div className="h-2.5 bg-ink-800 rounded w-1/4" />
      </div>
    </div>
  )
}

function EmptyState({ hasSearch }) {
  return (
    <div className="card text-center py-16">
      <p className="text-5xl mb-4">{hasSearch ? '🔍' : '📚'}</p>
      <p className="text-ink-300 font-medium mb-1">{hasSearch ? 'No books match your search' : 'Your library is empty'}</p>
      <p className="text-ink-600 text-sm mb-4">{hasSearch ? 'Try a different keyword' : 'Start by adding your first book'}</p>
      {!hasSearch && <Link to="/books/new" className="btn-primary inline-block">+ Add Book</Link>}
    </div>
  )
}
