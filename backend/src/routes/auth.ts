import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { fail, ok } from "../lib/response";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  verifyRefreshToken,
  verifyTokenHash
} from "../lib/auth";
import { env } from "../config/env";
import { authDecorator } from "../plugins/auth";
import type { AuthInfo } from "../plugins/auth";

const parseSeconds = (value: string) => {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    throw new Error("Invalid ttl");
  }
  return seconds;
};

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(authDecorator)
  .post(
    "/login",
    async ({ body, set }) => {
      const tenantId = body.tenantCode
        ? await prisma.tenant
            .findFirst({ where: { code: body.tenantCode, deletedAt: null, isActive: true } })
            .then((tenant) => tenant?.id)
        : 1;

      if (tenantId === undefined) {
        set.status = 400;
        return fail("租户不存在或已停用");
      }

      const user = await prisma.user.findFirst({
        where: { username: body.username, tenantId, deletedAt: null },
        include: { roles: { include: { role: true } } }
      });

      if (!user || !user.isActive) {
        set.status = 401;
        return fail("账号不存在或已禁用");
      }

      const passwordOk = await verifyPassword(body.password, user.passwordHash);
      if (!passwordOk) {
        set.status = 401;
        return fail("账号或密码错误");
      }

      const roleCodes = user.roles.map((item) => item.role.code);
      const payload = { userId: user.id, tenantId: user.tenantId, roleCodes };
      const accessToken = await signAccessToken(payload);
      const refreshToken = await signRefreshToken(payload);
      const refreshTokenHash = await hashToken(refreshToken);
      const expiresAt = new Date(Date.now() + parseSeconds(env.refreshTokenTtl) * 1000);

      await prisma.session.create({
        data: {
          tenantId: user.tenantId,
          userId: user.id,
          refreshTokenHash,
          deviceId: body.deviceId,
          ip: body.ip,
          userAgent: body.userAgent,
          expiresAt
        }
      });

      // 登录成功后签发访问令牌与刷新令牌
      return ok({ accessToken, refreshToken });
    },
    {
      body: t.Object({
        tenantCode: t.Optional(t.String()),
        username: t.String(),
        password: t.String(),
        deviceId: t.Optional(t.String()),
        ip: t.Optional(t.String()),
        userAgent: t.Optional(t.String())
      })
    }
  )
  .post(
    "/refresh",
    async ({ body, set }) => {
      const payload = await verifyRefreshToken(body.refreshToken).catch(() => null);
      if (!payload) {
        set.status = 401;
        return fail("刷新令牌无效");
      }

      const sessions = await prisma.session.findMany({
        where: {
          userId: payload.userId,
          tenantId: payload.tenantId,
          revokedAt: null,
          expiresAt: { gt: new Date() }
        }
      });

      if (sessions.length === 0) {
        set.status = 401;
        return fail("刷新令牌已失效");
      }

      let matched = false;
      for (const session of sessions) {
        if (session.refreshTokenHash && (await verifyTokenHash(body.refreshToken, session.refreshTokenHash))) {
          matched = true;
          break;
        }
      }

      if (!matched) {
        set.status = 401;
        return fail("刷新令牌已失效");
      }

      const accessToken = await signAccessToken({
        userId: payload.userId,
        tenantId: payload.tenantId,
        roleCodes: payload.roleCodes
      });

      return ok({ accessToken });
    },
    {
      body: t.Object({ refreshToken: t.String() })
    }
  )
  .post(
    "/logout",
    async ({ body }) => {
      const payload = await verifyRefreshToken(body.refreshToken).catch(() => null);
      if (!payload) {
        return ok(true, "已退出");
      }

      await prisma.session.updateMany({
        where: {
          userId: payload.userId,
          tenantId: payload.tenantId,
          revokedAt: null
        },
        data: { revokedAt: new Date() }
      });

      return ok(true, "已退出");
    },
    {
      body: t.Object({ refreshToken: t.String() })
    }
  )
  .get("/me", ({ auth }) => {
    if (!auth) {
      return fail("未登录");
    }
    return ok(auth as AuthInfo);
  });
