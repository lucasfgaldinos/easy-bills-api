import dayjs from "dayjs";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";
import type { GetTransactionsQuery } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transaction.types";

export async function getTransactions(
	request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
	reply: FastifyReply,
): Promise<void> {
	const userId = "8sd67fj9a87d9666adf3e"; // Simulando o userId => request.userId

	if (!userId) {
		return reply
			.status(StatusCodes.UNAUTHORIZED)
			.send({ error: "Unauthenticated user." });
	}

	const { month, year, type, categoryId } = request.query;

	const filters: TransactionFilter = { userId };

	if (month && year) {
		const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
		const endDate = dayjs(startDate).endOf("month").toDate();

		filters.date = { gte: startDate, lte: endDate };
	}

	if (type) {
		filters.type = type;
	}

	if (categoryId) {
		filters.categoryId = categoryId;
	}

	try {
		const transactions = await prisma.transaction.findMany({
			where: filters,
			orderBy: { date: "desc" },
			include: {
				category: {
					select: {
						color: true,
						name: true,
						type: true,
					},
				},
			},
		});

		return reply.status(StatusCodes.OK).send(transactions);
	} catch (err) {
		request.log.error("Error fetching transactions!");
		return reply
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send({ error: "Server error." });
	}
}
