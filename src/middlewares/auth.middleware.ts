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
	const authHeader =
		"Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImUzZWU3ZTAyOGUzODg1YTM0NWNlMDcwNTVmODQ2ODYyMjU1YTcwNDYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTHVjYXMgR2FsZGlubyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJWnVGeXBHMUpYVHVabHVFajBRTmYzZkZGdkE1clJEblVPSFdlR1JvMi1jS3IzX2ZFPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Vhc3liaWxscy0xZjNkYiIsImF1ZCI6ImVhc3liaWxscy0xZjNkYiIsImF1dGhfdGltZSI6MTc1NzQ1MzA4OSwidXNlcl9pZCI6Ik11OHlNM2pDQ3JPVVFxNUxFdkxJWm5wVUZkcDIiLCJzdWIiOiJNdTh5TTNqQ0NyT1VRcTVMRXZMSVpucFVGZHAyIiwiaWF0IjoxNzU3NDUzMDg5LCJleHAiOjE3NTc0NTY2ODksImVtYWlsIjoibHVmZWc0czFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDc0NjIzNjk4ODc4OTIwMDg3MzkiXSwiZW1haWwiOlsibHVmZWc0czFAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.ePXvldu8VUmFyooJHR7Ew6b5Ahjzn0Iz0wBuNJw7_RVyUUvGVkBNEPcIZzg68g3qoNGYfFqfG7u0VRFi74Mwu_AmyGHck7xKsgdd9A-LKPR1txma1NwUvDNCmvGwgKw7uM1WU8wYEHeV0I8uKVwTQtezbHKO9IFdsTKdWLWeCE1x6muWqAm4r1I4Q1tCXbV7L8fQhAy5f_h-GJJ4yPBkbSLCWc_7E_zZn7LXcXq-3yWBHQIncS2pzB_4TW-6zF2G_9X4yUIQ1PguPv7eW0CBnZwy6VynUnC1b_4fUApIwbNjIMgJopkdngzlVbPzujJ2ZY8rpMRMjwaMH3YE7pdgPw";

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
