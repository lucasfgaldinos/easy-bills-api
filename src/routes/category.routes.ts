import type { FastifyInstance } from "fastify";
import { getCategories } from "../controllers/category.controller";

export async function categoryRoutes(fastify: FastifyInstance): Promise<void> {
	fastify.get("/", getCategories);
}
