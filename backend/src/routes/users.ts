import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { fail, ok } from "../lib/response";
import { parsePagination } from "../lib/pagination";
import { hashPassword } from "../lib/auth";
import { getDepartmentDescendants } from "../lib/department";
import { authDecorator } from "../plugins/auth";
import { requirePermission } from "../plugins/permission";

const buildUserScope = async (tenantId: number, auth: { dataScope: { type: string; departmentIds: number[] }; departmentId: number | null; userId: number }) => {
  switch (auth.dataScope.type) {
    case "ALL":
      return {};
    case "DEPT":
      return auth.departmentId ? { departmentId: auth.departmentId } : { id: auth.userId };
    case "DEPT_AND_CHILD": {
      if (!auth.departmentId) return { id: auth.userId };
      const ids = await getDepartmentDescendants(tenantId, [auth.departmentId]);
      return { departmentId: { in: ids } };
    }
    case "CUSTOM":
      return auth.dataScope.departmentIds.length > 0
        ? { departmentId: { in: auth.dataScope.departmentIds } }
        : { id: auth.userId };
    case "SELF":
    default:
      return { id: auth.userId };
  }
};

export const userRoutes = new Elysia({ prefix: "/users" })
  .use(authDecorator)
  .guard(requirePermission("user.manage"), (app) =>
    app.get("/", async ({ auth, query }) => {
    const tenantId = auth!.tenantId;
    const { skip, take } = parsePagination(query);
    const keyword = query.keyword?.trim();

    const scope = await buildUserScope(tenantId, auth!);
    const where = {
      tenantId,
      deletedAt: null,
      ...(keyword
        ? {
            OR: [
              { username: { contains: keyword } },
              { displayName: { contains: keyword } },
              { email: { contains: keyword } }
            ]
          }
        : {}),
      ...scope
    };

    const [total, items] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { id: "desc" },
        include: { roles: { include: { role: true } }, positions: true }
      })
    ]);

    return ok({ total, items });
  })
  .post(
    "/",
    async ({ auth, body }) => {
      const tenantId = auth!.tenantId;
      const passwordHash = await hashPassword(body.password);

      const user = await prisma.user.create({
        data: {
          tenantId,
          username: body.username,
          email: body.email,
          passwordHash,
          displayName: body.displayName,
          departmentId: body.departmentId,
          isActive: body.isActive ?? true,
          createdBy: auth!.userId
        }
      });

      return ok(user);
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
        email: t.Optional(t.String()),
        displayName: t.Optional(t.String()),
        departmentId: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean())
      })
    }
  )
  .put(
    "/:id",
    async ({ auth, params, body, set }) => {
      const tenantId = auth!.tenantId;
      const user = await prisma.user.findFirst({
        where: { id: Number(params.id), tenantId, deletedAt: null }
      });
      if (!user) {
        set.status = 404;
        return fail("用户不存在");
      }

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: body.email,
          displayName: body.displayName,
          departmentId: body.departmentId,
          isActive: body.isActive ?? user.isActive,
          updatedBy: auth!.userId
        }
      });

      return ok(updated);
    },
    {
      body: t.Object({
        email: t.Optional(t.String()),
        displayName: t.Optional(t.String()),
        departmentId: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean())
      })
    }
  )
  .patch(
    "/:id/status",
    async ({ auth, params, body, set }) => {
      const tenantId = auth!.tenantId;
      const user = await prisma.user.findFirst({
        where: { id: Number(params.id), tenantId, deletedAt: null }
      });
      if (!user) {
        set.status = 404;
        return fail("用户不存在");
      }

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { isActive: body.isActive, updatedBy: auth!.userId }
      });

      return ok(updated);
    },
    { body: t.Object({ isActive: t.Boolean() }) }
  )
  .post(
    "/:id/roles",
    async ({ auth, params, body, set }) => {
      const tenantId = auth!.tenantId;
      const userId = Number(params.id);
      const user = await prisma.user.findFirst({
        where: { id: userId, tenantId, deletedAt: null }
      });
      if (!user) {
        set.status = 404;
        return fail("用户不存在");
      }

      await prisma.userRole.deleteMany({ where: { tenantId, userId } });
      await prisma.userRole.createMany({
        data: body.roleIds.map((roleId) => ({
          tenantId,
          userId,
          roleId,
          createdBy: auth!.userId
        }))
      });

      return ok(true);
    },
    { body: t.Object({ roleIds: t.Array(t.Number()) }) }
  )
  .post(
    "/:id/positions",
    async ({ auth, params, body, set }) => {
      const tenantId = auth!.tenantId;
      const userId = Number(params.id);
      const user = await prisma.user.findFirst({
        where: { id: userId, tenantId, deletedAt: null }
      });
      if (!user) {
        set.status = 404;
        return fail("用户不存在");
      }

      await prisma.userPosition.deleteMany({ where: { tenantId, userId } });
      await prisma.userPosition.createMany({
        data: body.positionIds.map((positionId) => ({
          tenantId,
          userId,
          positionId,
          createdBy: auth!.userId
        }))
      });

      return ok(true);
    },
    { body: t.Object({ positionIds: t.Array(t.Number()) }) }
  ));
