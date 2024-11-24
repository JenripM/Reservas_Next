"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "admin") {
      setError(""); 
      console.log("Acceso permitido");
      sessionStorage.setItem("user", email); 
      router.push("/dashboard"); 
    } else {
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Iniciar Sesión</h2>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring focus:ring-purple-500"
              placeholder="tuemailf@ejemplo.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring focus:ring-purple-500"
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-500"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
