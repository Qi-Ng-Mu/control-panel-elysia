import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { fail, ok } from "../lib/response";
import { parsePagination } from "../lib/pagination";
import { hashPassword } from "../lib/auth";
import { authDecorator } from "../plugins/auth";
import { requirePermission } from "../plugins/permission";

export const tenantRoutes = new Elysia({ prefix: "/tenants" })
  .use(authDecorator)
  .guard(requirePermission("tenant.manage"), (app) =>
    app.get("/", async ({ auth, query }) => {
    if (!auth?.isSuperAdmin) {
      return fail("无权限");
    }

    const { skip, take } = parsePagination(query);
    const keyword = query.keyword?.trim();

    const where = {
      deletedAt: null,
      ...(keyword
        ? {
            OR: [{ name: { contains: keyword } }, { code: { contains: keyword } }]
          }
        : {})
    };

    const [total, items] = await Promise.all([
      prisma.tenant.count({ where }),
      prisma.tenant.findMany({ where, skip, take, orderBy: { id: "desc" } })
    ]);

    return ok({ total, items });
  })
  .post(
    "/",
    async ({ auth, body, set }) => {
      if (!auth?.isSuperAdmin) {
        set.status = 403;
        return fail("无权限");
      }

      const tenant = await prisma.tenant.create({
        data: {
          name: body.name,
          code: body.code,
          isActive: body.isActive ?? true,
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
          createdBy: auth.userId
        }
      });

      return ok(tenant);
    },
    {
      body: t.Object({
        name: t.String(),
        code: t.String(),
        isActive: t.Optional(t.Boolean()),
        expiresAt: t.Optional(t.String())
      })
    }
  )
  .put(
    "/:id",
    async ({ auth, params, body, set }) => {
      if (!auth?.isSuperAdmin) {
        set.status = 403;
        return fail("无权限");
      }

      const tenant = await prisma.tenant.update({
        where: { id: Number(params.id) },
        data: {
          name: body.name,
          code: body.code,
          isActive: body.isActive ?? true,
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
          updatedBy: auth.userId
        }
      });

      return ok(tenant);
    },
    {
      body: t.Object({
        name: t.String(),
        code: t.String(),
        isActive: t.Optional(t.Boolean()),
        expiresAt: t.Optional(t.String())
      })
    }
  )
  .patch(
    "/:id/status",
    async ({ auth, params, body, set }) => {
      if (!auth?.isSuperAdmin) {
        set.status = 403;
        return fail("无权限");
      }

      const tenant = await prisma.tenant.update({
        where: { id: Number(params.id) },
        data: { isActive: body.isActive, updatedBy: auth.userId }
      });

      return ok(tenant);
    },
    { body: t.Object({ isActive: t.Boolean() }) }
  )
  .post(
    "/:id/init-admin",
    async ({ auth, params, body, set }) => {
      if (!auth?.isSuperAdmin) {
        set.status = 403;
        return fail("无权限");
      }

      const tenantId = Number(params.id);
      const tenant = await prisma.tenant.findFirst({ where: { id: tenantId, deletedAt: null } });
      if (!tenant) {
        set.status = 404;
        return fail("租户不存在");
      }

      const passwordHash = await hashPassword(body.password);

      const existingRole = await prisma.role.findFirst({
        where: { tenantId, code: "tenant_admin", deletedAt: null }
      });

      const adminRole =
        existingRole ??
        (await prisma.role.create({
          data: {
            tenantId,
            name: "租户管理员",
            code: "tenant_admin",
            description: "租户默认管理员角色",
            isActive: true,
            createdBy: auth.userId
          }
        }));

      const adminUser = await prisma.user.create({
        data: {
          tenantId,
          username: body.username,
          passwordHash,
          displayName: body.displayName ?? "租户管理员",
          isActive: true,
          createdBy: auth.userId
        }
      });

      await prisma.userRole.create({
        data: {
          tenantId,
          userId: adminUser.id,
          roleId: adminRole.id,
          createdBy: auth.userId
        }
      });

      // 初始化租户管理员账号与默认角色
      return ok({ userId: adminUser.id, roleId: adminRole.id });
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
        displayName: t.Optional(t.String())
      })
    }
  ));
