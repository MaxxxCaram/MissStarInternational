import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-primary to-accent text-white">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              src="/logo.png"
              alt="Miss Star International Logo"
              width={150}
              height={60}
              className="object-contain"
            />
          </div>
          <div className="flex space-x-6">
            <Link href="/en" className="hover:text-secondary transition-colors">
              Home
            </Link>
            <Link
              href="/en/about"
              className="hover:text-secondary transition-colors"
            >
              About
            </Link>
            <Link
              href="/en/contestants"
              className="hover:text-secondary transition-colors"
            >
              Contestants
            </Link>
            <Link
              href="/en/news"
              className="hover:text-secondary transition-colors"
            >
              News
            </Link>
            <Link
              href="/en/contact"
              className="hover:text-secondary transition-colors"
            >
              Contact
            </Link>
          </div>
          <div className="flex space-x-2">
            <Link href="/en" className="text-white hover:text-secondary">
              EN
            </Link>
            <Link href="/es" className="text-white hover:text-secondary">
              ES
            </Link>
            <Link href="/pt" className="text-white hover:text-secondary">
              PT
            </Link>
            <Link href="/th" className="text-white hover:text-secondary">
              TH
            </Link>
            <Link href="/vi" className="text-white hover:text-secondary">
              VI
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative h-[80vh]">
          <Image
            src="/hero.jpg"
            alt="Miss Star International Beauty Pageant"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-6xl font-serif mb-4">
                Miss Star International
              </h1>
              <p className="text-xl mb-8">
                Celebrating Beauty, Grace, and Intelligence
              </p>
              <button className="bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-full transition-colors">
                Register Now
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p>Email: info@missstarinternational.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-secondary">
                  Facebook
                </a>
                <a href="#" className="hover:text-secondary">
                  Instagram
                </a>
                <a href="#" className="hover:text-secondary">
                  Twitter
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/en/privacy" className="hover:text-secondary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/en/terms" className="hover:text-secondary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/en/faq" className="hover:text-secondary">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} Miss Star International. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
