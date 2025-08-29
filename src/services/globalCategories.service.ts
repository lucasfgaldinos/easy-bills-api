import { type Category, TransactionType } from "@prisma/client";
import { prisma } from "../config/prisma.config";

type GlobalCategoryInput = Pick<Category, "name" | "color" | "type">;

const globalCategories: GlobalCategoryInput[] = [
	// Despesas
	{ name: "Alimentação", color: "#FF5733", type: TransactionType.expense },
	{ name: "Transporte", color: "#33A8FF", type: TransactionType.expense },
	{ name: "Moradia", color: "#33FF57", type: TransactionType.expense },
	{ name: "Saúde", color: "#F033FF", type: TransactionType.expense },
	{ name: "Educação", color: "#FF3366", type: TransactionType.expense },
	{ name: "Lazer", color: "#FFBA33", type: TransactionType.expense },
	{ name: "Compras", color: "#33FFF6", type: TransactionType.expense },
	{ name: "Outro", color: "#B033FF", type: TransactionType.expense },

	// Receitas
	{ name: "Salário", color: "#33FF57", type: TransactionType.income },
	{ name: "Freelance", color: "#33A8FF", type: TransactionType.income },
	{ name: "Investimento", color: "#FFBA33", type: TransactionType.income },
	{ name: "Outro", color: "#B033FF", type: TransactionType.income },
];

export async function initializeGlobalCategories(): Promise<Category[]> {
	const createdCategories: Category[] = [];

	for (const category of globalCategories) {
		try {
			const categoryExists = await prisma.category.findFirst({
				where: {
					name: category.name,
					type: category.type,
				},
			});

			if (!categoryExists) {
				const newCategory = await prisma.category.create({
					data: category,
				});
				createdCategories.push(newCategory);
				console.log(`✔️ Category created: ${newCategory.name}`);
			} else {
				createdCategories.push(categoryExists);
			}
		} catch (_) {
			console.error("❌ Error creating category!");
		}
	}

	console.log("✅ Initialized categories!");

	return createdCategories;
}
