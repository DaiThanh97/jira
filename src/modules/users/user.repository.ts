import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { Service } from "typedi";

@Service()
export class UserRepository extends Repository<UserEntity> {
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({
      where: {
        email,
      },
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.findOne({
      where: {
        id,
      },
    });
  }
}
