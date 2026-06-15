import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { bookService } from '../services/api'
import toast from 'react-hot-toast'

export default function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookService.getById(id)
      .then((d) => setBook(d.book))
      .catch(() => { toast.error('Book not found'); navigate('/books') })
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this book permanently?')) return
    try {
      await bookService.delete(id)
      toast.success('Book deleted')
      navigate('/books')
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="card animate-pulse space-y-5">
          <div className="h-8 bg-ink-800 rounded w-1/2" />
          <div className="h-4 bg-ink-800 rounded w-1/3" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-ink-800 rounded" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!book) return null

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-in">
      <Link to="/books" className="text-ink-500 hover:text-ink-300 text-sm flex items-center gap-1.5 mb-6 transition-colors">
        ← Back to Library
      </Link>

      <div className="card">
        {/* Book Header */}
        <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b border-ink-800">
          <div className="flex items-start gap-4">
            <div className="w-14 h-18 bg-ink-800 border border-ink-700 rounded-lg flex items-center justify-center text-2xl font-display font-bold text-amber-500/60 flex-shrink-0" style={{ height: '72px' }}>
              {book.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-ink-100 leading-tight">{book.name}</h1>
              <p className="text-ink-400 text-sm mt-0.5 italic font-display">{book.title}</p>
              <p className="text-ink-500 text-sm mt-1">by {book.author}</p>
            </div>
          </div>
          <StatusBadge status={book.status} />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Detail label="Author" value={book.author} />
          <Detail label="Price" value={`₦${book.price?.toLocaleString()}`} mono />
          <Detail label="Published" value={book.published_date ? new Date(book.published_date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'} />
          <Detail label="Status" value={book.status} capitalize />
          {book.createdAt && (
            <Detail label="Added On" value={new Date(book.createdAt).toLocaleDateString()} className="col-span-2" />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-ink-800">
          <Link to={`/books/${id}/edit`} className="btn-primary flex-1 text-center">
            Edit Book
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value, mono, capitalize, className = '' }) {
  return (
    <div className={`bg-ink-800/50 rounded-lg p-4 ${className}`}>
      <p className="label mb-1">{label}</p>
      <p className={`text-ink-200 text-sm font-medium ${mono ? 'font-mono' : ''} ${capitalize ? 'capitalize' : ''}`}>
        {value || '—'}
      </p>
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold flex-shrink-0 ${
      status === 'available' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'available' ? 'bg-emerald-400' : 'bg-red-400'}`} />
      {status}
    </span>
  )
}
