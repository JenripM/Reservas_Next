import { PrismaClient } from '@prisma/client';

// Extiende globalThis para que reconozca la propiedad prisma
declare global {
    // Esto permite que `globalThis` tenga una propiedad llamada `prisma`
    var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    // Usamos `let` o `const` para asignar en el ámbito global
    globalThis.prisma = prisma;
}
