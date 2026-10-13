import { NextResponse, type NextRequest } from "next/server";

// Première barrière : sans cookie de session, toute page /admin renvoie vers la connexion.
// La vérification complète (signature, expiration) est faite dans chaque page et action.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/connexion")) return NextResponse.next();
  if (!request.cookies.has("salma_admin")) {
    return NextResponse.redirect(new URL("/admin/connexion", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
