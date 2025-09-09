import type { FastifyInstance } from "fastify";
import {
	createTransaction,
	deleteTransaction,
	getTransactions,
	getTransactionsSummary,
} from "../controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

export async function transactionRoutes(
	fastify: FastifyInstance,
): Promise<void> {
	fastify.addHook("preHandler", authMiddleware);

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

	// Buscar o resumo das transações
	fastify.route({
		method: "GET",
		url: "/summary",
		handler: getTransactionsSummary,
	});

	// Deletar transação
	fastify.route({
		method: "DELETE",
		url: "/:transactionId",
		handler: deleteTransaction,
	});
}
