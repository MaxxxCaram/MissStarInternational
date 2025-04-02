import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
            poster="/images/hero-poster.jpg"
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Miss Star International
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Where beauty meets purpose. Celebrating diversity, talent, and
            ambition of women from around the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dynasty-portal"
              className="glass-button px-8 py-3 rounded-full text-lg font-semibold hover:scale-105 transition-transform"
            >
              Enter Dynasty Portal
            </Link>
            <Link
              href="/consortium"
              className="glass-button-secondary px-8 py-3 rounded-full text-lg font-semibold hover:scale-105 transition-transform"
            >
              Join Our Consortium
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Empowering Global Beauty
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="icon-wrapper mb-4">
                <svg
                  className="w-12 h-12"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zm0 2a3 3 0 013 3v2H7V7a3 3 0 013-3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p>Advanced security measures to protect our community</p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper mb-4">
                <svg
                  className="w-12 h-12"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Community</h3>
              <p>Connect with participants from around the world</p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper mb-4">
                <svg
                  className="w-12 h-12"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p>Promoting the highest standards in beauty pageants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Language Selector */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="glass-card p-2 rounded-full">
          <select
            className="bg-transparent text-white cursor-pointer outline-none"
            onChange={(e) => (window.location.href = e.target.value)}
          >
            <option value="/en">English</option>
            <option value="/es">Español</option>
            <option value="/pt">Português</option>
            <option value="/fr">Français</option>
            <option value="/th">ไทย</option>
            <option value="/vi">Tiếng Việt</option>
          </select>
        </div>
      </div>
    </main>
  );
}
