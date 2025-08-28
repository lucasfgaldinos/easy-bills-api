import type { FastifyInstance } from "fastify";
import { categoryRoutes } from "./category.routes";

export async function routes(fastify: FastifyInstance): Promise<void> {
	fastify.get("/alive", async () => {
		return {
			status: "Ok",
			message: "EasyBills API está em produção.",
		};
	});

	fastify.register(categoryRoutes, { prefix: "/categories" });
}
