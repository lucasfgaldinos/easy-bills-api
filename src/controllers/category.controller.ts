import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";

export async function getCategories(
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> {
	try {
		const categories = await prisma.category.findMany({
			orderBy: { name: "asc" },
		});

		reply.code(StatusCodes.OK).send(categories);
	} catch (err) {
		request.log.error("Something went wrong while searching for categories!");
		reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
			message: "Something went wrong while searching for categories!",
		});
	}
}
