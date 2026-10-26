
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado. Iniciá sesión." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const movementId = Number(id);

    if (
      !Number.isSafeInteger(movementId) ||
      movementId <= 0
    ) {
      return NextResponse.json(
        { error: "ID de movimiento inválido." },
        { status: 400 }
      );
    }

    const movement = await prisma.movement.findUnique({
      where: {
        id: movementId,
      },
    });

    if (!movement) {
      return NextResponse.json(
        { error: "Movimiento no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: movement.id,
      name: movement.name,
      description: movement.description,
      amount: Number(movement.amount),
      type: movement.type,
      createdAt: movement.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error al consultar movimiento:", error);

    return NextResponse.json(
      { error: "No se pudo cargar el movimiento." },
      { status: 500 }
    );
  }
}
