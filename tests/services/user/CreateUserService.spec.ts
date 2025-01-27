import { CreateUserService } from "../../../src/services/user/CreateUserService";
import prismaClient from "../../../src/prisma/index";
import { hash } from "bcryptjs";

// Mock do Prisma Client
jest.mock("../../../src/prisma/index", () => ({
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock do bcryptjs
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

describe("CreateUserService", () => {
  let createUserService: CreateUserService;

  beforeEach(() => {
    createUserService = new CreateUserService();
  });

  it("should throw an error if email is not provided", async () => {
    // Arrange
    const userData = {
      name: "John Doe",
      email: "",
      password: "password123",
    };

    // Act & Assert
    await expect(createUserService.execute(userData)).rejects.toThrow("Email incorrect");
  });

  it("should throw an error if the user already exists", async () => {
    // Arrange
    const existingUser = {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
    };
    (prismaClient.user.findFirst as jest.Mock).mockResolvedValue(existingUser);

    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    };

    // Act & Assert
    await expect(createUserService.execute(userData)).rejects.toThrow("User already exists");
  });

  it("should throw an error if password is less than 8 characters", async () => {
    // Arrange
    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "short", // Senha inválida (menor que 8 caracteres)
    };
    (prismaClient.user.findFirst as jest.Mock).mockResolvedValue(null);

    // Act & Assert
    await expect(createUserService.execute(userData)).rejects.toThrow("Password must be 8 characters");
  });

  it("should create a new user successfully", async () => {
    // Arrange
    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    };

    // Mockando o comportamento do hash
    (hash as jest.Mock).mockResolvedValue("hashedPassword");

    // Simulando a criação do usuário
    (prismaClient.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
    });

    // Act
    const user = await createUserService.execute(userData);

    // Assert
    expect(user).toEqual({
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
    });

    expect(prismaClient.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "John Doe",
          email: "johndoe@example.com",
          password: "hashedPassword", // Verifica se o hash foi aplicado
        }),
      })
    );
  });
});
