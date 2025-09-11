import type { FastifyInstance } from "fastify";
import { getCategories } from "../controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

export async function categoryRoutes(fastify: FastifyInstance): Promise<void> {
	fastify.addHook("preHandler", authMiddleware);

	fastify.get("/", getCategories);
}
