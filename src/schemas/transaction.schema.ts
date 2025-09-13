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

export const getTransactionsSchema = z.object({
	month: z.string().optional(),
	year: z.string().optional(),
	type: z
		.enum([TransactionType.expense, TransactionType.income], {
			errorMap: () => ({ message: "Invalid enum." }),
		})
		.optional(),
	categoryId: z
		.string()
		.refine(isValidObjectId, {
			message: "Ivalid categoryId.",
		})
		.optional(),
});

export const getTransactionsSummarySchema = z.object({
	month: z.string(),
	year: z.string(),
});

export const getTransactionsByMonthsSchema = z.object({
	month: z.coerce.number().min(1).max(12),
	year: z.coerce.number().min(2000).max(2100),
	months: z.coerce.number().min(1).max(12).optional(),
});

export const deleteTransactionSchema = z.object({
	transactionId: z.string().refine(isValidObjectId, {
		message: "Ivalid transactionId.",
	}),
});

export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type GetTransactionsSummaryQuery = z.infer<
	typeof getTransactionsSummarySchema
>;
export type GetTransactionsByMonthsQuery = z.infer<
	typeof getTransactionsByMonthsSchema
>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;
