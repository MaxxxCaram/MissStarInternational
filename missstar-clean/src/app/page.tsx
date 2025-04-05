import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="relative flex place-items-center">
        <h1 className="text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Miss Star International
        </h1>
      </div>
      <div className="mt-8 text-2xl text-center text-gray-600">
        Bienvenidas al futuro de los concursos de belleza
      </div>
    </main>
  );
}
