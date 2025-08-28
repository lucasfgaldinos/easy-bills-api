import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../config/prisma";

export async function getCategories(
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> {
	try {
		const categories = await prisma.category.findMany({
			orderBy: { name: "asc" },
		});

		reply.code(200).send(categories);
	} catch (err) {
		request.log.error("Something went wrong while searching for categories!");
		reply
			.code(500)
			.send({
				message: "Something went wrong while searching for categories!",
			});
	}
}
