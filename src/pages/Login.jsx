import { useEffect, useState } from "react"
import emailjs from '@emailjs/browser'

export default function Login() {

  // 🔐 CHANGE YOUR CREDENTIALS HERE
  const ADMIN_USERNAME = "kulambukadai"
  const ADMIN_PASSWORD = "kulambukadai@123"
  const ADMIN_EMAIL = "admin@kulambukadai.com"  // ← Change to your email
  
  const STAFF_USERNAME = "staff"
  const STAFF_PASSWORD = "staff@kulambukadai"
  const STAFF_EMAIL = "staff@kulambukadai.com"  // ← Change to your email

  // 📧 EmailJS Configuration (Get from emailjs.com after signup)
  const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"
  const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"
  const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"

  // 🔥 Form state
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  // 🔑 Recovery state
  const [showRecovery, setShowRecovery] = useState(false)
  const [recoveryStep, setRecoveryStep] = useState(1) // 1=email, 2=otp, 3=reset
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [generatedOTP, setGeneratedOTP] = useState("")
  const [enteredOTP, setEnteredOTP] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [recoveryError, setRecoveryError] = useState("")
  const [recoveryRole, setRecoveryRole] = useState("")
  const [recoveryUsername, setRecoveryUsername] = useState("")

  // Store credentials reference
  const credentials = {
    [ADMIN_EMAIL]: { username: ADMIN_USERNAME, password: ADMIN_PASSWORD, role: "admin" },
    [STAFF_EMAIL]: { username: STAFF_USERNAME, password: STAFF_PASSWORD, role: "staff" }
  }

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

  // 📧 SEND OTP
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setRecoveryError("")

    // Check if email exists
    if (!credentials[recoveryEmail]) {
      setRecoveryError("Email not found")
      return
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOTP(otp)
    setRecoveryRole(credentials[recoveryEmail].role)
    setRecoveryUsername(credentials[recoveryEmail].username)

    // Send email using EmailJS
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: recoveryEmail,
          otp_code: otp,
          to_name: credentials[recoveryEmail].username
        },
        EMAILJS_PUBLIC_KEY
      )
      
      setRecoveryStep(2)
      alert("OTP sent to your email!")
    } catch (error) {
      console.error("Email send failed:", error)
      setRecoveryError("Failed to send OTP. Check EmailJS configuration.")
    }
  }

  // ✅ VERIFY OTP
  const handleVerifyOTP = (e) => {
    e.preventDefault()
    setRecoveryError("")

    if (enteredOTP === generatedOTP) {
      setRecoveryStep(3)
    } else {
      setRecoveryError("Invalid OTP")
    }
  }

  // 🔄 RESET PASSWORD
  const handleResetPassword = (e) => {
    e.preventDefault()
    setRecoveryError("")

    if (newPassword !== confirmPassword) {
      setRecoveryError("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setRecoveryError("Password must be at least 6 characters")
      return
    }

    // Update password in localStorage (for this session)
    if (recoveryRole === "admin") {
      alert(`Admin password changed to: ${newPassword}\n\nNOTE: Update ADMIN_PASSWORD in Login.jsx to make permanent!`)
    } else {
      alert(`Staff password changed to: ${newPassword}\n\nNOTE: Update STAFF_PASSWORD in Login.jsx to make permanent!`)
    }

    // Close modal and reset
    closeRecoveryModal()
  }

  const closeRecoveryModal = () => {
    setShowRecovery(false)
    setRecoveryStep(1)
    setRecoveryEmail("")
    setGeneratedOTP("")
    setEnteredOTP("")
    setNewPassword("")
    setConfirmPassword("")
    setRecoveryError("")
    setRecoveryRole("")
    setRecoveryUsername("")
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
                onClick={closeRecoveryModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: Enter Email */}
            {recoveryStep === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <p className="text-sm text-gray-600">
                  Enter your registered email to receive OTP
                </p>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {recoveryError && (
                  <p className="text-red-500 text-sm">{recoveryError}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Send OTP
                </button>
              </form>
            )}

            {/* STEP 2: Verify OTP */}
            {recoveryStep === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <p className="text-sm text-gray-600">
                  Enter the 6-digit OTP sent to {recoveryEmail}
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={enteredOTP}
                  onChange={(e) => setEnteredOTP(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                  maxLength="6"
                  required
                />
                {recoveryError && (
                  <p className="text-red-500 text-sm">{recoveryError}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Verify OTP
                </button>
                <button
                  type="button"
                  onClick={() => setRecoveryStep(1)}
                  className="w-full text-sm text-blue-600 hover:underline"
                >
                  Resend OTP
                </button>
              </form>
            )}

            {/* STEP 3: Reset Password */}
            {recoveryStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Create a new password for <strong>{recoveryUsername}</strong>
                </p>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {recoveryError && (
                  <p className="text-red-500 text-sm">{recoveryError}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Reset Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
