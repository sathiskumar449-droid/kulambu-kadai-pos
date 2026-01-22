import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import OrdersList from './pages/OrdersList'
import Stock from './pages/Stock'
import Menu from './pages/Menu'
import Reports from './pages/Reports'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders-list" element={<OrdersList />} />
          <Route path="stock" element={<Stock />} />
          <Route path="menu" element={<Menu />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
