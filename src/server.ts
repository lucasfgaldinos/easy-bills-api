import { app } from "./app";
import { env } from "./config/env.config";
import { prismaConnect } from "./config/prisma.config";
import { initializeGlobalCategories } from "./services/globalCategories.service";

const PORT = env?.PORT;

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
