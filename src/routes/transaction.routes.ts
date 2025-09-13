import type { FastifyInstance } from "fastify";
import {
	createTransaction,
	deleteTransaction,
	getTransactions,
	getTransactionsSummary,
} from "../controllers";
import { getTransactionsByMonths } from "../controllers/transaction/getTransactionsHistorical.controller";
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

	// Transações com filtros
	fastify.route({
		method: "GET",
		url: "/",
		handler: getTransactions,
	});

	// Resumo das transações
	fastify.route({
		method: "GET",
		url: "/summary",
		handler: getTransactionsSummary,
	});

	// Histórico semestral de transações
	fastify.route({
		method: "GET",
		url: "/historical",
		handler: getTransactionsByMonths,
	});

	// Deletar transação
	fastify.route({
		method: "DELETE",
		url: "/:transactionId",
		handler: deleteTransaction,
	});
}
