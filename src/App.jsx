import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"

import Dashboard from "./pages/Dashboard"
import Orders from "./pages/Orders"
import Stock from "./pages/Stock"
import Menu from "./pages/Menu"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"
import Login from "./pages/Login"

import { useUserRole } from "./lib/useUserRole"

// 🔐 Protected Route
function ProtectedRoute({ element, allowedRoles }) {
  const { role, loading } = useUserRole()

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  // 🚪 Not logged in
  if (!role) {
    return <Navigate to="/login" replace />
  }

  // 🔐 Role not allowed → redirect based on role
  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === "admin" ? "/dashboard" : "/menu"} replace />
  }

  return element
}

export default function App() {
  const { role, loading } = useUserRole()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <Router>
      <Routes>

        {/* 🔑 LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 🏠 APP */}
        <Route path="/" element={<Layout />}>

          {/* DEFAULT REDIRECT BASED ON ROLE */}
          <Route
            index
            element={
              !role ? (
                <Navigate to="/login" replace />
              ) : role === "admin" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/menu" replace />
              )
            }
          />

          {/* 👑 ADMIN ONLY */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<Dashboard />}
                allowedRoles={["admin"]}
              />
            }
          />

          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<Reports />}
                allowedRoles={["admin"]}
              />
            }
          />

          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<Settings />}
                allowedRoles={["admin"]}
              />
            }
          />

          {/* 👑 ADMIN + 👷 STAFF */}
          <Route
            path="menu"
            element={
              <ProtectedRoute
                element={<Menu />}
                allowedRoles={["admin", "staff"]}
              />
            }
          />

          <Route
            path="orders"
            element={
              <ProtectedRoute
                element={<Orders />}
                allowedRoles={["admin", "staff"]}
              />
            }
          />

          <Route
            path="stock"
            element={
              <ProtectedRoute
                element={<Stock />}
                allowedRoles={["admin", "staff"]}
              />
            }
          />

          {/* ❌ UNKNOWN PATH */}
          <Route path="*" element={<Navigate to="/menu" replace />} />

        </Route>
      </Routes>
    </Router>
  )
}
