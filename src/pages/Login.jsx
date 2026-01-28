import { supabase } from "../lib/supabase"
import { useEffect } from "react"

export default function Login() {

  // 🔥 Clear any existing dev role on mount
  useEffect(() => {
    localStorage.removeItem("dev_role")
  }, [])

  // 🔥 DEV MODE CHECK (local testing)
  const DEV_MODE = import.meta.env.DEV

  // 🔥 DEV LOGIN FUNCTION
  function devLogin(role) {
    localStorage.setItem("dev_role", role)
    window.location.href = "/"
  }

  // ❌ Google login (local testing-la use panna vendam)
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    })
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">Kulambu Kadai</h1>
        <p className="mb-4 text-gray-600">Local Testing Login</p>

        {/* ❌ GOOGLE LOGIN – COMMENTED FOR LOCAL TESTING */}
        {/*
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white py-2 rounded mb-2"
        >
          Login with Google
        </button>
        */}

        {/* ✅ DEV LOGIN BUTTONS */}
        {DEV_MODE && (
          <div className="space-y-2">
            <button
              onClick={() => devLogin("admin")}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              DEV Login as Admin
            </button>

            <button
              onClick={() => devLogin("staff")}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              DEV Login as Staff
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
