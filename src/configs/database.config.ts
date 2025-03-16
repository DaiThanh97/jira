import { DataSource } from "typeorm";
import { Enviroment } from "../utils/environment";

const isDev = Enviroment.NODE_ENV === "development";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Enviroment.DB_HOST,
  port: Number(Enviroment.DB_PORT),
  username: Enviroment.DB_USERNAME,
  password: Enviroment.DB_PASSWORD,
  database: Enviroment.DB_NAME,
  synchronize: isDev,
  logging: isDev,
  entities: ["**/*.entity.ts"],
});
