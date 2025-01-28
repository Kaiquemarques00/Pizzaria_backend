import { AuthUserService } from "../../../src/services/user/AuthUserService";
import prismaClient from "../../../src/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

jest.mock("../../../src/prisma", () => ({
    user: {
        findFirst: jest.fn()
    }
}));

jest.mock("bcryptjs", () => ({
    compare: jest.fn()
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn()
}));

describe("AuthUserService", () => {
    const authUserService = new AuthUserService();;

    beforeEach(() => {
        jest.clearAllMocks();
      });

    it("should auth a user successfully", async () => {
        const userData = {
            email: 'john@example.com',
            password: 'password123'
        };

        const mockUser = {
            id: "user-id",
            name: "John Doe",
            email: "john@example.com",
            password: "hashedPassword",
        };

        (prismaClient.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

        (compare as jest.Mock).mockResolvedValue(true);

        (sign as jest.Mock).mockReturnValue('fnb2ry8f480b2f10by41024fb8');

        const result = await authUserService.execute(userData);

        expect(prismaClient.user.findFirst).toHaveBeenCalledWith({
            where: { email: "john@example.com" },
          });
          expect(compare).toHaveBeenCalledWith("password123", "hashedPassword");
          expect(sign).toHaveBeenCalledWith(
            { name: "John Doe", email: "john@example.com" },
            process.env.JWT_SECRET,
            { subject: "user-id", expiresIn: "30d" }
          );
        expect(result).toEqual({
            id: "user-id",
            name: "John Doe",
            email: "john@example.com",
            token: "fnb2ry8f480b2f10by41024fb8",
        });
    });

    it("should throw an error if the user is not found", async () => {
        const userData = {
            email: 'invalid@example.com',
            password: 'password123'
        };

        (prismaClient.user.findFirst as jest.Mock).mockResolvedValue(null);

        const result = authUserService.execute(userData);

        await expect(result).rejects.toThrow("User or password incorrect!");
        expect(prismaClient.user.findFirst).toHaveBeenCalledWith({
            where: { email: "invalid@example.com" },
        });
    });

    it("should throw an error if the password is incorrect", async () => {
        const userData = {
            email: 'john@example.com',
            password: 'wrongPassword'
        };

        const mockUser = {
            id: "user-id",
            name: "John Doe",
            email: "john@example.com",
            password: "hashedPassword",
        };

        (prismaClient.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

        (compare as jest.Mock).mockResolvedValue(false);

        const result = authUserService.execute(userData);

        await expect(result).rejects.toThrow("User or password incorrect!");
        expect(prismaClient.user.findFirst).toHaveBeenCalledWith({
            where: { email: "john@example.com" },
        });
        expect(compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
    });
});