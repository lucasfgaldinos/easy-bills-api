import type { FastifyInstance } from "fastify";
import fastify from "fastify";
import { routes } from "./routes";

export const app: FastifyInstance = fastify({
	logger: true,
});

app.register(routes, { prefix: "api" });
