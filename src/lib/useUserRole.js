import { useState, useEffect } from 'react'

export function useUserRole() {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedRole = localStorage.getItem('user_role')
    setRole(storedRole)
    setLoading(false)
  }, [])

  return { role, loading }
}