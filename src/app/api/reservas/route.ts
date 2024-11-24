import { NextResponse } from "next/server";
import {prisma} from '@/libs/prisma'

export  async function GET(){
    const reservas = await prisma.reservation.findMany()
    return NextResponse.json(reservas)
}

export async function POST(request: Request) {
    try {
        // Parsear los datos de la solicitud
        const { clientName, partySize, date, status } = await request.json();

        // Validar que los datos requeridos estén presentes
        if (!clientName || !partySize || !date) {
            return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
        }

        // Crear una nueva reserva
        const newReservation = await prisma.reservation.create({
            data: {
                clientName,
                partySize,
                date: new Date(date), // Asegúrate de convertir a Date si es necesario
                status, // Opcional, usa el valor predeterminado si no se proporciona
            },
        });

        return NextResponse.json(newReservation);
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        return NextResponse.json({ error: "Error al crear la reserva" }, { status: 500 });
    }
}