import type { FastifyInstance } from "fastify";
import { createTransaction } from "../controllers/transaction/createTransaction.controller";
import { createTransactionSchema } from "../schemas/transaction.schema";

export async function transactionRoutes(
	fastify: FastifyInstance,
): Promise<void> {
	fastify.route({
		method: "POST",
		url: "/",
		handler: createTransaction,
	});
}
