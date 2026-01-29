import { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md">
        <CheckCircle className="w-6 h-6 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="hover:bg-green-600 rounded p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
