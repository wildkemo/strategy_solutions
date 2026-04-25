import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client singleton utility.
 * 
 * This ensures only one instance of PrismaClient is created and reused
 * throughout the application, preventing exhaustion of database connections.
 */
const prisma = new PrismaClient();

export default prisma;
