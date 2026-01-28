import { supabase } from "../lib/supabase"
import { useEffect } from "react"

export default function Login() {

  // 🔥 ENV CHECK
  const DEV_MODE = import.meta.env.DEV

  // 🔥 Clear dev role ONLY in local
  useEffect(() => {
    if (DEV_MODE) {
      localStorage.removeItem("dev_role")
    }
  }, [DEV_MODE])

  // 🔥 DEV LOGIN (LOCAL TESTING)
  function devLogin(role) {
    localStorage.setItem("dev_role", role)
    window.location.href = "/"
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
      <div className="bg-white p-8 rounded shadow w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">Kulambu Kadai</h1>
        <p className="mb-6 text-gray-600">Login</p>

        {/* 🟢 LOCAL TESTING - ALWAYS SHOW */}
        <div className="space-y-2 mb-4">
          <button
            onClick={() => devLogin("admin")}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Test as Admin
          </button>

          <button
            onClick={() => devLogin("staff")}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Test as Staff
          </button>
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
