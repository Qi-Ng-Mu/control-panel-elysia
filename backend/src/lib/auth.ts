import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../config/env";

export type AuthTokenPayload = {
  userId: number;
  tenantId: number;
  roleCodes: string[];
};

type JwtPayload = AuthTokenPayload & { exp: number; iat: number };

const toSeconds = (value: string) => {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    throw new Error("Invalid token ttl");
  }
  return seconds;
};

const base64Url = (input: string) => Buffer.from(input).toString("base64url");

const sign = (value: string, secret: string) =>
  createHmac("sha256", secret).update(value).digest();

const buildToken = (payload: JwtPayload, secret: string) => {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Url(JSON.stringify(payload));
  const signature = sign(`${header}.${body}`, secret).toString("base64url");
  return `${header}.${body}.${signature}`;
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) {
    throw new Error("Invalid token");
  }

  const expected = sign(`${header}.${body}`, secret).toString("base64url");
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    throw new Error("Invalid token");
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as JwtPayload;
  if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
};

export const signAccessToken = async (payload: AuthTokenPayload) => {
  const expiresIn = toSeconds(env.accessTokenTtl);
  const now = Math.floor(Date.now() / 1000);
  // 生成访问令牌，包含过期时间与签发时间
  return buildToken({ ...payload, exp: now + expiresIn, iat: now }, env.jwtSecret);
};

export const signRefreshToken = async (payload: AuthTokenPayload) => {
  const expiresIn = toSeconds(env.refreshTokenTtl);
  const now = Math.floor(Date.now() / 1000);
  // 生成刷新令牌，周期长于访问令牌
  return buildToken({ ...payload, exp: now + expiresIn, iat: now }, env.refreshTokenSecret);
};

export const verifyAccessToken = async (token: string): Promise<AuthTokenPayload> => {
  const payload = verifyToken(token, env.jwtSecret);
  return payload;
};

export const verifyRefreshToken = async (token: string): Promise<AuthTokenPayload> => {
  const payload = verifyToken(token, env.refreshTokenSecret);
  return payload;
};

export const hashPassword = async (password: string) => Bun.password.hash(password);

export const verifyPassword = async (password: string, hash: string) => Bun.password.verify(password, hash);

export const hashToken = async (token: string) => Bun.password.hash(token);

export const verifyTokenHash = async (token: string, hash: string) => Bun.password.verify(token, hash);
