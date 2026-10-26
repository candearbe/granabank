
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Movement = {
  id: number;
  name: string;
  description: string;
  amount: number;
  type: "SUBSCRIPTION" | "RECEIVED" | "SENT";
};

export default function HomePage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovements() {
      try {
        setError("");

        const response = await fetch("/api/movimientos", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los movimientos.");
        }

        const data: Movement[] = await response.json();

        if (!controller.signal.aborted) {
          setMovements(data.slice(0, 4));
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("No se pudieron cargar los movimientos.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovements();

    return () => controller.abort();
  }, []);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("No se pudo cerrar sesión.");
      }

      window.location.replace("/");
    } catch {
      setLogoutError(
        "No pudimos cerrar la sesión. Intentá nuevamente."
      );
      setLoggingOut(false);
    }
  }

  const colors = {
    SUBSCRIPTION: "bg-[#f2e5ff] text-[#a63aff]",
    RECEIVED: "bg-[#eadadd] text-[#801b32]",
    SENT: "bg-[#ffecd5] text-[#ff8500]",
  };

  const arrows = {
    SUBSCRIPTION: "↕",
    RECEIVED: "↓",
    SENT: "↑",
  };

  return (
    <main className="min-h-screen bg-[#f8f9fb] flex justify-center">
      <div className="w-full max-w-[420px] min-h-screen px-5 pt-8 pb-40">
        {/* ENCABEZADO */}
        <header className="flex justify-between items-center mb-7">
          <div>
            <p className="text-sm text-[#8490a7]">Hola</p>
            <h1 className="text-xl font-bold text-[#28364f]">
              Granate
            </h1>
          </div>

          <div className="flex gap-5 text-[#28364f]">
            <Link
              href="/movimientos"
              aria-label="Buscar movimientos"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>
            </Link>

            <button
              type="button"
              aria-label="Notificaciones"
              className="cursor-pointer"
            >
              ♧
            </button>
          </div>
        </header>

        {/* TARJETA GRANABANK */}
        <section className="bg-[#801b32] rounded-[20px] p-6 h-[210px] text-white relative shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-90">Balance</p>
              <h2 className="text-3xl font-bold mt-2">
                978.85
              </h2>
            </div>

            <div className="flex -space-x-2">
              <span className="w-6 h-6 rounded-full bg-red-500" />
              <span className="w-6 h-6 rounded-full bg-orange-500" />
            </div>
          </div>

          <p className="tracking-[3px] font-semibold mt-10">
            **** **** **** 1234
          </p>

          <div className="flex justify-between items-end mt-4">
            <span className="text-sm">Soy Granate</span>
            <div className="text-right text-xs">
              <p>Exp. Date</p>
              <p>02/30</p>
            </div>
          </div>
        </section>

        {/* ÚLTIMOS MOVIMIENTOS */}
        <section className="mt-9">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-[#28364f]">
              Últimos movimientos
            </h2>

            <Link
              href="/movimientos"
              className="text-sm text-[#801b32]"
            >
              Ver todos
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">
              Cargando movimientos...
            </p>
          ) : error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : movements.length === 0 ? (
            <p className="text-sm text-gray-400">
              No hay movimientos disponibles.
            </p>
          ) : (
            <div className="space-y-3">
              {movements.map((movement) => (
                <Link
                  href={`/movimientos/${movement.id}`}
                  key={movement.id}
                  className="flex items-center gap-4 bg-white rounded-2xl px-4 py-4 hover:shadow-sm transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colors[movement.type]}`}
                  >
                    {arrows[movement.type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#28364f] truncate">
                      {movement.name}
                    </p>
                    <p className="text-xs text-[#8490a7] mt-1">
                      {movement.description}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      movement.type === "SUBSCRIPTION"
                        ? "text-[#a63aff]"
                        : movement.type === "RECEIVED"
                        ? "text-[#801b32]"
                        : "text-[#ff8500]"
                    }`}
                  >
                    ${movement.amount}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {logoutError && (
          <p
            role="alert"
            className="text-center text-sm text-red-600 mt-5"
          >
            {logoutError}
          </p>
        )}

        {/* NAVEGACIÓN INFERIOR */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] h-[76px] bg-white border-t border-gray-100 flex justify-around items-center">
          <Link
            href="/home"
            aria-label="Inicio"
            className="text-[#801b32] text-2xl"
          >
            ⌂
          </Link>

          <Link
            href="/movimientos"
            aria-label="Movimientos"
            className="text-[#28364f] text-2xl"
          >
            ▤
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Cerrar sesión"
            className="text-[#28364f] text-2xl cursor-pointer disabled:opacity-50"
          >
            ⇥
          </button>
        </nav>
      </div>
    </main>
  );
}
