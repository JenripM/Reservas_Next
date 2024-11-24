import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'
import { Prisma } from "@prisma/client";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, context: Params) {
  // Desestructuramos el objeto params de context, asegurándonos de que params esté disponible
  const { id } = context.params;

  try {
      const reserva = await prisma.reservation.findFirst({
          where: {
              id: Number(id), // Convertimos el ID a número
          }
      });

      // Devolvemos la reserva en formato JSON
      return NextResponse.json(reserva);
  } catch (error) {
      if (error instanceof Error) {
          // Si hay un error, devolvemos el mensaje de error con código de estado 500
          return NextResponse.json(
              {
                  message: error.message,
              },
              {
                  status: 500,
              }
          );
      }
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
      const deletedReserva = await prisma.reservation.delete({
          where: {
              id: Number(params.id),
          },
      });

      if (!deletedReserva) {
          return NextResponse.json({ message: "Reserva no encontrada" }, { status: 404 });
      }

      return NextResponse.json(deletedReserva);
  } catch (error) {
      console.error(error);  // Depuración del error

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
              return NextResponse.json({ message: "Reserva no encontrada" }, { status: 404 });
          }
          return NextResponse.json({ message: error.message }, { status: 500 });
      }
      
      // Si es otro tipo de error, devolver un error genérico
      return NextResponse.json({ message: "Error inesperado" }, { status: 500 });
  }
}




export async function PUT(request: Request, { params }: Params) { 
    try {
        // Parsear los datos del cuerpo de la solicitud
        const { clientName, partySize, date, status } = await request.json();
  
        // Validar que los datos requeridos estén presentes
        if (!clientName && !partySize && !date && !status) {
            return NextResponse.json(
                { message: "Debe proporcionar al menos un campo para actualizar" },
                { status: 400 }
            );
        }
  
        // Validar el estado si se proporciona
        const validStatuses = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json(
                { message: "Estado inválido" },
                { status: 400 }
            );
        }
  
        // Construir el objeto de datos para la actualización
        const updateData: Prisma.ReservationUpdateInput = {};  // Usamos el tipo de entrada de Prisma

        if (clientName) updateData.clientName = clientName;
        if (partySize) updateData.partySize = partySize;
        if (date) updateData.date = new Date(date); // Convertir la fecha a un objeto Date
        if (status) updateData.status = status;
  
        // Realizar la actualización en la base de datos
        const updatedReservation = await prisma.reservation.update({
            where: { id: Number(params.id) },
            data: updateData,
        });
  
        return NextResponse.json(updatedReservation);
    } catch (error) {
        // Manejar errores específicos de Prisma
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