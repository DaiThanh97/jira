import { Service } from "typedi";
import { UserRepository } from "./user.repository";
import { UserEntity } from "./user.entity";

@Service()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(email: string, name: string, password): Promise<boolean> {
    const result = await this.userRepository.insert({
      email,
      name,
      password_hash: password,
    });

    return !!result.identifiers[0].id;
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }
}
