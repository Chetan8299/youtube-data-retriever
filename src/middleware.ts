import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
 
export async function middleware(request: NextRequest) {

  const token = await getToken({ req: request })
  const url = request.nextUrl;

  if (
    !token &&
    (url.pathname.startsWith("/home") || url.pathname.startsWith("/playlist"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/playlist/:path*",
    "/",
    "/home",
  ],

}