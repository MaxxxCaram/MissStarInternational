import Link from "next/link";

export default function SpanishHome() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      <nav className="p-4 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          Miss Star International
        </div>
        <div className="flex gap-4">
          {["en", "es", "pt", "th", "vi"].map((lang) => (
            <Link
              key={lang}
              href={`/${lang}`}
              className="text-white hover:text-yellow-300 transition"
            >
              {lang.toUpperCase()}
            </Link>
          ))}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-8">Miss Star International</h1>
          <p className="text-xl mb-12">
            Descubre la Belleza, Abraza la Diversidad
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Concurso</h2>
              <p>Únete al concurso de belleza internacional más prestigioso</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Comunidad</h2>
              <p>Conéctate con concursantes de todo el mundo</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Legado</h2>
              <p>Sé parte de un legado internacional en crecimiento</p>
            </div>
          </div>

          <button className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition">
            Regístrate Ahora
          </button>
        </div>
      </div>
    </main>
  );
}
