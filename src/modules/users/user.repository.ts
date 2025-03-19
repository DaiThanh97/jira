import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { Service } from "typedi";
import { AppDataSource } from "../../configs/database.config";

@Service()
export class UserRepository extends Repository<UserEntity> {
  constructor() {
    super(UserEntity, AppDataSource.manager);
  }

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
