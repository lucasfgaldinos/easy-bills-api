import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function prismaConnect(): Promise<void> {
	try {
		await prisma.$connect();
		console.log("✅ DB connected successfully!");
	} catch (_err) {
		console.error("❌ Failed to connect to DB!");
	}
}
