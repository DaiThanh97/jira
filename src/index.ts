import "reflect-metadata";
import "dotenv/config";

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { Enviroment } from "./utils/environment";
import { AppDataSource } from "./configs/database.config";
import { errorHandler } from "./middlewares/error-handler.middleware";
import allRoutes from "./routes";
import swaggerSpec from "./configs/swagger.config";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const BASE_PATH = Enviroment.BASE_PATH;

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Swagger UI
    app.use(
      `${BASE_PATH}/api-docs`,
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec)
    );

    // All routes
    // /api/v1/auth
    // /api/v1/organizations
    app.use(BASE_PATH, allRoutes);

    // Error handling
    app.use(errorHandler);

    app.listen(Enviroment.PORT, () => {
      console.log(`🚀 Server is listening on port ${Enviroment.PORT}`);
      console.log(`📝 API Documentation available at ${BASE_PATH}/docs`);
    });
  })
  .catch((err) => console.error(err));
