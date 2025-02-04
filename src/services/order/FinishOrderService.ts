import prismaClient from "../../prisma";

interface IOrderRequest {
    order_id: string;
}

export class FinishOrderService {
    async execute({ order_id }: IOrderRequest) {

        const order = await prismaClient.order.update({
            data: {
                status: true
            },
            where: {
                id: order_id
            }
        });

        return order
    }
}