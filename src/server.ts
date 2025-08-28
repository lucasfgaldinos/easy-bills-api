import dotenv from "dotenv";
import { app } from "./app";
import { prismaConnect } from "./config/prisma";
import { initializeGlobalCategories } from "./services/globalCategories.service";

dotenv.config();

const PORT = Number(process.env.PORT);

async function startServer() {
	try {
		await prismaConnect();

		await initializeGlobalCategories();

		await app
			.listen({ port: PORT })
			.then(() => console.log(`Server is running on port ${PORT} 🚀`));
	} catch (err) {
		console.error(err);
	}
}

startServer();
