import prismaClient from "../../prisma";

interface IOrderRequest {
    table: number;
    name: string;
}

export class CreateOrderService {

    async execute({ table, name }: IOrderRequest) {

        const order = await prismaClient.order.create({
            data: {
                table: table,
                name: name
            }
        });

        return order;
    }
}