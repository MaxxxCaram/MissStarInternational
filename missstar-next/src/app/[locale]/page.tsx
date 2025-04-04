import Image from "next/image";
import { useTranslations } from "next-intl";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface HomePageProps {
  params: {
    locale: string;
  };
}

export default function Home({ params: { locale } }: HomePageProps) {
  const t = useTranslations("hero");

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />

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
              <h1 className="text-6xl font-serif mb-4">{t("title")}</h1>
              <p className="text-xl mb-8">{t("subtitle")}</p>
              <button className="bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-full transition-colors">
                {t("cta")}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
