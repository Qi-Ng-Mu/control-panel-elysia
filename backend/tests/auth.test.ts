import { describe, expect, test } from "bun:test";

const setupEnv = () => {
  process.env.PORT = "3000";
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL = "mysql://root:pass@127.0.0.1:3306/control_panel";
  process.env.JWT_SECRET = "test";
  process.env.REFRESH_TOKEN_SECRET = "test";
  process.env.ACCESS_TOKEN_TTL = "3600";
  process.env.REFRESH_TOKEN_TTL = "7200";
  process.env.REDIS_URL = "redis://localhost:6379/0";
  process.env.CACHE_TTL_SECONDS = "60";
  process.env.CACHE_KEY_PREFIX = "control-panel:test";
  process.env.CORS_ORIGIN = "http://localhost";
  process.env.COOKIE_SECURE = "false";
  process.env.COOKIE_SAMESITE = "Lax";
};

setupEnv();

const auth = await import("../src/lib/auth");

const payload = { userId: 1, tenantId: 1, roleCodes: ["super_admin"] };

describe("auth tokens", () => {
  test("access token roundtrip", async () => {
    const token = await auth.signAccessToken(payload);
    const decoded = await auth.verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.tenantId).toBe(payload.tenantId);
  });

  test("refresh token roundtrip", async () => {
    const token = await auth.signRefreshToken(payload);
    const decoded = await auth.verifyRefreshToken(token);
    expect(decoded.roleCodes[0]).toBe("super_admin");
  });
});

describe("password hash", () => {
  test("verify password", async () => {
    const hash = await auth.hashPassword("demo");
    const result = await auth.verifyPassword("demo", hash);
    expect(result).toBe(true);
  });
});
