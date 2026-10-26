
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "No se pudo iniciar sesión."
        );
        return;
      }

      router.replace("/home");
      router.refresh();
    } catch {
      setError(
        "No pudimos conectar con el servidor. Intentá nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f9fb] flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-[390px] min-h-[680px] bg-[#f8f9fb] flex flex-col px-6 py-10">
        <div className="flex flex-col items-center mt-6">
          <div className="w-11 h-11 rounded-xl bg-[#801b32] mb-4" />

          <h1 className="text-3xl font-bold tracking-tight text-[#801b32]">
            GranaBank
          </h1>

          <p className="text-center text-xs text-[#8490a7] mt-3">
            Con cada compra, sumás orgullo granate
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col flex-1 mt-16"
        >
          <label
            htmlFor="email"
            className="text-xs font-medium text-[#23334d] mb-2"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            placeholder="Ingresá tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full bg-white rounded-xl p-4 text-sm text-[#23334d] outline-none focus:ring-2 focus:ring-[#801b32]"
          />

          <label
            htmlFor="password"
            className="text-xs font-medium text-[#23334d] mt-5 mb-2"
          >
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Ingresá tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full bg-white rounded-xl p-4 text-sm text-[#23334d] outline-none focus:ring-2 focus:ring-[#801b32]"
          />

          <label className="flex items-center gap-2 mt-4 text-xs text-gray-400">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
              className="accent-[#801b32]"
            />
            Recordarme
          </label>

          {error && (
            <p
              role="alert"
              className="mt-4 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-auto w-full py-4 rounded-xl bg-[#801b32] text-white font-semibold text-sm cursor-pointer hover:bg-[#681428] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
