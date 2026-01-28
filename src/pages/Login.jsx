import { useEffect, useState } from "react"

export default function Login() {

  // � CHANGE YOUR CREDENTIALS HERE
  const ADMIN_USERNAME = "admin"
  const ADMIN_PASSWORD = "admin123"
  const STAFF_USERNAME = "staff"
  const STAFF_PASSWORD = "staff123"

  // 🔥 Form state
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔥 Clear role on mount
  useEffect(() => {
    localStorage.removeItem("user_role")
  }, [])

  // 🔥 FORM LOGIN
  const handleFormLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("user_role", "admin")
      window.location.href = "/"
      return
    }

    // Staff credentials
    if (username === STAFF_USERNAME && password === STAFF_PASSWORD) {
      localStorage.setItem("user_role", "staff")
      window.location.href = "/"
      return
    }

    setError("Invalid username or password")
    setLoading(false)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Kulambu Kadai</h1>
        <p className="mb-6 text-gray-600">POS System</p>

        {/* 🔑 FORM LOGIN */}
        <form onSubmit={handleFormLogin} className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}
