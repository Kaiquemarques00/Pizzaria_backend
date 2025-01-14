import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface IUserRequest{
    name: string;
    email: string;
    password: string;
}

export class CreateUserService {

    async execute({name, email, password}: IUserRequest) {

        if(!email) throw new Error("Email incorrect");

        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        });

        if (userAlreadyExists) throw new Error("User already exists");

        if (password.length < 8) throw new Error("Password must be 8 characters");

        const passwordHash = await hash(password, 8)

        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email, 
                password: passwordHash
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        return user
    }
}