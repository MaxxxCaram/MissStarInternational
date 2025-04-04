import Image from "next/image";
import Link from "next/link";

export default function PortugueseHome() {
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
            Descubra a Beleza, Abrace a Diversidade
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Concurso</h2>
              <p>
                Participe do concurso de beleza internacional mais prestigiado
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Comunidade</h2>
              <p>Conecte-se com candidatas de todo o mundo</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Legado</h2>
              <p>Faça parte de um legado internacional em crescimento</p>
            </div>
          </div>

          <button className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition">
            Registre-se Agora
          </button>
        </div>
      </div>
    </main>
  );
}
