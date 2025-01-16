import prismaClient from "../../prisma";

interface IProductRequest{
    category_id: string;
}

export class ListByCategoryService {
    async execute({ category_id }: IProductRequest) {
        const product = await prismaClient.product.findMany({
            where: {
                category_id: category_id
            },
            select: {
                id: true,
                name: true,
                price: true,
                category_id: true,
                banner: true
            }
        });

        if (product.length === 0) throw new Error("Product Not found!");

        return product;
    }
}