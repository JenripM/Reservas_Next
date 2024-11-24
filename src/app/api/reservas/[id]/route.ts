import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma';
import { Prisma } from "@prisma/client";

// GET: Obtener una reserva por ID
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url); // Obtener los parámetros de la URL
  const id = searchParams.get('id'); // Asumiendo que el parámetro ID está en la URL

  if (!id) {
    return NextResponse.json({ message: "ID es requerido" }, { status: 400 });
  }

  try {
    const reserva = await prisma.reservation.findFirst({
      where: {
        id: Number(id), // Convertimos el ID a número
      },
    });

    if (!reserva) {
      return NextResponse.json({ message: "Reserva no encontrada" }, { status: 404 });
    }

    return NextResponse.json(reserva);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
  }
}

// DELETE: Eliminar una reserva por ID
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url); // Obtener los parámetros de la URL
  const id = searchParams.get('id'); // Asumiendo que el parámetro ID está en la URL

  if (!id) {
    return NextResponse.json({ message: "ID es requerido" }, { status: 400 });
  }

  try {
    const deletedReserva = await prisma.reservation.delete({
      where: {
        id: Number(id),
      },
    });

    if (!deletedReserva) {
      return NextResponse.json({ message: "Reserva no encontrada" }, { status: 404 });
    }

    return NextResponse.json(deletedReserva);
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Reserva no encontrada" }, { status: 404 });
      }
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}

// PUT: Actualizar una reserva por ID
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url); // Obtener los parámetros de la URL
  const id = searchParams.get('id'); // Asumiendo que el parámetro ID está en la URL

  if (!id) {
    return NextResponse.json({ message: "ID es requerido" }, { status: 400 });
  }

  try {
    const { clientName, partySize, date, status } = await request.json();

    if (!clientName && !partySize && !date && !status) {
      return NextResponse.json(
        { message: "Debe proporcionar al menos un campo para actualizar" },
        { status: 400 }
      );
    }

    const validStatuses = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Estado inválido" },
        { status: 400 }
      );
    }

    const updateData: Prisma.ReservationUpdateInput = {};

    if (clientName) updateData.clientName = clientName;
    if (partySize) updateData.partySize = partySize;
    if (date) updateData.date = new Date(date);
    if (status) updateData.status = status;

    const updatedReservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Reserva no encontrada" },
          { status: 404 }
        );
      }
    }

    console.error("Error al actualizar la reserva:", error);
    return NextResponse.json(
      { message: "Error al actualizar la reserva" },
      { status: 500 }
    );
  }
}
