import { Service } from "typedi";
import jwt from "jsonwebtoken";
import { LoginPayloadType, RegisterPayloadType } from "./auth.validation";
import { UserService } from "../users/user.service";
import { BadRequestException } from "../../utils/error";
import { hashValue } from "../../utils/bcrypt";
import { IJwtPayload, ILoginResponse } from "./auth.interface";
import { Enviroment } from "../../utils/environment";

@Service()
export class AuthService {
  constructor(private userService: UserService) {}

  async register({
    email,
    name,
    password,
  }: RegisterPayloadType): Promise<boolean> {
    const existingUser = await this.userService.getUserByEmail(email);

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    // Hash password
    const hashedPassword = await hashValue(password);

    // Save user to database
    const createdUser = await this.userService.createUser(
      email,
      name,
      hashedPassword
    );

    return !!createdUser;
  }

  async login({ email, password }: LoginPayloadType): Promise<ILoginResponse> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException("Invalid email or password");
    }

    // Compare password
    const isPasswordMatch = await user.checkPassword(password);
    if (!isPasswordMatch) {
      throw new BadRequestException("Invalid email or password");
    }

    const payload: IJwtPayload = {
      id: user.id,
      email,
    };

    // Provide token
    const accessToken = jwt.sign(payload, Enviroment.JWT_SECRET_KEY, {
      expiresIn: "10h",
    });

    return {
      accessToken,
      email: user.email,
      id: user.id,
      name: user.name,
    };
  }
}
