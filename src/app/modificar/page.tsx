"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Reservation {
  id: number;
  clientName: string;
  partySize: number;
  date: string;
  status: "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "COMPLETADA";
}

const statuses = ["PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"];

export default function ReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Fetch all reservations
  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch("/api/reservas");
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    }

    fetchReservations();
  }, []);

  // Handle status change
  const handleStatusChange = async () => {
    if (!selectedReservationId || !selectedStatus) {
      return;
    }

    try {
      const response = await fetch(`/api/reservas/${selectedReservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      const updatedReservation = await response.json();
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === updatedReservation.id ? updatedReservation : reservation
        )
      );
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  return (
    <div className="min-h-screen  p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Modificar Estado de Reserva
      </h1>

      {/* Mostrar lista de reservas */}
      <div className="mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Reservas</h2>
        <select
          value={selectedReservationId ?? ""}
          onChange={(e) => setSelectedReservationId(Number(e.target.value))}
          className="w-full p-3 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Seleccione una reserva</option>
          {reservations.map((reservation) => (
            <option key={reservation.id} value={reservation.id}>
              {reservation.clientName} - {reservation.date}
            </option>
          ))}
        </select>
      </div>
          
      {/* Mostrar opciones de estado solo si se selecciona una reserva */}
      {selectedReservationId && (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h2 className="text-xl font-medium text-gray-800 mb-6">
            Estado Actual:{" "}
            <span className="font-bold text-blue-600">
              {reservations.find((r) => r.id === selectedReservationId)?.status}
            </span>
          </h2>

          <div className="mb-6">
            <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
              Nuevo Estado:
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-3 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Seleccione un estado</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleStatusChange}
            className={`w-full py-3 text-lg font-medium text-white rounded-lg transition-colors duration-300 ${
              selectedStatus
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!selectedStatus}
          >
            Actualizar Estado
          </button>
        </div>
        
      )}
          <div className="mt-6 flex justify-between mx-32">
        <Link href="/dashboard">
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
            Regresar al Dashboard
          </button>
        </Link>

        <Link href="/listar">
          <button className="px-4 py-2 bg-gray-300  text-gray-700 rounded-md hover:bg-gray-400">
            Ir a Listado de Reservas
          </button>
        </Link>
      </div>
      
    </div>
  );
}
