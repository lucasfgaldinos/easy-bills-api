import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.config";
import {
	type DeleteTransactionParams,
	deleteTransactionSchema,
} from "../../schemas/transaction.schema";

export async function deleteTransaction(
	request: FastifyRequest<{ Params: DeleteTransactionParams }>,
	reply: FastifyReply,
): Promise<void> {
	const userId = "8sd67fj9a87d9666adf3e"; // Simulando o userId => request.userId

	if (!userId) {
		return reply
			.status(StatusCodes.UNAUTHORIZED)
			.send({ error: "Unauthenticated user." });
	}

	const validation = deleteTransactionSchema.safeParse(request.params);

	if (!validation.success) {
		return reply
			.status(StatusCodes.BAD_REQUEST)
			.send({ error: "TransactionId is not valid." });
	}

	const { transactionId } = validation.data;

	try {
		const transactionExists = await prisma.transaction.findFirst({
			where: {
				userId,
				id: transactionId,
			},
		});

		if (!transactionExists) {
			return reply
				.status(StatusCodes.BAD_REQUEST)
				.send({ error: "Transaction not found." });
		}

		await prisma.transaction.delete({
			where: { id: transactionId },
		});

		return reply
			.status(StatusCodes.OK)
			.send({ message: "Transaction deleted successfully!" });
	} catch (err) {
		request.log.error(err);
		return reply
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send({ error: "Something went wrong while deleting the transaction!" });
	}
}
