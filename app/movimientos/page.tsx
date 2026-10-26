
"use client";

import { useState } from "react";
import Link from "next/link";

type MovementType = "subscription" | "received" | "sent";
type Filter = "all" | MovementType;

type Movement = {
  id: number;
  name: string;
  description: string;
  amount: number;
  type: MovementType;
};

const movements: Movement[] = [
  { id: 1, name: "Adobe", description: "Pago de suscripción", amount: 125, type: "subscription" },
  { id: 2, name: "José Suárez", description: "Pago recibido", amount: 95, type: "received" },
  { id: 3, name: "Figma", description: "Pago de suscripción", amount: 125, type: "subscription" },
  { id: 4, name: "Juan Rodríguez", description: "Pago enviado", amount: 95, type: "sent" },
  { id: 5, name: "Julio César", description: "Pago recibido", amount: 95, type: "received" },
  { id: 6, name: "Mariano Martínez", description: "Pago enviado", amount: 95, type: "sent" },
];

const filters: { label: string; value: Filter }[] = [
  { label: "Todos", value: "all" },
  { label: "Débito Aut.", value: "subscription" },
  { label: "Recibido", value: "received" },
  { label: "Enviado", value: "sent" },
];

const styles = {
  subscription: {
    bg: "bg-purple-100",
    text: "text-purple-500",
    icon: "↕",
  },
  received: {
    bg: "bg-[#eadadd]",
    text: "text-[#801b32]",
    icon: "↓",
  },
  sent: {
    bg: "bg-orange-100",
    text: "text-orange-400",
    icon: "↑",
  },
};

export default function MovimientosPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch = movement.name
      .toLocaleLowerCase("es")
      .includes(search.trim().toLocaleLowerCase("es"));

    const matchesFilter =
      activeFilter === "all" || movement.type === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-[#f8f9fb] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col">

        <header className="px-5 pt-10">
          <h1 className="text-lg font-semibold text-[#28364f]">
            Movimientos
          </h1>

          <div className="relative mt-5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ingresá un nombre o servicio"
              aria-label="Buscar movimientos"
              className="w-full bg-white rounded-xl pl-12 pr-4 py-4 text-sm text-[#28364f] outline-none focus:ring-2 focus:ring-[#801b32]"
            />
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={activeFilter === filter.value}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  activeFilter === filter.value
                    ? "bg-[#801b32] text-white"
                    : "bg-white text-[#28364f] hover:bg-gray-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </header>

        <section className="flex-1 px-5 mt-5">
          {filteredMovements.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm font-medium text-[#28364f]">
                No encontramos movimientos
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Probá con otro nombre o cambiá el filtro.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredMovements.map((movement) => {
                const style = styles[movement.type];

                return (
                  <Link
                    key={movement.id}
                    href={`/movimientos/${movement.id}`}
                    className="bg-white rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${style.bg} ${style.text}`}>
                      {style.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#28364f]">
                        {movement.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {movement.description}
                      </p>
                    </div>

                    <span className={`text-xs font-semibold ${style.text}`}>
                      ${movement.amount}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <nav className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-5 flex items-center justify-between">
          <Link href="/home" aria-label="Inicio" className="text-[#28364f]">
            <HomeIcon />
          </Link>

          <Link href="/movimientos" aria-label="Movimientos" className="text-[#801b32]">
            <ListIcon />
          </Link>

          <Link href="/" aria-label="Volver al login" className="text-[#28364f]">
            <LogoutIcon />
          </Link>
        </nav>
      </div>
    </main>
  );
}

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" strokeLinecap="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" strokeLinejoin="round" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <rect x="5" y="3" width="14" height="18" rx="3" />
      <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M13 5H7a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h6M12 12h9m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
