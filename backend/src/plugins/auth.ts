import { Elysia } from "elysia";
import { prisma } from "../db";
import { fail } from "../lib/response";
import { verifyAccessToken } from "../lib/auth";
import { resolveDataScope } from "../lib/data-scope";

export type AuthInfo = {
  userId: number;
  tenantId: number;
  roleCodes: string[];
  isSuperAdmin: boolean;
  dataScope: ReturnType<typeof resolveDataScope>;
  departmentId: number | null;
  permissionCodes: string[];
};

type AuthContext = { auth?: AuthInfo | null; set: { status?: number | string } };

export const authDecorator = new Elysia({ name: "auth-decorator" }).decorate(
  "auth",
  null as AuthInfo | null
);

const parseTenantHeader = (value: string | undefined) => {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
};

export const authPlugin = new Elysia({ name: "auth" })
  .decorate("auth", null as AuthInfo | null)
  .derive(async ({ headers }) => {
    const header = headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return { auth: null };
    }

    const token = header.slice("Bearer ".length).trim();
    if (!token) {
      return { auth: null };
    }

    try {
      const payload = await verifyAccessToken(token);
      const user = await prisma.user.findFirst({
        where: { id: payload.userId, deletedAt: null },
        include: { roles: { include: { role: true } } }
      });

      if (!user || !user.isActive) {
        return { auth: null };
      }

      const roleCodes = user.roles.map((item) => item.role.code);
      const roleIds = user.roles.map((item) => item.roleId);
      const isSuperAdmin = roleCodes.includes("super_admin");
      const headerTenantId = parseTenantHeader(headers["x-tenant-id"] as string | undefined);
      const tenantId = isSuperAdmin && headerTenantId !== null ? headerTenantId : user.tenantId;
      const dataScope = resolveDataScope(user.roles.map((item) => item.role));

      const permissionCodes = isSuperAdmin
        ? ["*"]
        : Array.from(
            new Set(
              (
                await prisma.rolePermission.findMany({
                  where: { tenantId, roleId: { in: roleIds } },
                  include: { permission: true }
                })
              ).map((item) => item.permission.code)
            )
          );

      // 超级管理员可切换租户上下文，普通用户固定使用自身租户
      return {
        auth: {
          userId: user.id,
          tenantId,
          roleCodes,
          isSuperAdmin,
          dataScope,
          departmentId: user.departmentId,
          permissionCodes
        }
      };
    } catch {
      return { auth: null };
    }
  });

export const requireAuth = () => ({
  beforeHandle(context: AuthContext) {
    const { auth, set } = context;
    if (!auth) {
      set.status = 401;
      return fail("未登录");
    }
    return null;
  }
});
