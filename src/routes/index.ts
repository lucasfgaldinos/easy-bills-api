import type { FastifyInstance } from "fastify";

export async function routes(fastify: FastifyInstance): Promise<void> {
	fastify.get("/alive", async () => {
		return {
			status: "Ok",
			message: "EasyBills API está em produção.",
		};
	});
}
