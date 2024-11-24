"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<string | null>(null); // Aceptar tanto string como null
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está logueado
    const loggedInUser = sessionStorage.getItem("user");
    if (!loggedInUser) {
      router.push("/"); // Redirigir al login si no está autenticado
    } else {
      setUser(loggedInUser); // Asignar a user el valor almacenado
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-purple-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("user"); // Eliminar sesión al hacer logout
              router.push("/"); // Redirigir al login
            }}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {/* Saludo al usuario */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Bienvenido, {user || "Usuario"}</h2>
          <p className="text-gray-600 mt-2">Este es tu panel de control.</p>
        </div>

        

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Registrar Reservas</h3>
            <p className="mt-2 text-gray-600">Administrar productos y servicios disponibles.</p>
            <button 
            onClick={() => router.push('/registrar')} // Redirigir a '/listar' cuando se hace click

            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Ver detalles
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Listar Reservas</h3>
            <p className="mt-2 text-gray-600">Ver listado de reservas</p>
            <button
              onClick={() => router.push('/listar')} // Redirigir a '/listar' cuando se hace click
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Ver detalles
            </button>
          </div>


          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Modificar Reserva</h3>
            <p className="mt-2 text-gray-600">Modifica todo los campos de la reserva</p>
            <button 
            onClick={() => router.push('/modexist')} 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
