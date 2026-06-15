import { useState } from 'react'

const EMPTY_FORM = {
  name: '',
  author: '',
  title: '',
  published_date: '',
  price: '',
  status: 'available',
}

const sanitizeText = (value) =>
  String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')

export default function BookForm({ initialData, onSubmit, loading, submitLabel = 'Save Book' }) {
  const [form, setForm] = useState(() =>
    initialData
      ? {
          ...initialData,
          published_date: initialData.published_date
            ? new Date(initialData.published_date).toISOString().split('T')[0]
            : '',
          price: String(initialData.price ?? ''),
        }
      : EMPTY_FORM
  )

  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    const name = sanitizeText(form.name)
    const author = sanitizeText(form.author)
    const title = sanitizeText(form.title)
    const publishedDate = sanitizeText(form.published_date)
    const price = sanitizeText(form.price)

    if (!name) e.name = 'Book name is required'
    if (!author) e.author = 'Author is required'
    if (!title) e.title = 'Title is required'
    if (!publishedDate) e.published_date = 'Published date is required'
    if (!price || isNaN(Number(price)) || Number(price) <= 0) e.price = 'Enter a valid price'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleanedForm = {
      ...form,
      name: sanitizeText(form.name),
      author: sanitizeText(form.author),
      title: sanitizeText(form.title),
      published_date: sanitizeText(form.published_date),
      price: sanitizeText(form.price),
      status: sanitizeText(form.status),
    }

    setForm(cleanedForm)
    if (!validate()) return
    onSubmit({ ...cleanedForm, price: Number(cleanedForm.price) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Book Name" error={errors.name}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. The Great Gatsby"
            className="input-field"
          />
        </Field>

        <Field label="Author" error={errors.author}>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="e.g. F. Scott Fitzgerald"
            className="input-field"
          />
        </Field>

        <Field label="Title / Subtitle" error={errors.title} className="sm:col-span-2">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. A Novel of the Jazz Age"
            className="input-field"
          />
        </Field>

        <Field label="Published Date" error={errors.published_date}>
          <input
            type="date"
            name="published_date"
            value={form.published_date}
            onChange={handleChange}
            className="input-field"
          />
        </Field>

        <Field label="Price (₦)" error={errors.price}>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="e.g. 2500"
            min="0"
            step="0.01"
            className="input-field"
          />
        </Field>

        <Field label="Availability Status" className="sm:col-span-2">
          <div className="flex gap-3">
            {['available', 'unavailable'].map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-2.5 flex-1 px-4 py-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  form.status === opt
                    ? opt === 'available'
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400'
                      : 'border-red-500/50 bg-red-500/10 text-red-400'
                    : 'border-ink-700 bg-ink-900 text-ink-500 hover:border-ink-500'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={opt}
                  checked={form.status === opt}
                  onChange={handleChange}
                  className="hidden"
                />
                <span
                  className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                    form.status === opt
                      ? opt === 'available'
                        ? 'border-emerald-400 bg-emerald-400'
                        : 'border-red-400 bg-red-400'
                      : 'border-ink-600'
                  }`}
                />
                <span className="text-sm font-medium capitalize">{opt}</span>
              </label>
            ))}
          </div>
        </Field>
      </div>

      <div className="pt-2 flex justify-end">
        <button type="submit" disabled={loading} className="btn-primary min-w-[140px]">
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner /> Saving…
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  )
}

function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
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
