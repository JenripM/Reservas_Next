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
  const [clientName, setClientName] = useState<string>("");
  const [partySize, setPartySize] = useState<number | string>("");
  const [date, setDate] = useState<string>("");

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

  const handleReservationChange = async () => {
    if (!selectedReservationId || !selectedStatus || !clientName || !partySize || !date) {
      return;
    }

    try {
      const response = await fetch(`/api/reservas/${selectedReservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName,
          partySize,
          date,
          status: selectedStatus,
        }),
      });

      const updatedReservation = await response.json();
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === updatedReservation.id ? updatedReservation : reservation
        )
      );
      setSelectedReservationId(null);
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12 px-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Modificar Reserva
      </h1>

      <div className="mb-8 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Selecciona una Reserva</h2>
        <select
          value={selectedReservationId ?? ""}
          onChange={(e) => {
            const reservation = reservations.find(
              (r) => r.id === Number(e.target.value)
            );
            setSelectedReservationId(Number(e.target.value));
            if (reservation) {
              setClientName(reservation.clientName);
              setPartySize(reservation.partySize);
              setDate(reservation.date);
              setSelectedStatus(reservation.status);
            }
          }}
          className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione una reserva</option>
          {reservations.map((reservation) => (
            <option key={reservation.id} value={reservation.id}>
              {reservation.clientName} - {reservation.date}
            </option>
          ))}
        </select>
      </div>

      {selectedReservationId && (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Detalles de la Reserva
          </h2>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="clientName"
                className="block text-gray-700 font-medium mb-2"
              >
                Nombre del Cliente:
              </label>
              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="partySize"
                className="block text-gray-700 font-medium mb-2"
              >
                Tamaño del Grupo:
              </label>
              <input
                id="partySize"
                type="number"
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-gray-700 font-medium mb-2"
              >
                Fecha:
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-gray-700 font-medium mb-2"
              >
                Estado:
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un estado</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleReservationChange}
            className="mt-6 w-full py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 transition disabled:bg-gray-300"
          >
            Actualizar Reserva
          </button>
        </div>
      )}

      <div className="mt-8 flex justify-between w-full max-w-md">
        <Link href="/dashboard">
          <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
            Regresar al Dashboard
          </button>
        </Link>

        <Link href="/listar">
          <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
            Ir a Listado de Reservas
          </button>
        </Link>
      </div>
    </div>
  );
}
