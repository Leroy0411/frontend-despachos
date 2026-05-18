import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleChange = (e) => {
    setQuery(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <div className="mb-4">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar por N° despacho o estado..."
        className="w-full border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
