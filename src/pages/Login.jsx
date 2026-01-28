import { useEffect, useState } from "react"

export default function Login() {

  // � CHANGE YOUR CREDENTIALS HERE
  const ADMIN_USERNAME = "admin"
  const ADMIN_PASSWORD = "admin123"
  const STAFF_USERNAME = "staff"
  const STAFF_PASSWORD = "staff123"

  // 🔑 RECOVERY CODE (Change this to your secret code)
  const RECOVERY_CODE = "RESET2026"

  // 🔥 Form state
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  // 🔑 Recovery state
  const [showRecovery, setShowRecovery] = useState(false)
  const [recoveryCode, setRecoveryCode] = useState("")
  const [recoveryError, setRecoveryError] = useState("")
  const [showCredentials, setShowCredentials] = useState(false)

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

  // 🔑 RECOVERY VERIFICATION
  const handleRecovery = (e) => {
    e.preventDefault()
    setRecoveryError("")
    
    if (recoveryCode === RECOVERY_CODE) {
      setShowCredentials(true)
      setRecoveryError("")
    } else {
      setRecoveryError("Invalid recovery code")
      setShowCredentials(false)
    }
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

        {/* 🔑 FORGOT PASSWORD LINK */}
        <button
          onClick={() => setShowRecovery(true)}
          className="text-sm text-blue-600 hover:underline mb-4"
        >
          Forgot Password?
        </button>
      </div>

      {/* 🔑 RECOVERY MODAL */}
      {showRecovery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Password Recovery</h2>
              <button
                onClick={() => {
                  setShowRecovery(false)
                  setRecoveryCode("")
                  setRecoveryError("")
                  setShowCredentials(false)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {!showCredentials ? (
              <form onSubmit={handleRecovery}>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your recovery code to view credentials
                </p>
                <input
                  type="text"
                  placeholder="Recovery Code"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  required
                />
                {recoveryError && (
                  <p className="text-red-500 text-sm mb-4">{recoveryError}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Verify Code
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded border border-green-200">
                  <p className="font-semibold text-green-800 mb-2">Admin Credentials:</p>
                  <p className="text-sm">Username: <span className="font-mono font-bold">{ADMIN_USERNAME}</span></p>
                  <p className="text-sm">Password: <span className="font-mono font-bold">{ADMIN_PASSWORD}</span></p>
                </div>
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <p className="font-semibold text-blue-800 mb-2">Staff Credentials:</p>
                  <p className="text-sm">Username: <span className="font-mono font-bold">{STAFF_USERNAME}</span></p>
                  <p className="text-sm">Password: <span className="font-mono font-bold">{STAFF_PASSWORD}</span></p>
                </div>
                <button
                  onClick={() => {
                    setShowRecovery(false)
                    setRecoveryCode("")
                    setShowCredentials(false)
                  }}
                  className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
