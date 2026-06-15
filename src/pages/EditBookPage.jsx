import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { bookService } from '../services/api'
import BookForm from '../components/BookForm'
import toast from 'react-hot-toast'

export default function EditBookPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    bookService.getById(id)
      .then((d) => setBook(d.book))
      .catch(() => { toast.error('Book not found'); navigate('/books') })
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await bookService.update(id, data)
      toast.success('Book updated successfully!')
      navigate(`/books/${id}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="card animate-pulse space-y-4">
          <div className="h-6 bg-ink-800 rounded w-1/3" />
          <div className="h-10 bg-ink-800 rounded" />
          <div className="h-10 bg-ink-800 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <Link to={`/books/${id}`} className="text-ink-500 hover:text-ink-300 text-sm flex items-center gap-1.5 mb-5 transition-colors">
          ← Back to Book
        </Link>
        <h1 className="font-display text-3xl font-semibold text-ink-100">Edit Book</h1>
        <p className="text-ink-500 text-sm mt-1 font-mono truncate">{book?.name}</p>
      </div>

      <div className="card">
        {book && <BookForm initialData={book} onSubmit={handleSubmit} loading={loading} submitLabel="Save Changes" />}
      </div>
    </div>
  )
}
