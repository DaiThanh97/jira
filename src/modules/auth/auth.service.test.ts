import { UserService } from "../users/user.service";
import { AuthService } from "./auth.service";
import jwt from "jsonwebtoken";
import * as bcryptUtils from "./../../utils/bcrypt";
import { UserEntity } from "../users/user.entity";
import { BadRequestException } from "../../utils/error";

jest.mock("jsonwebtoken");
jest.mock("./../../utils/bcrypt");
jest.mock("./../../utils/environment", () => ({
  Enviroment: {},
}));

describe("AuthService", () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    jest.clearAllMocks();

    userService = {
      getUserByEmail: jest.fn(),
      getUserById: jest.fn(),
      createUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    authService = new AuthService(userService);
  });

  describe("register", () => {
    const registerPayload = {
      email: "test@test.com",
      name: "Test User",
      password: "password123",
    };
    const hashedPassword = "hashed_password";

    it("Should register user succesfully", async () => {
      // Prepare
      userService.getUserByEmail.mockResolvedValue(null);
      userService.createUser.mockResolvedValue(true);
      (bcryptUtils.hashValue as jest.Mock).mockResolvedValue(hashedPassword);

      // Actions
      const result = await authService.register(registerPayload);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        registerPayload.email
      );
      expect(bcryptUtils.hashValue).toHaveBeenCalledWith(
        registerPayload.password
      );
      expect(userService.createUser).toHaveBeenCalledWith(
        registerPayload.email,
        registerPayload.name,
        hashedPassword
      );
      expect(result).toBeTruthy();
    });

    it("Should throw Bad Request if email already exists", async () => {
      // Prepare
      const existringUser = {
        id: "user-id",
        email: registerPayload.email,
      } as UserEntity;

      userService.getUserByEmail.mockResolvedValue(existringUser);

      // Actions
      await expect(authService.register(registerPayload)).rejects.toThrow(
        new BadRequestException("Email already exists")
      );
    });
  });

  describe("login", () => {
    const loginPayload = {
      email: "test@test.com",
      password: "password123",
    };

    const mockUser = {
      id: "user-id",
      email: "test@test.com",
      name: "Test User",
      checkPassword: jest.fn().mockImplementation(() => Promise.resolve(true)),
    } as unknown as UserEntity;

    const mockAccessToken = "mock_access_token";

    it("Should login successfully and return access token", async () => {
      // Prepare
      userService.getUserByEmail.mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue(mockAccessToken);

      const result = await authService.login(loginPayload);

      // Assert
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        accessToken: mockAccessToken,
      });
    });

    it("Should throw Bad Request if user does not exist", async () => {
      // Prepare
      userService.getUserByEmail.mockResolvedValue(null);

      // Assert
      await expect(authService.login(loginPayload)).rejects.toThrow(
        new BadRequestException("Invalid email or password")
      );
    });

    it("Should throw Bad Request if password is incorrect", async () => {
      // Prepare
      userService.getUserByEmail.mockResolvedValue(mockUser);
      mockUser.checkPassword = jest.fn().mockResolvedValue(false);

      // Assert
      await expect(authService.login(loginPayload)).rejects.toThrow(
        new BadRequestException("Invalid email or password")
      );

      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});
