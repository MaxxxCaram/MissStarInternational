import Link from "next/link";
import { useTranslations } from "next-intl";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t("contact.title")}</h3>
            <p>{t("contact.email")}</p>
            <p>{t("contact.phone")}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t("social.title")}</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary">
                {t("social.facebook")}
              </a>
              <a href="#" className="hover:text-secondary">
                {t("social.instagram")}
              </a>
              <a href="#" className="hover:text-secondary">
                {t("social.twitter")}
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t("links.title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="hover:text-secondary"
                >
                  {t("links.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="hover:text-secondary"
                >
                  {t("links.terms")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="hover:text-secondary">
                  {t("links.faq")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
