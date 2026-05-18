export default function TableDespachos({ despachos, onEdit, onDelete }) {
  if (!despachos.length) {
    return <p className="text-center text-gray-500 mt-8">No hay despachos registrados.</p>
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow mt-4">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3">N° Despacho</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Dirección Destino</th>
            <th className="px-4 py-3">Fecha Despacho</th>
            <th className="px-4 py-3">Fecha Cierre</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {despachos.map((d, i) => (
            <tr key={d.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-2 font-medium">{d.numeroDespacho}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${d.estado === 'Entregado' ? 'bg-green-100 text-green-800' :
                    d.estado === 'En tránsito' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                  {d.estado}
                </span>
              </td>
              <td className="px-4 py-2">{d.direccionDestino}</td>
              <td className="px-4 py-2">{d.fechaDespacho}</td>
              <td className="px-4 py-2">{d.fechaCierre || '—'}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => onEdit(d)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-xs"
                >Editar</button>
                <button
                  onClick={() => onDelete(d.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                >Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
