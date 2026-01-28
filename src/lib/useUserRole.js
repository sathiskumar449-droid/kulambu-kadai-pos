import { useState, useEffect } from "react";

export function useUserRole() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 LOCAL DEV ROLE
    if (import.meta.env.DEV) {
      const devRole = localStorage.getItem("dev_role");
      if (devRole) {
        setRole(devRole);
        setLoading(false);
        return;
      }
    }

    // No role, still loading
    setLoading(false);
  }, []);

  return { role, loading };
}