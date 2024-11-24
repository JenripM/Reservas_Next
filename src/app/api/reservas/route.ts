import { NextResponse } from "next/server";
import {prisma} from '@/libs/prisma'

export  async function GET(){
    const reservas = await prisma.reservation.findMany()
    return NextResponse.json(reservas)
}

export async function POST(request: Request) {
    try {
        const { clientName, partySize, date, status } = await request.json();

        if (!clientName || !partySize || !date) {
            return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
        }

        const newReservation = await prisma.reservation.create({
            data: {
                clientName,
                partySize,
                date: new Date(date), 
                status,
            },
        });

        return NextResponse.json(newReservation);
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        return NextResponse.json({ error: "Error al crear la reserva" }, { status: 500 });
    }
}