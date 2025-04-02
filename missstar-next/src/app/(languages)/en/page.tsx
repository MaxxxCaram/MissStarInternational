import Image from "next/image";

export default function EnglishHome() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">
            Miss Star International
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
            Welcome to the future of beauty pageants. Where elegance meets
            innovation.
          </p>
          <div className="flex gap-6 justify-center">
            <a
              href="/en/dynasty-portal"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Enter Dynasty Portal
            </a>
            <a
              href="/en/competition"
              className="px-8 py-3 bg-transparent border-2 border-purple-600 rounded-full text-white font-semibold hover:bg-purple-600/20 transition-all duration-300"
            >
              Join Competition
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-purple-900/20 backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-purple-300 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    title: "Global Platform",
    description:
      "Connect with beauty pageant enthusiasts from around the world through our innovative digital platform.",
  },
  {
    title: "Dynasty Benefits",
    description:
      "Access exclusive opportunities and resources as part of our prestigious international network.",
  },
  {
    title: "Virtual Events",
    description:
      "Participate in groundbreaking virtual events and competitions using cutting-edge technology.",
  },
  {
    title: "Digital Identity",
    description:
      "Create and manage your professional digital presence in the beauty pageant industry.",
  },
  {
    title: "Secure Access",
    description:
      "State-of-the-art security measures protect your data and digital assets.",
  },
  {
    title: "Innovation Hub",
    description:
      "Stay ahead with access to the latest trends and technologies in the beauty industry.",
  },
];
