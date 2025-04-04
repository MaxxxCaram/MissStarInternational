import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface NavigationProps {
  locale: string;
}

export default function Navigation({ locale }: NavigationProps) {
  const t = useTranslations("navigation");

  const locales = ["en", "es", "pt", "th", "vi"];

  return (
    <header className="bg-gradient-to-r from-primary to-accent text-white">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href={`/${locale}`}>
            <Image
              src="/logo.png"
              alt="Miss Star International Logo"
              width={150}
              height={60}
              className="object-contain"
            />
          </Link>
        </div>
        <div className="flex space-x-6">
          <Link
            href={`/${locale}`}
            className="hover:text-secondary transition-colors"
          >
            {t("home")}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="hover:text-secondary transition-colors"
          >
            {t("about")}
          </Link>
          <Link
            href={`/${locale}/contestants`}
            className="hover:text-secondary transition-colors"
          >
            {t("contestants")}
          </Link>
          <Link
            href={`/${locale}/news`}
            className="hover:text-secondary transition-colors"
          >
            {t("news")}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="hover:text-secondary transition-colors"
          >
            {t("contact")}
          </Link>
        </div>
        <div className="flex space-x-2">
          {locales.map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              className={`text-white hover:text-secondary ${
                locale === l ? "text-secondary" : ""
              }`}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
