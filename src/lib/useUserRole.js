import { useState, useEffect } from "react"
import { supabase } from "./supabase"

export function useUserRole() {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 🔥 DEV MODE ONLY - read from localStorage
        if (import.meta.env.DEV) {
          const devRole = localStorage.getItem("dev_role")
          if (devRole) {
            setRole(devRole)
            setLoading(false)
            return
          }
        } else {
          // 🔐 PRODUCTION - always clear any dev_role
          localStorage.removeItem("dev_role")
        }

        // 🔐 PRODUCTION - read from Supabase auth
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          setRole(null)
          setLoading(false)
          return
        }

        // Get role from user_roles table
        const { data: userRole, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single()

        if (roleError || !userRole) {
          setRole(null)
        } else {
          setRole(userRole.role)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        setRole(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { role, loading }
}
