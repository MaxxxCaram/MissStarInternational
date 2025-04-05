import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="relative flex place-items-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 animate-gradient">
          Miss Star International
        </h1>
      </div>

      <div className="mb-12 text-xl md:text-2xl text-center text-gray-600">
        Celebrando la belleza y el talento internacional
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
        <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">Concurso 2024</h2>
          <p className="text-gray-600">Prepárate para el evento más esperado del año. ¡Las inscripciones ya están abiertas!</p>
        </div>

        <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold mb-4 text-violet-600">Ganadoras</h2>
          <p className="text-gray-600">Conoce a las reinas que han dejado su huella en nuestra historia.</p>
        </div>

        <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold mb-4 text-teal-600">Patrocinadores</h2>
          <p className="text-gray-600">Descubre las marcas que hacen posible este evento internacional.</p>
        </div>
      </div>

      <footer className="mt-16 text-center text-gray-500">
        <p>© 2024 Miss Star International. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
