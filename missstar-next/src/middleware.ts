import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Obtener el idioma preferido del navegador
  const locale = request.headers.get("accept-language")?.split(",")[0] || "en";

  // Si estamos en la raíz, redirigir según el idioma
  if (request.nextUrl.pathname === "/") {
    let targetLang = "en";

    if (locale.startsWith("es")) targetLang = "es";
    else if (locale.startsWith("pt")) targetLang = "pt";
    else if (locale.startsWith("th")) targetLang = "th";
    else if (locale.startsWith("vi")) targetLang = "vi";

    return NextResponse.redirect(new URL(`/${targetLang}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
