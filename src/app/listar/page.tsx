"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Definir tipos para las reservas y detalles
interface Reserva {
  id: number;
  clientName: string;
  status: string;
  date: string; // Fecha en formato ISO
}

interface DetallesReserva extends Reserva {
  additionalInfo?: string; // Puedes agregar más campos si es necesario
}

export default function ListarReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [detallesId, setDetallesId] = useState<number | null>(null);
  const [detallesReserva, setDetallesReserva] = useState<DetallesReserva | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");

  useEffect(() => {
    // Realizar la llamada a la API para obtener las reservas
    const fetchReservas = async () => {
      try {
        const response = await fetch("/api/reservas");

        if (!response.ok) {
          throw new Error("No se pudo obtener las reservas");
        }

        const data: Reserva[] = await response.json(); // Definir el tipo de respuesta
        setReservas(data);
        setLoading(false);
      } catch (error) {
        setError("Error al obtener las reservas: " + (error instanceof Error ? error.message : "Desconocido"));
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const verDetalles = async (id: number) => {
    if (detallesId === id) {
      setDetallesId(null);
      setDetallesReserva(null);
      return;
    }

    try {
      const response = await fetch(`/api/reservas/${id}`);

      if (!response.ok) {
        throw new Error("No se pudo obtener los detalles de la reserva");
      }

      const data: DetallesReserva = await response.json(); // Definir el tipo de respuesta
      setDetallesId(id);
      setDetallesReserva(data);
    } catch (error) {
      setError("Error al obtener los detalles de la reserva: " + (error instanceof Error ? error.message : "Desconocido"));
    }
  };

  // Filtrar las reservas según el estado
  const reservasFiltradas = reservas.filter((reserva) => {
    if (filtroEstado === "todas") return true;
    return reserva.status.toLowerCase() === filtroEstado.toLowerCase();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Listar Reservas</h2>
        <p>Cargando reservas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Listar Reservas</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-screen-lg w-full mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Listar Reservas</h2>

      <div className="mb-6 space-x-11">
        <Link href="/eliminar">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Eliminar Reservas</button>
        </Link>
        <Link href="/modificar">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Modificar Estado</button>
        </Link>
      </div>

      <div className="mb-6">
        <label htmlFor="filtroEstado" className="mr-2 text-lg">
          Filtrar por estado:
        </label>
        <select
          id="filtroEstado"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="todas">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="confirmada">Confirmadas</option>
          <option value="cancelada">Canceladas</option>
          <option value="completada">Completadas</option>
        </select>
      </div>

      {detallesId && detallesReserva && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
            <h3 className="text-xl font-semibold text-gray-800">Detalles de la Reserva</h3>
            <p>
              <strong>ID:</strong> {detallesReserva.id}
            </p>
            <p>
              <strong>Cliente:</strong> {detallesReserva.clientName}
            </p>
            <p>
              <strong>Fecha:</strong> {new Date(detallesReserva.date).toLocaleDateString("es-PE")}
            </p>
            <p>
              <strong>Hora:</strong> {new Date(detallesReserva.date).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
            </p>

            <button
              onClick={() => setDetallesId(null)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Ocultar detalles
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-6">
        <table className="min-w-full table-auto">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="py-2 px-4 border-b text-sm sm:text-base">ID</th>
              <th className="py-2 px-4 border-b text-sm sm:text-base">Nombre Cliente</th>
              <th className="py-2 px-4 border-b text-sm sm:text-base">Estado</th>
              <th className="py-2 px-4 border-b text-sm sm:text-base">Fecha</th>
              <th className="py-2 px-4 border-b text-sm sm:text-base">Hora</th>
              <th className="py-2 px-4 border-b text-sm sm:text-base">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map((reserva) => (
              <tr key={reserva.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 text-center">{reserva.id}</td>
                <td className="py-2 px-4 text-center">{reserva.clientName}</td>
                <td className="py-2 px-4 text-center">{reserva.status}</td>
                <td className="py-2 px-4 text-center">{new Date(reserva.date).toLocaleDateString("es-PE")}</td>
                <td className="py-2 px-4 text-center">{new Date(reserva.date).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => verDetalles(reserva.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between">
        <Link href="/dashboard">
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Regresar al Dashboard</button>
        </Link>

        <Link href="/listar">
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Ir a Listado de Reservas</button>
        </Link>
      </div>
    </div>
  );
}
