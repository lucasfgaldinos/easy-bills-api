import type { FastifyInstance } from "fastify";
import { createTransaction, getTransactions } from "../controllers";

export async function transactionRoutes(
	fastify: FastifyInstance,
): Promise<void> {
	// Criar nova transação
	fastify.route({
		method: "POST",
		url: "/",
		handler: createTransaction,
	});

	// Buscar transações com filtros
	fastify.route({
		method: "GET",
		url: "/",
		handler: getTransactions,
	});
}
