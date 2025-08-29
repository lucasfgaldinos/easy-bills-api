import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { z } from "zod";

function isValidObjectId(id: string): boolean {
	return ObjectId.isValid(id);
}

export const createTransactionSchema = z.object({
	description: z.string().min(2, "Must be at least 2 characters long."),
	amount: z.number().positive("Must be a positive number."),
	date: z.coerce.date({
		errorMap: () => ({ message: "Must exist and be valid." }),
	}),
	categoryId: z.string().refine(isValidObjectId, {
		message: "Ivalid categoryId.",
	}),
	type: z.enum([TransactionType.expense, TransactionType.income], {
		errorMap: () => ({ message: "Invalid enum." }),
	}),
});
