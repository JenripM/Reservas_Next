"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegistrarReserva() {
  const [clientName, setClientName] = useState<string>("");
  const [partySize, setPartySize] = useState<number>(1);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName || !date || !time || !partySize) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const nuevaReserva = {
      clientName: clientName,
      partySize: partySize,
      date: `${date}T${time}`,
      status: "PENDIENTE",
    };

    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaReserva),
      });

      if (!response.ok) {
        throw new Error("No se pudo registrar la reserva.");
      }

      const data = await response.json();
      setSuccessMessage(`Reserva registrada con éxito. ID: ${data.id}`);
    } catch (error) {
      setError("Error al registrar la reserva: " + (error instanceof Error ? error.message : 'Desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Registrar Reserva</h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 mb-4 rounded-md">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 mb-4 rounded-md">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="clientName" className="block text-gray-700 font-medium mb-2">Nombre del Cliente</label>
            <input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Ingrese el nombre del cliente"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="partySize" className="block text-gray-700 font-medium mb-2">Número de Personas</label>
            <input
              type="number"
              id="partySize"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md"
              min={1}
              placeholder="Número de personas"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Fecha</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="time" className="block text-gray-700 font-medium mb-2">Hora</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar Reserva"}
          </button>
        </form>

        <div className="mt-6 flex justify-between">
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
              Regresar al Dashboard
            </button>
          </Link>

          <Link href="/listar">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Ir a Listado de Reservas
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
