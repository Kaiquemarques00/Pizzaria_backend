import { DetailsUserService } from "../../../src/services/user/DetailsUserService";
import prismaClient from "../../../src/prisma/index";


jest.mock("../../../src/prisma/index", () => ({
  user: {
    findFirst: jest.fn()
  },
}));

describe("DetailsUserService", () => {
    let detailsUserService: DetailsUserService;
  
    beforeEach(() => {
      detailsUserService = new DetailsUserService();
    });
  
    it("should return user details when user is found", async () => {
      // Arrange: Preparar o mock do retorno do findFirst
      const mockUser = {
        id: "123",
        name: "John Doe",
        email: "john@example.com",
      };
      (prismaClient.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      const user_id = "123";
  
      // Act: Chamar o método execute
      const result = await detailsUserService.execute(user_id);
  
      // Assert: Verificar se o método findFirst foi chamado corretamente e se o retorno é o esperado
      expect(prismaClient.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: user_id,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      expect(result).toEqual(mockUser);
    });
  
    it("should throw an error if user is not found", async () => {
      // Arrange: Preparar o mock do retorno do findFirst com um valor nulo
      (prismaClient.user.findFirst as jest.Mock).mockResolvedValue(null);
      const user_id = "123";
  
      // Act e Assert: Verificar se o erro é lançado quando o usuário não é encontrado
      await expect(detailsUserService.execute(user_id)).rejects.toThrow("User Not found!");
    });
  });