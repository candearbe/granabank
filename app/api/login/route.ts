
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createSession } from "@/lib/auth";

function safeCompare(a: string, b: string) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  if (first.length !== second.length) {
    return false;
  }

  return timingSafeEqual(first, second);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Ingresá email y contraseña." },
        { status: 400 }
      );
    }

    const demoEmail = process.env.DEMO_EMAIL;
    const demoPassword = process.env.DEMO_PASSWORD;

    if (!demoEmail || !demoPassword) {
      throw new Error("Faltan las credenciales de prueba");
    }

    const validEmail = safeCompare(
      email.trim().toLowerCase(),
      demoEmail.toLowerCase()
    );

    const validPassword = safeCompare(
      password,
      demoPassword
    );

    if (!validEmail || !validPassword) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos." },
        { status: 401 }
      );
    }

    await createSession(demoEmail);

    return NextResponse.json({
      success: true,
      redirectTo: "/home",
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return NextResponse.json(
      { error: "No se pudo iniciar sesión." },
      { status: 500 }
    );
  }
}
