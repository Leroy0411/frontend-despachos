import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CrudAdmin from '../componentes/CrudAdmin'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CrudAdmin />} />
        <Route path="/despachos" element={<CrudAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}
