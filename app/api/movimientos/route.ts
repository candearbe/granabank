
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado. Iniciá sesión." },
        { status: 401 }
      );
    }

    const movements = await prisma.movement.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const result = movements.map((movement) => ({
      id: movement.id,
      name: movement.name,
      description: movement.description,
      amount: Number(movement.amount),
      type: movement.type,
      createdAt: movement.createdAt.toISOString(),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error al obtener movimientos:", error);

    return NextResponse.json(
      { error: "No se pudieron cargar los movimientos." },
      { status: 500 }
    );
  }
}
