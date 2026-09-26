import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  const bg = type === 'success'
    ? 'linear-gradient(135deg,#059669,#10b981)'
    : 'linear-gradient(135deg,#dc2626,#ef4444)'

  return (
    <div
      onClick={onClose}
      style={{background:bg, position:'fixed', top:'24px', right:'24px', zIndex:9999, padding:'14px 24px', borderRadius:'16px', color:'white', fontSize:'14px', fontWeight:'600', boxShadow:'0 10px 40px rgba(0,0,0,0.25)', cursor:'pointer', animation:'slideIn 0.3s ease'}}
    >
      {type === 'success' ? '✅' : '❌'} {message}
    </div>
  )
}