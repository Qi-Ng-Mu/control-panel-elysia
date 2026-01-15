import { Elysia, t } from "elysia";
import { Prisma } from "../generated/client";
import { prisma } from "../db";
import { ok, fail } from "../lib/response";
import { parsePagination } from "../lib/pagination";
import { authDecorator } from "../plugins/auth";
import { requirePermission } from "../plugins/permission";

export const roleRoutes = new Elysia({ prefix: "/roles" })
  .use(authDecorator)
  .guard(requirePermission("role.manage"), (app) =>
    app.get("/", async ({ auth, query }) => {
    const tenantId = auth!.tenantId;
    const { skip, take } = parsePagination(query);
    const keyword = query.keyword?.trim();

    const where = {
      tenantId,
      deletedAt: null,
      ...(keyword
        ? { OR: [{ name: { contains: keyword } }, { code: { contains: keyword } }] }
        : {})
    };

    const [total, items] = await Promise.all([
      prisma.role.count({ where }),
      prisma.role.findMany({ where, skip, take, orderBy: { id: "desc" } })
    ]);

    return ok({ total, items });
  })
  .post(
    "/",
    async ({ auth, body }) => {
      const tenantId = auth!.tenantId;
      const role = await prisma.role.create({
        data: {
          tenantId,
          name: body.name,
          code: body.code,
          description: body.description,
          dataScopeType: body.dataScopeType,
          dataScopeDepartmentIds: body.dataScopeDepartmentIds ?? Prisma.JsonNull,
          isActive: body.isActive ?? true,
          createdBy: auth!.userId
        }
      });

      return ok(role);
    },
    {
      body: t.Object({
        name: t.String(),
        code: t.String(),
        description: t.Optional(t.String()),
        dataScopeType: t.Optional(t.String()),
        dataScopeDepartmentIds: t.Optional(t.Array(t.Number())),
        isActive: t.Optional(t.Boolean())
      })
    }
  )
  .put(
    "/:id",
    async ({ auth, params, body, set }) => {
      const tenantId = auth!.tenantId;
      const role = await prisma.role.findFirst({
        where: { id: Number(params.id), tenantId, deletedAt: null }
      });
      if (!role) {
        set.status = 404;
        return fail("角色不存在");
      }

      const dataScopeDepartmentIds =
        body.dataScopeDepartmentIds ??
        (role.dataScopeDepartmentIds === null
          ? Prisma.JsonNull
          : (role.dataScopeDepartmentIds as Prisma.InputJsonValue));

      const updated = await prisma.role.update({
        where: { id: role.id },
        data: {
          name: body.name,
          code: body.code,
          description: body.description,
          dataScopeType: body.dataScopeType ?? role.dataScopeType,
          dataScopeDepartmentIds,
          isActive: body.isActive ?? role.isActive,
          updatedBy: auth!.userId
        }
      });

      return ok(updated);
    },
    {
      body: t.Object({
        name: t.String(),
        code: t.String(),
        description: t.Optional(t.String()),
        dataScopeType: t.Optional(t.String()),
        dataScopeDepartmentIds: t.Optional(t.Array(t.Number())),
        isActive: t.Optional(t.Boolean())
      })
    }
  )
  .post(
    "/:id/permissions",
    async ({ auth, params, body, set }) => {
      const tenantId = auth!.tenantId;
      const roleId = Number(params.id);
      const role = await prisma.role.findFirst({
        where: { id: roleId, tenantId, deletedAt: null }
      });
      if (!role) {
        set.status = 404;
        return fail("角色不存在");
      }

      await prisma.rolePermission.deleteMany({ where: { tenantId, roleId } });
      await prisma.rolePermission.createMany({
        data: body.permissionIds.map((permissionId) => ({
          tenantId,
          roleId,
          permissionId,
          createdBy: auth!.userId
        }))
      });

      return ok(true);
    },
    { body: t.Object({ permissionIds: t.Array(t.Number()) }) }
  ));
