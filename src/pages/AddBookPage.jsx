import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { bookService } from '../services/api'
import BookForm from '../components/BookForm'
import toast from 'react-hot-toast'

export default function AddBookPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await bookService.create(data)
      toast.success('Book added to library!')
      navigate('/books')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <Link to="/books" className="text-ink-500 hover:text-ink-300 text-sm flex items-center gap-1.5 mb-5 transition-colors">
          ← Back to Library
        </Link>
        <h1 className="font-display text-3xl font-semibold text-ink-100">Add New Book</h1>
        <p className="text-ink-500 text-sm mt-1">Fill in the details to add a book to your collection</p>
      </div>

      <div className="card">
        <BookForm onSubmit={handleSubmit} loading={loading} submitLabel="Add Book" />
      </div>
    </div>
  )
}
