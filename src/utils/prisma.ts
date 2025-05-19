import { PrismaClient } from '@prisma/client'

// In Development, to prevent additional, unwanted instances (hot reloading) of PrismaClient
// Store PrismaClient as global variable

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma || new PrismaClient()

// In Production, only created one PrismaClient
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma