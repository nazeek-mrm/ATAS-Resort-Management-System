import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  return (
    <nav style={{ background: 'rgba(0, 58, 69, 0.95)', backdropFilter: 'blur(12px)' }} className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 shadow-lg border-b border-white/10">
      <Link to="/" className="group inline-flex items-center py-1">
        <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.22em] text-white group-hover:text-[#00B7B5] transition-colors duration-300 uppercase leading-none select-none">
          ATAS <span className="text-[#00B7B5] font-normal">RESORT</span>
        </span>
      </Link>

      <ul className="hidden md:flex items-center gap-8">
        <li>
          <Link
            to="/"
            className="text-sm font-semibold tracking-wider transition-colors hover:text-[#00B7B5]"
            style={{ color: loc.pathname === '/' ? '#00B7B5' : 'rgba(255,255,255,0.85)' }}
          >
            HOME
          </Link>
        </li>
        <li>
          <Link
            to="/admin/login"
            className="text-sm font-semibold tracking-wider transition-colors hover:text-[#00B7B5]"
            style={{ color: loc.pathname.startsWith('/admin') ? '#00B7B5' : 'rgba(255,255,255,0.85)' }}
          >
            ADMIN
          </Link>
        </li>
        <li>
          <Link
            to="/booking"
            className="text-sm font-semibold tracking-wider transition-colors hover:text-[#00B7B5]"
            style={{ color: loc.pathname.startsWith('/booking') ? '#00B7B5' : 'rgba(255,255,255,0.85)' }}
          >
            BOOK NOW
          </Link>
        </li>
      </ul>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg bg-white/10 text-white focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${open ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`}></span>
        <span className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}></span>
        <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${open ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`}></span>
      </button>

      {/* Mobile Drawer */}
      {open && (
        <div className="absolute top-full left-0 right-0 border-t py-6 px-6 flex flex-col gap-4 md:hidden shadow-2xl animate-fadeIn" style={{ background: '#003a45', borderColor: 'rgba(255,255,255,0.1)' }}>
          <Link to="/" className="text-base font-semibold text-white/90 hover:text-[#00B7B5]" onClick={() => setOpen(false)}>
            HOME
          </Link>
          <Link to="/admin/login" className="text-base font-semibold text-white/90 hover:text-[#00B7B5]" onClick={() => setOpen(false)}>
            ADMIN
          </Link>
          <Link to="/booking" className="text-base font-semibold text-white/90 hover:text-[#00B7B5]" onClick={() => setOpen(false)}>
            BOOK NOW
          </Link>
        </div>
      )}
    </nav>
  )
}