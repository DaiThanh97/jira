const getEnv = (key: string, defaultValue: string = ""): string => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error(`Enviroment variable ${key} is not set`);
  }
  return value;
};

export const Enviroment = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
  DB_HOST: getEnv("DB_HOST", "localhost"),
  DB_PORT: getEnv("DB_PORT", "5432"),
  DB_USERNAME: getEnv("DB_USERNAME", "root"),
  DB_PASSWORD: getEnv("DB_PASSWORD", ""),
  DB_NAME: getEnv("DB_NAME", "todo"),
  JWT_SECRET_KEY: getEnv("JWT_SECRET_KEY", ""),
  JWT_DURATION: getEnv("JWT_DURATION", ""),
};
