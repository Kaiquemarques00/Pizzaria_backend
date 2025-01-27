import { CreateUserController } from "../../../src/controllers/user/CreateUserController"; 
import { Request, Response } from "express";
import { CreateUserService } from "../../../src/services/user/CreateUserService";

// Mockando o serviço CreateUserService
jest.mock("../../../src/services/user/CreateUserService");

describe("CreateUserController", () => {
    let createUserController: CreateUserController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let createUserServiceMock: jest.Mocked<CreateUserService>;

    beforeEach(() => {
        createUserController = new CreateUserController();
        mockRequest = {
            body: {
                name: "John Doe",
                email: "john@example.com",
                password: "password123"
            }
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        // Garantindo que o mock do CreateUserService esteja sendo configurado corretamente
        createUserServiceMock = new CreateUserService() as jest.Mocked<CreateUserService>;
        (CreateUserService.prototype.execute as jest.Mock) = jest.fn(); // Mock do método execute
    });

    it("should create a user and return a 201 status with user data", async () => {
        // Arrange: Setup do mock
        const user = {
            id: "1",
            name: "John Doe",
            email: "john@example.com"
        };
        
        // Mockando o comportamento de 'execute'
        (CreateUserService.prototype.execute as jest.Mock).mockResolvedValue(user);

        // Act: Chamada do método handle
        await createUserController.handle(mockRequest as Request, mockResponse as Response);

        // Assert: Verificando se o status e o retorno da resposta estão corretos
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith(user);
    });

    it("should return an error if the user creation fails", async () => {
        // Arrange: Mock de erro no serviço
        (CreateUserService.prototype.execute as jest.Mock).mockResolvedValue(new Error('User creation failed'));

        // Act: Chamada do método handle
        await createUserController.handle(mockRequest as Request, mockResponse as Response);

        // Assert: Verificando se o status e o erro são gerados
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ message: "User creation failed" }));
    });
});