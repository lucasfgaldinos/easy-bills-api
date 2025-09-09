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
		"Bearer eyJhbGciOiJSUzI1NiIImtpZCI6ImUzZWU3ZTAyOGUzODg1YTM0NWNlMDcwNTVmODQ2ODYyMjU1YTcwNDYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTHVjYXMgR2FsZGlubyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJWnVGeXBHMUpYVHVabHVFajBRTmYzZkZGdkE1clJEblVPSFdlR1JvMi1jS3IzX2ZFPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Vhc3liaWxscy0xZjNkYiIsImF1ZCI6ImVhc3liaWxscy0xZjNkYiIsImF1dGhfdGltZSI6MTc1NzQ0NDA3OCwidXNlcl9pZCI6Ik11OHlNM2pDQ3JPVVFxNUxFdkxJWm5wVUZkcDIiLCJzdWIiOiJNdTh5TTNqQ0NyT1VRcTVMRXZMSVpucFVGZHAyIiwiaWF0IjoxNzU3NDQ5MTMzLCJleHAiOjE3NTc0NTI3MzMsImVtYWlsIjoibHVmZWc0czFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDc0NjIzNjk4ODc4OTIwMDg3MzkiXSwiZW1haWwiOlsibHVmZWc0czFAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.bUkB-xvViwEKX60woDBXsLWOCOz4ZBdwNxahzmCg_bLarXICLHIaNnMKSaolq6G5DQMPiu8yNUnq9rXqc9C_vAgTA4P1ZSgtQYdxEP2JDEhj8Wf5X9t_xWks86k3cDhJrgERtP2dEIiCyElwQt0fPz851_JxCqqPHlRhtwcHej-xsSfIYhxkpSYee0A6PvTdCuIYur2bBRupbUwGVQYnErBw1iWQo_6ZYYtPhgz0D8_xyiDt3jvnrSzfxPYXfLQFaPDaG_ztP5tVPEQViaObgRmKzUU24CzJUZEIUuNhIACcBoEnQ11p_Rz2T-SolG906jWxT922K9qdZqRBQNXc_A";

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
