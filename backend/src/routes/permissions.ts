import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { ok, fail } from "../lib/response";
import { parsePagination } from "../lib/pagination";
import { authDecorator } from "../plugins/auth";
import { requirePermission } from "../plugins/permission";

export const permissionRoutes = new Elysia({ prefix: "/permissions" })
  .use(authDecorator)
  .guard(requirePermission("permission.manage"), (app) =>
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
      prisma.permission.count({ where }),
      prisma.permission.findMany({ where, skip, take, orderBy: { id: "desc" } })
    ]);

    return ok({ total, items });
  })
  .post(
    "/",
    async ({ auth, body }) => {
      const permission = await prisma.permission.create({
        data: {
          tenantId: auth!.tenantId,
          name: body.name,
          code: body.code,
          description: body.description,
          createdBy: auth!.userId
        }
      });

      return ok(permission);
    },
    {
      body: t.Object({
        name: t.String(),
        code: t.String(),
        description: t.Optional(t.String())
      })
    }
  )
  .put(
    "/:id",
    async ({ auth, params, body, set }) => {
      const tenantId = auth!.tenantId;
      const permission = await prisma.permission.findFirst({
        where: { id: Number(params.id), tenantId, deletedAt: null }
      });
      if (!permission) {
        set.status = 404;
        return fail("权限不存在");
      }

      const updated = await prisma.permission.update({
        where: { id: permission.id },
        data: {
          name: body.name,
          code: body.code,
          description: body.description,
          updatedBy: auth!.userId
        }
      });

      return ok(updated);
    },
    {
      body: t.Object({
        name: t.String(),
        code: t.String(),
        description: t.Optional(t.String())
      })
    }
  ));
