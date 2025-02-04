import prismaClient from "../../prisma";

interface ISendRequest {
    order_id: string;
}

export class SendOrderService {
    async execute({ order_id }: ISendRequest) {

        const order = await prismaClient.order.update({
            data: {
                draft: false
            },
            where: {
                id: order_id
            }
        });

        return order
    }
}