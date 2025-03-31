import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Importamos la configuración de franquicias desde nuestro graph.json
import graphData from "../data/graph.json";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Extraer el subdominio
  const subdomain = hostname.split(".")[0];

  // Verificar si es un subdominio válido de franquicia
  const franchises = graphData.entities.franchises;
  const franchise = Object.values(franchises).find((f) =>
    f.properties.subdomain.startsWith(subdomain + ".")
  );

  if (franchise) {
    // Si es una franquicia válida, redirigir a su sección
    url.pathname = `/franchises/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Si no es un subdominio válido, continuar con la ruta normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|static|[\\w-]+\\.\\w+).*)",
  ],
};
