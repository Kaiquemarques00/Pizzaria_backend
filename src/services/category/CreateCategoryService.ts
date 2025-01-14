import prismaClient from "../../prisma";

interface ICategoryRequest {
    name: string;
}

export class CreateCategoryService{
    async execute({ name }: ICategoryRequest) {
        if (!name) throw new Error("Name invalid");

        const categoryAlreadyExists = await prismaClient.category.findFirst({
            where: {
                name: name
            }
        });

        if (categoryAlreadyExists) throw new Error("Category already exists"); 

        const category = await prismaClient.category.create({
            data: {
                name: name
            }
        });

        return category;
    }
}