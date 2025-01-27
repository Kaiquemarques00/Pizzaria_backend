import { DetailsUserController } from "../../../src/controllers/user/DetailsUserController";
import { Request, Response } from "express";
import { DetailsUserService } from "../../../src/services/user/DetailsUserService";


// Mocking the DetailsUserService
jest.mock('../../../src/services/user/DetailsUserService');

describe("DetailsUserController", () => {
    let detailsUserController: DetailsUserController;
    let mockDetailsUserService: jest.Mocked<DetailsUserService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
  
    beforeEach(() => {
      // Instantiate the controller
      detailsUserController = new DetailsUserController();
  
      // Mock the service
      mockDetailsUserService = new DetailsUserService() as jest.Mocked<DetailsUserService>;
      (DetailsUserService.prototype.execute as jest.Mock) = jest.fn(); // Mock the method
  
      // Mock Request and Response
      mockRequest = {
        user_id: "test_user_id", // Manually set user_id
      };
      mockJson = jest.fn();
      mockResponse = {
        json: mockJson,
      };
    });
  
    it("should return user details", async () => {
      // Expected data
      const expectedUser = { id: "test_user_id", name: "John Doe" };
      (DetailsUserService.prototype.execute as jest.Mock).mockResolvedValue(expectedUser);
  
      // Call the handle method
      await detailsUserController.handle(
        mockRequest as Request,
        mockResponse as Response
      );
  
      // Assertions
      expect(DetailsUserService.prototype.execute).toHaveBeenCalledWith("test_user_id");
      expect(mockJson).toHaveBeenCalledWith(expectedUser);
    });
  });