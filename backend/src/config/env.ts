const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env: ${key}`);
  }
  return value;
};

const parseNumber = (key: string): number => {
  const value = Number(requireEnv(key));
  if (Number.isNaN(value)) {
    throw new Error(`Invalid number env: ${key}`);
  }
  return value;
};

const parseBoolean = (key: string): boolean => {
  const value = requireEnv(key).toLowerCase();
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid boolean env: ${key}`);
};

export const env = {
  port: parseNumber("PORT"),
  nodeEnv: requireEnv("NODE_ENV"),
  databaseUrl: requireEnv("DATABASE_URL"),
  jwtSecret: requireEnv("JWT_SECRET"),
  refreshTokenSecret: requireEnv("REFRESH_TOKEN_SECRET"),
  accessTokenTtl: requireEnv("ACCESS_TOKEN_TTL"),
  refreshTokenTtl: requireEnv("REFRESH_TOKEN_TTL"),
  redisUrl: requireEnv("REDIS_URL"),
  cacheTtlSeconds: parseNumber("CACHE_TTL_SECONDS"),
  cacheKeyPrefix: requireEnv("CACHE_KEY_PREFIX"),
  corsOrigin: requireEnv("CORS_ORIGIN"),
  cookieSecure: parseBoolean("COOKIE_SECURE"),
  cookieSameSite: requireEnv("COOKIE_SAMESITE")
};
