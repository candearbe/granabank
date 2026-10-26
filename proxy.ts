
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("granabank_session")?.value;

  const secret = process.env.SESSION_SECRET;
  const demoEmail = process.env.DEMO_EMAIL;

  let authenticated = false;

  if (token && secret && demoEmail) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
        { algorithms: ["HS256"] }
      );

      authenticated =
        payload.email === demoEmail &&
        payload.sub === demoEmail;
    } catch {
      authenticated = false;
    }
  }

  if (!authenticated) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "No autorizado. Iniciá sesión." },
        { status: 401 }
      );
    }

    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/movimientos/:path*",
    "/api/movimientos/:path*",
  ],
};
