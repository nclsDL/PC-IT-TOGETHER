import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Warm up the database connection on startup (handles Neon cold starts)
prisma
  .$connect()
  .catch(() =>
    setTimeout(() => prisma.$connect().catch(() => {}), 2000)
  );

// Retry wrapper for database cold start / pooler failures
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      // Reconnect before retrying in case the connection was dropped
      await prisma.$disconnect().catch(() => {});
      await prisma.$connect().catch(() => {});
      await new Promise((res) => setTimeout(res, delay * (i + 1)));
    }
  }
  throw new Error("Unreachable");
}
