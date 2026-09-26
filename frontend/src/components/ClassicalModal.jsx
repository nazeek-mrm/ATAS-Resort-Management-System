import { useEffect } from 'react'

/**
 * ClassicalModal
 * A modern, classical luxury popup modal for validation & alert messages.
 * Matches the classical serif aesthetic of Atas Resort with soft pastel icon badges,
 * clean message containers, and vibrant emerald/teal action buttons.
 */
export default function ClassicalModal({
  isOpen,
  title,
  message,
  buttonText = 'Fix it!',
  onClose,
  targetId
}) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, targetId])

  if (!isOpen) return null

  const handleDismiss = () => {
    onClose?.()
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.focus()
          el.classList.add('ring-2', 'ring-[#009688]', 'ring-offset-2')
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-[#009688]', 'ring-offset-2')
          }, 2000)
        }
      }, 100)
    }
  }

  // Fallback defaults if title or message wasn't explicitly structured
  const displayTitle = title || 'Notice Required'
  const displayMessage = message || 'Please check your inputs to continue.'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] transition-all"
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-[28px] p-7 sm:p-8 max-w-[400px] w-full shadow-2xl flex flex-col items-center text-center transform transition-all animate-[modalPop_0.25s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Red Badge Icon */}
        <div className="w-[72px] h-[72px] rounded-full bg-[#fff1f2] border border-[#fecdd3] flex items-center justify-center mb-5 shadow-xs">
          <svg
            className="w-9 h-9 text-[#ef4444]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2.4" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" />
          </svg>
        </div>

        {/* Classical Serif Title */}
        <h3 className="font-serif text-[26px] font-bold text-[#005461] tracking-tight mb-3">
          {displayTitle}
        </h3>

        {/* Message Container Box */}
        <div className="bg-[#f8f9fa] border border-[#f1f3f5] rounded-2xl px-5 py-4 w-full mb-6">
          <p className="text-[#52606d] text-[14.5px] leading-relaxed font-sans">
            {displayMessage}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="bg-[#009688] hover:bg-[#008577] active:scale-95 text-white font-bold text-[15px] px-9 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}
