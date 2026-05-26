import { useState, useEffect } from 'react'
import TableDespachos from './CrudAdmin/TableDespachos'
import FormDespacho from './CrudAdmin/FormDespacho'
import Modal from './CrudAdmin/Modal'
import SearchBar from './CrudAdmin/SearchBar'

const API_URL = 'http://100.31.209.170:8081/api/despachos'

export default function CrudAdmin() {
  const [despachos, setDespachos] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchDespachos = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setDespachos(data)
      setFiltrados(data)
    } catch (err) {
      console.error('Error al obtener despachos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDespachos() }, [])

  const handleSearch = (query) => {
    const filtered = despachos.filter(d =>
      d.numeroDespacho?.toLowerCase().includes(query.toLowerCase()) ||
      d.estado?.toLowerCase().includes(query.toLowerCase())
    )
    setFiltrados(filtered)
  }

  const handleSave = async (despacho) => {
    const method = despacho.id ? 'PUT' : 'POST'
    const url = despacho.id ? `${API_URL}/${despacho.id}` : API_URL
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(despacho)
    })
    setShowModal(false)
    setSelected(null)
    fetchDespachos()
  }

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este despacho?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      fetchDespachos()
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-blue-700 rounded-xl shadow p-5 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Gestión de Despachos</h1>
            <p className="text-blue-200 text-sm mt-1">Innovatech Chile — v1.1</p>
          </div>
          <button
            onClick={() => { setSelected(null); setShowModal(true) }}
            className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-lg hover:bg-blue-100 transition"
          >
            + Nuevo Despacho
          </button>
        </div>

        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <p className="text-center text-gray-500 mt-8">Cargando...</p>
        ) : (
          <TableDespachos
            despachos={filtrados}
            onEdit={(d) => { setSelected(d); setShowModal(true) }}
            onDelete={handleDelete}
          />
        )}

        {showModal && (
          <Modal onClose={() => { setShowModal(false); setSelected(null) }}>
            <FormDespacho
              despacho={selected}
              onSave={handleSave}
              onCancel={() => { setShowModal(false); setSelected(null) }}
            />
          </Modal>
        )}

      </div>
    </div>
  )
}