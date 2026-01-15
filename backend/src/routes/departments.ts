import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { ok, fail } from "../lib/response";
import { authDecorator } from "../plugins/auth";
import { requirePermission } from "../plugins/permission";

export const departmentRoutes = new Elysia({ prefix: "/departments" })
  .use(authDecorator)
  .guard(requirePermission("department.manage"), (app) =>
    app.get("/", async ({ auth }) => {
    const items = await prisma.department.findMany({
      where: { tenantId: auth!.tenantId, deletedAt: null },
      orderBy: { order: "asc" }
    });

    return ok(items);
  })
  .post(
    "/",
    async ({ auth, body }) => {
      const department = await prisma.department.create({
        data: {
          tenantId: auth!.tenantId,
          name: body.name,
          code: body.code,
          order: body.order ?? 0,
          parentId: body.parentId,
          isActive: body.isActive ?? true,
          createdBy: auth!.userId
        }
      });

      return ok(department);
    },
    {
      body: t.Object({
        name: t.String(),
        code: t.Optional(t.String()),
        order: t.Optional(t.Number()),
        parentId: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean())
      })
    }
  )
  .put(
    "/:id",
    async ({ auth, params, body, set }) => {
      const tenantId = auth!.tenantId;
      const department = await prisma.department.findFirst({
        where: { id: Number(params.id), tenantId, deletedAt: null }
      });
      if (!department) {
        set.status = 404;
        return fail("部门不存在");
      }

      const updated = await prisma.department.update({
        where: { id: department.id },
        data: {
          name: body.name,
          code: body.code,
          order: body.order ?? 0,
          parentId: body.parentId,
          isActive: body.isActive ?? true,
          updatedBy: auth!.userId
        }
      });

      return ok(updated);
    },
    {
      body: t.Object({
        name: t.String(),
        code: t.Optional(t.String()),
        order: t.Optional(t.Number()),
        parentId: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean())
      })
    }
  ));
