import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";
import {
	type CreateTransaction,
	createTransactionSchema,
} from "../../schemas/transaction.schema";

export async function createTransaction(
	request: FastifyRequest<{ Body: CreateTransaction }>,
	reply: FastifyReply,
): Promise<void> {
	const { userId } = request;

	if (!userId) {
		return reply
			.status(StatusCodes.UNAUTHORIZED)
			.send({ error: "Unauthenticated user." });
	}

	const bodyValidationResult = createTransactionSchema.safeParse(request.body);

	if (!bodyValidationResult.success) {
		const errorMessage = bodyValidationResult.error.errors[0];

		return reply
			.status(StatusCodes.BAD_REQUEST)
			.send({ error: `${errorMessage.path}: ${errorMessage.message}` });
	}

	const transaction = bodyValidationResult.data;

	try {
		const categoryExists = await prisma.category.findFirst({
			where: {
				id: transaction.categoryId,
				type: transaction.type,
			},
		});

		if (!categoryExists) {
			return reply
				.status(StatusCodes.BAD_REQUEST)
				.send({ error: "Invalid category." });
		}

		const parsedDate = new Date(transaction.date);

		const newTransaction = await prisma.transaction.create({
			data: {
				...transaction,
				userId: userId,
				date: parsedDate,
			},
			include: {
				category: true,
			},
		});

		return reply.status(StatusCodes.CREATED).send(newTransaction);
	} catch (err) {
		request.log.error(
			err,
			"Something went wrong while creating new transaction.",
		);
		return reply
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send({ error: "Something went wrong while creating new transaction." });
	}
}
