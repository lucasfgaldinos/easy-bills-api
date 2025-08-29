import type { FastifyInstance } from "fastify";
import { categoryRoutes } from "./category.routes";
import { transactionRoutes } from "./transaction.routes";

export async function routes(fastify: FastifyInstance): Promise<void> {
	fastify.get("/alive", async () => {
		return {
			status: "Ok",
			message: "EasyBills API.",
		};
	});

	fastify.register(categoryRoutes, { prefix: "/categories" });
	fastify.register(transactionRoutes, { prefix: "/transactions" });
}
