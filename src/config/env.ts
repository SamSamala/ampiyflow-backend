function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

export const ENV = {
  PORT: process.env.PORT || 8080,
  JWT_SECRET: required("JWT_SECRET"),
  META_APP_ID: required("META_APP_ID"),
  META_APP_SECRET: required("META_APP_SECRET"),
  META_REDIRECT_URI: required("META_REDIRECT_URI"),
  FRONTEND_URL: required("FRONTEND_URL"),
  ENCRYPTION_KEY: required("ENCRYPTION_KEY"),
};