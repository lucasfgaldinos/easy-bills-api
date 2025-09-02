import type { FastifyInstance } from "fastify";
import {
	createTransaction,
	deleteTransaction,
	getTransactions,
	getTransactionsSummary,
} from "../controllers";

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
