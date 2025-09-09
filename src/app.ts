import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import fastify from "fastify";
import { env } from "./config/env.config";
import { routes } from "./routes";

export const app: FastifyInstance = fastify({
	logger: {
		level: env.NODE_ENV === "dev" ? "info" : "error",
	},
});

app.register(cors);

app.register(routes, { prefix: "api" });
