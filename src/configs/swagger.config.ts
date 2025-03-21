import { Enviroment } from "../utils/environment";
import YAML from "js-yaml";
import fs from "fs";
import path from "path";

// Load the OpenAPI specification from the YAML file
const swaggerDocument = YAML.load(
  fs.readFileSync(path.join(__dirname, "../../swagger.yaml"), "utf8")
) as Record<string, any>;

// Add dynamic server URL
if (swaggerDocument.servers) {
  swaggerDocument.servers[0].url = `http://localhost:${Enviroment.PORT}${Enviroment.BASE_PATH}`;
}

const swaggerSpec = swaggerDocument;

export default swaggerSpec;
