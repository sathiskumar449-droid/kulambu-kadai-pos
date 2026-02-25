import { useState, useEffect } from 'react'
import { supabase } from './supabase'   // 👈 correct import

export function useUserRole() {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1️⃣ LocalStorage first (fast + Jio-safe)
        const storedRole = localStorage.getItem('user_role')
        if (storedRole) {
          setRole(storedRole)
          setLoading(false)
          return
        }

        // 2️⃣ Supabase auth (only if available)
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          setRole(null)
          setLoading(false)
          return
        }

        // 3️⃣ Optional: fetch role from profiles table
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!profileError && data?.role) {
          setRole(data.role)
          localStorage.setItem('user_role', data.role)
        } else {
          setRole('staff') // fallback
        }

        setLoading(false)
      } catch (err) {
        console.error('useUserRole error:', err)
        setRole(null)
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { role, loading }
}