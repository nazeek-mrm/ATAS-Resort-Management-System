import { Link } from 'react-router-dom'
import { IconPhone, IconMail } from './Icons'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="text-white pt-16 pb-8 border-t border-white/10" style={{ background: '#002f38' }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Brand */}
        <div>
          <div className="mb-4">
            <span className="text-2xl md:text-3xl font-black tracking-wider text-white block">ATAS RESORT</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Your private paradise getaway  -  a full resort experience with a private house, terrace, kids play area and parking, exclusively for you.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-base font-bold text-[#00B7B5] uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>
              <Link to="/" className="hover:text-white transition-colors">HOME</Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-white transition-colors">Book Now</Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-base font-bold text-[#00B7B5] uppercase tracking-wider mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2.5">
              <IconPhone className="w-4 h-4 text-[#00B7B5] shrink-0" />
              <a href="tel:+94123456789" className="hover:text-white transition-colors">+94 12 345 6789</a>
            </li>
            <li className="flex items-center gap-2.5">
              <IconMail className="w-4 h-4 text-[#00B7B5] shrink-0" />
              <a href="mailto:atas.resort@email.com" className="hover:text-white transition-colors">atas.resort@email.com</a>
            </li>
            <li className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#00B7B5] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Addapallam, NINTAVUR</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-white/10 text-center text-xs text-white/40">
        <p className="flex items-center justify-center gap-1.5">
          <span>(c) {currentYear} Atas Resort. All rights reserved. | Designed with</span>
          <svg className="w-3.5 h-3.5 text-red-500 fill-current inline" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </p>
      </div>
    </footer>
  )
}