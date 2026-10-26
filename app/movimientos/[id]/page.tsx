
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Movement = {
  id: number;
  name: string;
  description: string;
  amount: number;
  type: "SUBSCRIPTION" | "RECEIVED" | "SENT";
  createdAt: string;
};

const typeLabels = {
  SUBSCRIPTION: "Débito automático",
  RECEIVED: "Dinero recibido",
  SENT: "Dinero enviado",
};

function MovementDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [movement, setMovement] = useState<Movement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovement() {
      try {
        setLoading(true);
        setError("");
        setMovement(null);

        const response = await fetch(`/api/movimientos/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "No encontramos este movimiento."
              : "No pudimos cargar el movimiento."
          );
        }

        const data: Movement = await response.json();
        setMovement(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Ocurrió un error inesperado."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovement();

    return () => controller.abort();
  }, [id]);

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <main className="min-h-screen bg-[#f8f9fb] flex justify-center">
      <div className="w-full max-w-[390px] px-5 py-10">
        <button
          type="button"
          onClick={() => router.push("/movimientos")}
          className="text-[#801b32] text-sm cursor-pointer"
        >
          ← Volver
        </button>

        <h1 className="text-xl font-semibold text-[#28364f] mt-8">
          Detalle del movimiento
        </h1>

        {loading ? (
          <p className="text-center text-gray-400 mt-16">
            Cargando movimiento...
          </p>
        ) : error ? (
          <div role="alert" className="text-center mt-16">
            <p className="text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => router.push("/movimientos")}
              className="text-[#801b32] mt-4 cursor-pointer"
            >
              Volver a movimientos
            </button>
          </div>
        ) : movement ? (
          <section className="bg-white rounded-2xl p-6 mt-8">
            <div className="text-center pb-6 border-b border-gray-100">
              <div className="w-14 h-14 bg-[#f4e7ea] rounded-2xl flex items-center justify-center mx-auto text-[#801b32] text-2xl">
                {movement.type === "RECEIVED"
                  ? "↓"
                  : movement.type === "SUBSCRIPTION"
                  ? "↕"
                  : "↑"}
              </div>

              <h2 className="text-lg font-semibold text-[#28364f] mt-4">
                {movement.name}
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                {movement.description}
              </p>

              <p className="text-3xl font-bold text-[#801b32] mt-5">
                {formatAmount(movement.amount)}
              </p>
            </div>

            <dl className="mt-6 space-y-5">
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-gray-400">Tipo</dt>
                <dd className="text-[#28364f] font-medium text-right">
                  {typeLabels[movement.type]}
                </dd>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-gray-400">Fecha</dt>
                <dd className="text-[#28364f] font-medium text-right">
                  {new Date(movement.createdAt).toLocaleDateString(
                    "es-AR",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </dd>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-gray-400">
                  N.º de movimiento
                </dt>
                <dd className="text-[#28364f] font-medium">
                  #{movement.id}
                </dd>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-gray-400">Estado</dt>
                <dd className="text-green-700 font-medium">
                  Registrado
                </dd>
              </div>
            </dl>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default function MovementDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
          <p className="text-sm text-gray-400">
            Cargando movimiento...
          </p>
        </main>
      }
    >
      <MovementDetailContent />
    </Suspense>
  );
}
