const BASE_URL = '//'  // http://localhost:3000

async function request(method, path, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(path, options)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong')
  }
  return data
}

// Books 
export const bookService = {
  getAll: () => request('GET', '/books'),
  getById: (id) => request('GET', `/books/${id}`),
  create: (payload) => request('POST', '/books/create', payload),
  update: (id, payload) => request('PUT', `/books/${id}`, payload),
  delete: (id) => request('DELETE', `/books/${id}`),
}

// Users 
export const userService = {
  register: (payload) => request('POST', '/users/create', payload),
  login: (payload) => request('POST', '/users/login', payload),
}
