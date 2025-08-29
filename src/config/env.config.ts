import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	PORT: z.string().transform(Number).default("4000"),
	DATABASE_URL: z.string(),
	NODE_ENV: z.enum(["dev", "test", "prod"]),
});

const envValidation = envSchema.safeParse(process.env);

if (!envValidation.success) {
	console.error("❌ Invalid env, check the information passed in .env.");
	process.exit(1);
}

export const env = envValidation.data;
