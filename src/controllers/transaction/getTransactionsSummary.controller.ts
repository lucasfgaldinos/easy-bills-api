import { TransactionType } from "@prisma/client";
import dayjs from "dayjs";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";
import type { GetTransactionsSummaryQuery } from "../../schemas/transaction.schema";
import type { CategorySummary } from "../../types/category.types";
import type { TransactionSummary } from "../../types/transaction.types";

export async function getTransactionsSummary(
	request: FastifyRequest<{ Querystring: GetTransactionsSummaryQuery }>,
	reply: FastifyReply,
): Promise<void> {
	const userId = "8sd67fj9a87d9666adf3e"; // Simulando o userId => request.userId

	if (!userId) {
		return reply
			.status(StatusCodes.UNAUTHORIZED)
			.send({ error: "Unauthenticated user." });
	}

	const { month, year } = request.query;

	if (!month || !year) {
		return reply
			.status(StatusCodes.BAD_REQUEST)
			.send({ error: "Month and year must be sent." });
	}

	const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
	const endDate = dayjs(startDate).endOf("month").toDate();

	try {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
			include: {
				category: true,
			},
		});

		let totalExpenses = 0;
		let totalIncomes = 0;
		const groupedExpenses = new Map<string, CategorySummary>();

		for (const transaction of transactions) {
			if (transaction.type === TransactionType.expense) {
				const existing = groupedExpenses.get(transaction.categoryId) ?? {
					categoryId: transaction.categoryId,
					categoryName: transaction.category.name,
					categoryColor: transaction.category.color,
					amount: 0,
					percentage: 0,
				};

				existing.amount = Number(
					(transaction.amount + existing.amount).toFixed(2),
				);
				groupedExpenses.set(transaction.categoryId, existing);

				totalExpenses += transaction.amount;
			} else {
				totalIncomes += transaction.amount;
			}
		}

		const summary: TransactionSummary = {
			totalExpenses: Number(totalExpenses.toFixed(2)),
			totalIncomes: Number(totalIncomes.toFixed(2)),
			balance: Number((totalIncomes - totalExpenses).toFixed(2)),
			expensesByCategory: Array.from(groupedExpenses.values())
				.map((expense) => ({
					...expense,
					percentage: Number(
						((expense.amount / totalExpenses) * 100).toFixed(2),
					),
				}))
				.sort((a, b) => b.amount - a.amount),
		};

		return reply.status(StatusCodes.OK).send(summary);
	} catch (err) {
		request.log.error("Error fetching transactions summary!");
		return reply
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send({ error: "Server error." });
	}
}
