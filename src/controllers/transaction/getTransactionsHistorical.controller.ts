import dayjs from "dayjs";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";
import {
	type GetTransactionsByMonthsQuery,
	getTransactionsByMonthsSchema,
} from "../../schemas/transaction.schema";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export async function getTransactionsByMonths(
	request: FastifyRequest<{ Querystring: GetTransactionsByMonthsQuery }>,
	reply: FastifyReply,
): Promise<void> {
	const { userId } = request;

	if (!userId) {
		return reply
			.status(StatusCodes.UNAUTHORIZED)
			.send({ error: "Unauthenticated user." });
	}

	const validation = getTransactionsByMonthsSchema.safeParse(request.query);

	if (!validation.success) {
		return reply
			.status(StatusCodes.BAD_REQUEST)
			.send({ error: "Query data is not valid." });
	}

	const { month, year, months = 6 } = validation.data;

	const baseDate = new Date(year, month - 1, 1);

	const startDate = dayjs(baseDate)
		.subtract(months - 1, "month")
		.startOf("month")
		.toDate();
	const endDate = dayjs(baseDate).endOf("month").toDate();

	try {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
			select: {
				amount: true,
				type: true,
				date: true,
			},
		});

		const monthlyData = Array.from({ length: months }, (_, i) => {
			const date = dayjs(baseDate).subtract(months - 1 - i, "month");

			return {
				name: date.format("MMM/YYYY"),
				income: 0,
				expenses: 0,
			};
		});

		transactions.forEach((transaction) => {
			const monthKey = dayjs(transaction.date).format("MMM/YYYY");
			const monthData = monthlyData.find((m) => m.name === monthKey);

			if (monthData) {
				if (transaction.type === "income") {
					monthData.income += transaction.amount;
				} else {
					monthData.expenses += transaction.amount;
				}
			}
		});

		return reply.status(StatusCodes.OK).send({ history: monthlyData });
	} catch (err) {
		request.log.error("Error searching for transactions by months.");
		return reply
			.status(StatusCodes.BAD_REQUEST)
			.send({ error: "Error searching for transactions by months." });
	}
}
