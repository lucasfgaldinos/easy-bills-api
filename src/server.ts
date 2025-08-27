import dotenv from "dotenv";
import { app } from "./app";

dotenv.config();

const PORT = Number(process.env.PORT);

async function startServer() {
	try {
		await app
			.listen({ port: PORT })
			.then(() => console.log(`Server is running on port ${PORT} 🚀`));
	} catch (err) {
		console.error(err);
	}
}

startServer();
