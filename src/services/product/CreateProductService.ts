import prismaClient from "../../prisma";

interface IProductRequest{
    name: string;
    price: string;
    description: string;
    banner: string;
    category_id: string;
}

export class CreateProductService {
    async execute({ name, price, description, banner, category_id }: IProductRequest) {
        const productAlreadyExists = await prismaClient.product.findFirst({
            where: {
                name: name
            }
        });

        if (productAlreadyExists) throw new Error('Product already exists');

        const product = await prismaClient.product.create({
            data: {
                name: name,
                price: price,
                description: description,
                banner: banner,
                category_id: category_id
            },
            select: {
                name: true,
                price: true,
                description: true,
                banner: true,
                category_id: true
            }
        });

        return product;
    }
}