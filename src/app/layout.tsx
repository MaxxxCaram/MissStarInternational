import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Miss Star International",
  description: "Plataforma oficial del concurso Miss Star International - Celebrando la belleza y el talento",
  keywords: "miss star international, concurso de belleza, pageant, internacional",
  openGraph: {
    title: "Miss Star International",
    description: "Plataforma oficial del concurso Miss Star International",
    url: "https://www.missstarinternational.com",
    siteName: "Miss Star International",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-teal-50">
          {children}
        </div>
      </body>
    </html>
  );
}
