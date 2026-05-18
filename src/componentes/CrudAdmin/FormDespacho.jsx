import { useState } from 'react'

const estadosDisponibles = ['Pendiente', 'En tránsito', 'Entregado', 'Cancelado']

export default function FormDespacho({ despacho, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: despacho?.id || null,
    numeroDespacho: despacho?.numeroDespacho || '',
    estado: despacho?.estado || 'Pendiente',
    direccionDestino: despacho?.direccionDestino || '',
    observaciones: despacho?.observaciones || '',
    fechaDespacho: despacho?.fechaDespacho || new Date().toISOString().split('T')[0],
    fechaCierre: despacho?.fechaCierre || '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">
        {form.id ? 'Editar Despacho' : 'Nuevo Despacho'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">N° Despacho</label>
        <input name="numeroDespacho" value={form.numeroDespacho} onChange={handleChange} required
          className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select name="estado" value={form.estado} onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {estadosDisponibles.map(e => <option key={e}>{e}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dirección Destino</label>
        <input name="direccionDestino" value={form.direccionDestino} onChange={handleChange} required
          className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha Despacho</label>
        <input type="date" name="fechaDespacho" value={form.fechaDespacho} onChange={handleChange} required
          className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha Cierre</label>
        <input type="date" name="fechaCierre" value={form.fechaCierre} onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Observaciones</label>
        <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={3}
          className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 text-sm">
          Cancelar
        </button>
        <button type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
          {form.id ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
