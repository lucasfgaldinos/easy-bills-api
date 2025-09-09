import type { FastifyReply, FastifyRequest } from "fastify";
import admin from "firebase-admin";
import { StatusCodes } from "http-status-codes";

declare module "fastify" {
	interface FastifyRequest {
		userId?: string;
	}
}

export async function authMiddleware(
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> {
	// const authHeader = request.headers.authorization;
	const authHeader = "token";

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return reply
			.status(StatusCodes.UNAUTHORIZED)
			.send({ error: "Token not provided." });
	}

	const token = authHeader.replace("Bearer ", "");

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);

		request.userId = decodedToken.uid;
	} catch (err) {
		request.log.error("Error verifying token!");
		return reply
			.status(StatusCodes.BAD_REQUEST)
			.send({ error: "Error verifying token!" });
	}
}
