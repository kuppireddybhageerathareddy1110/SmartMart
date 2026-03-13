import { useEffect } from 'react'
import './Toast.css'

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [onClose, duration])

  const toastStyle = {
    background: type === 'success' ? '#4CAF50' :
                type === 'error' ? '#f44336' :
                type === 'warning' ? '#ff9800' : '#2196F3',
  }

  return (
    <div className="toast" style={toastStyle}>
      <span>{message}</span>
      <button onClick={onClose} className="toast-close">×</button>
    </div>
  )
}