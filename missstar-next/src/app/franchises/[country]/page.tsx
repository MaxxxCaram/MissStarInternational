import { notFound } from "next/navigation";
import graphData from "../../../../data/graph.json";

interface PageProps {
  params: {
    country: string;
  };
}

export default function FranchisePage({ params }: PageProps) {
  const { country } = params;

  // Buscar la franquicia en nuestro graph.json
  const franchises = graphData.entities.franchises;
  const franchise = Object.values(franchises).find((f) =>
    f.properties.subdomain.startsWith(country + ".")
  );

  if (!franchise) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {franchise.properties.name}
        </h1>

        <div className="glass-card p-6 rounded-xl backdrop-blur-lg bg-white/10">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">About Us</h2>
              <p className="text-lg mb-4">{franchise.properties.description}</p>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">
                  National Director
                </h3>
                <p className="text-lg">{franchise.properties.director}</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Latest Updates</h2>
              {/* Aquí irán las actualizaciones dinámicas */}
              <div className="glass-card p-4 rounded-lg bg-white/5">
                <p className="text-sm opacity-70">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
