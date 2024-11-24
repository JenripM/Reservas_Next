"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Reservation {
  id: number;
  clientName: string;
  partySize: number;
  date: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

export default function DeleteReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const router = useRouter();

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

  const handleDelete = async (reservationId: number) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/reservas/${reservationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReservations((prev) => prev.filter((reservation) => reservation.id !== reservationId));
        alert("Reserva eliminada correctamente");
        router.push("/listar");
      } else {
        alert("Error al eliminar la reserva");
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Error al eliminar la reserva");
    } finally {
      setIsDeleting(false);
      setConfirmation(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Eliminar Reserva</h1>

      <div className="w-full max-w-3xl mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Reservas Disponibles</h2>
        <ul className="space-y-4">
          {reservations.map((reservation) => (
            <li
              key={reservation.id}
              className="flex justify-between items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">{reservation.clientName}</p>
                <p className="text-sm text-gray-600">{reservation.date}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedReservationId(reservation.id);
                  setConfirmation(true);
                }}
                className="px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {confirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              ¿Estás seguro de que deseas eliminar esta reserva?
            </h2>
            <p className="mb-6 text-sm text-gray-600 text-center">Esta acción no puede deshacerse.</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDelete(selectedReservationId!)}
                className="py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Confirmar"}
              </button>
              <button
                onClick={() => setConfirmation(false)}
                className="py-3 px-6 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <Link href="/dashboard">
          <button className="px-5 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400">
            Regresar al Dashboard
          </button>
        </Link>

        <Link href="/listar">
          <button className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
            Ir a Listado de Reservas
          </button>
        </Link>
      </div>
    </div>
  );
}
