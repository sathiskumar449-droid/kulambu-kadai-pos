import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"

export default function Login() {

  // 🔥 ENV CHECK
  const DEV_MODE = import.meta.env.DEV

  // 🔥 Form state
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔥 Clear dev role ONLY in local
  useEffect(() => {
    if (DEV_MODE) {
      localStorage.removeItem("dev_role")
    }
  }, [DEV_MODE])

  // 🔥 FORM LOGIN
  const handleFormLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Admin credentials
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("dev_role", "admin")
      window.location.href = "/"
      return
    }

    // Staff credentials
    if (username === "staff" && password === "staff123") {
      localStorage.setItem("dev_role", "staff")
      window.location.href = "/"
      return
    }

    setError("Invalid username or password")
    setLoading(false)
  }

  // 🔐 GOOGLE LOGIN (LIVE)
  const handleLogin = async () => {
    const redirectUrl = DEV_MODE 
      ? "http://localhost:3002/auth/callback" 
      : "https://kulambukadipos.vercel.app/auth/callback"
    
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl
      }
    })
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

        {/* 📝 CREDENTIALS HINT */}
        <div className="bg-yellow-50 p-3 rounded mb-4 text-xs text-gray-700">
          <p className="font-semibold mb-1">Test Credentials:</p>
          <p>Admin: admin / admin123</p>
          <p>Staff: staff / staff123</p>
        </div>

        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-gray-500 mb-3">Or login with Google</p>

          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            Google Login
          </button>
        </div>
      </div>
    </div>
  )
}
