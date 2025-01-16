import prismaClient from "../../prisma";

export class ListCategoryService {
    async execute() {
        const category = await prismaClient.category.findMany({
            select: {
                id: true,
                name: true
            }
        });

        if (!category) throw new Error("Categories Not found!");

        return category;
    }
}