import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { IconSparkle } from '../components/Icons'

const quotes = [
  { text: '"The ocean stirs the heart, inspires the imagination and brings eternal joy to the soul."', author: ' -  Robert Wyland' },
  { text: '"To escape and sit quietly on the beach  -  that is my idea of paradise."', author: ' -  Emilia Wickstead' },
  { text: '"Life is short, the world is wide. I want to make some memories."', author: ' -  Anonymous' },
]

export default function HomePage() {
  const [qIdx, setQIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setQIdx((prev) => (prev + 1) % quotes.length)
        setFade(true)
      }, 500)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-bg flex flex-col items-center justify-center px-6 pt-32 pb-24 min-h-screen text-center relative">
        <div className="max-w-3xl mx-auto z-10 fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs md:text-sm font-semibold mb-8 backdrop-blur-md shadow-inner" style={{ background: 'rgba(0, 183, 181, 0.18)', color: '#7eeaea', border: '1px solid rgba(0, 183, 181, 0.35)' }}>
            <IconSparkle className="w-3.5 h-3.5 text-[#00B7B5]" />
            <span>Welcome to Paradise</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight font-serif tracking-tight">
            Breathe with<br />
            <span style={{ background: 'linear-gradient(135deg, #00B7B5 20%, #7eeaea 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ATAS RESORT
            </span>
          </h1>

          {/* Dynamic Quote Box */}
          <div className="min-h-[90px] flex flex-col items-center justify-center mb-8 px-4 transition-opacity duration-500" style={{ opacity: fade ? 1 : 0 }}>
            <p className="text-white/80 text-lg md:text-xl italic font-light max-w-xl leading-relaxed">
              {quotes[qIdx].text}
            </p>
            <p className="text-[#00B7B5] text-sm mt-2 font-medium tracking-wider">
              {quotes[qIdx].author}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-5 mt-4">
            <Link to="/booking" className="btn-primary text-base px-10 py-4 shadow-xl shadow-cyan-500/25 inline-flex items-center gap-2">
              <IconSparkle className="w-4 h-4" />
              <span>Book Now</span>
            </Link>
            <a href="#features" className="btn-secondary text-base px-8 py-4 inline-flex items-center gap-2">
              <span>Explore Resort</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-70">
          <div className="w-0.5 h-10 bg-gradient-to-b from-white/60 to-transparent animate-pulse"></div>
          <span className="text-white/50 text-[10px] tracking-widest uppercase font-semibold">Scroll</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-12 bg-[#f0f4f8]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[#018790] text-xs font-bold tracking-[3px] uppercase bg-cyan-100/60 px-4 py-1.5 rounded-full">
              Our Resort
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 text-[#005461] font-serif leading-snug">
              Everything You Need<br />For A Perfect Stay
            </h2>
            <p className="text-gray-500 mt-3 text-base md:text-lg">
              Book our wonder resort  -  your private paradise awaits
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: 2BHK Private House */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#e0eaed] group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-teal-50 group-hover:bg-teal-100 transition-colors">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z" stroke="#018790" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0,183,181,0.08)" />
                  <path d="M9 21V15H15V21" stroke="#00B7B5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 3V7" stroke="#00B7B5" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-bold text-[#005461] text-xl mb-3 font-serif">2BHK Private House</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Fully furnished private home with bedroom, living area and modern kitchen  -  exclusively yours.
              </p>
            </div>

            {/* Card 2: Private Terrace */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#e0eaed] group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-teal-50 group-hover:bg-teal-100 transition-colors">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 17L12 12L22 17L12 22L2 17Z" stroke="#018790" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0,183,181,0.08)" />
                  <path d="M2 12L12 7L22 12L12 17L2 12Z" stroke="#00B7B5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0,183,181,0.08)" />
                  <path d="M12 2L22 7L12 12L2 7L12 2Z" stroke="#018790" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0,183,181,0.12)" />
                </svg>
              </div>
              <h3 className="font-bold text-[#005461] text-xl mb-3 font-serif">Private Terrace</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Open air terrace with stunning views  -  perfect for sunrise mornings and starlit evenings.
              </p>
            </div>

            {/* Card 3: Kids Play Area */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#e0eaed] group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-teal-50 group-hover:bg-teal-100 transition-colors">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="#018790" strokeWidth="1.8" fill="rgba(0,183,181,0.08)" />
                  <path d="M8.5 14.5C8.5 14.5 9.5 16.5 12 16.5C14.5 16.5 15.5 14.5 15.5 14.5" stroke="#018790" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="10.5" r="1.2" fill="#00B7B5" />
                  <circle cx="15" cy="10.5" r="1.2" fill="#00B7B5" />
                </svg>
              </div>
              <h3 className="font-bold text-[#005461] text-xl mb-3 font-serif">Kids Play Area</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Dedicated mini playground so the little ones can enjoy while parents relax in peace.
              </p>
            </div>

            {/* Card 4: Secure Parking */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#e0eaed] group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-teal-50 group-hover:bg-teal-100 transition-colors">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 11L7 6H17L19 11" stroke="#018790" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="11" width="18" height="6" rx="2" stroke="#018790" strokeWidth="1.8" fill="rgba(0,183,181,0.08)" />
                  <circle cx="7.5" cy="17" r="2" stroke="#00B7B5" strokeWidth="1.8" />
                  <circle cx="16.5" cy="17" r="2" stroke="#00B7B5" strokeWidth="1.8" />
                  <path d="M11 13.5V16.5" stroke="#00B7B5" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M11 13.5H12.5C13.3 13.5 13.3 15 11 15" stroke="#00B7B5" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-bold text-[#005461] text-xl mb-3 font-serif">Secure Parking</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Safe, covered parking space included with every booking  -  no extra charges.
              </p>
            </div>

            {/* Card 5: Entire Resort Yours */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#e0eaed] group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-teal-50 group-hover:bg-teal-100 transition-colors">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 19H22V21H2V19Z" stroke="#018790" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0,183,181,0.1)" />
                  <path d="M3 19L5 10L9 14L12 6L15 14L19 10L21 19" stroke="#018790" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0,183,181,0.08)" />
                  <circle cx="5" cy="10" r="1.5" fill="#00B7B5" />
                  <circle cx="12" cy="6" r="1.5" fill="#00B7B5" />
                  <circle cx="19" cy="10" r="1.5" fill="#00B7B5" />
                </svg>
              </div>
              <h3 className="font-bold text-[#005461] text-xl mb-3 font-serif">Entire Resort Yours</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                When you book, you get the WHOLE resort privately  -  no sharing with strangers.
              </p>
            </div>

            {/* Card 6: Flexible Packages */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#e0eaed] group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-teal-50 group-hover:bg-teal-100 transition-colors">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="18" height="16" rx="2" stroke="#018790" strokeWidth="1.8" fill="rgba(0,183,181,0.08)" />
                  <path d="M3 10H21" stroke="#018790" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M8 3V7M16 3V7" stroke="#018790" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M8 14L10.5 17L16 12" stroke="#00B7B5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-bold text-[#005461] text-xl mb-3 font-serif">Flexible Packages</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Choose from Day, Day-Night, or Night packages to suit your group size and budget perfectly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #005461, #018790)' }}>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-4 font-serif">
            Ready for Your Perfect Escape?
          </h2>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto font-light">
            Check availability and book your private resort experience in just a few minutes.
          </p>
          <Link
            to="/booking"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 px-12 py-4 rounded-2xl text-base font-bold text-white border-2 border-white/40 shadow-xl backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105"
          >
            <IconSparkle className="w-4 h-4" />
            <span>Reserve Your Date</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}