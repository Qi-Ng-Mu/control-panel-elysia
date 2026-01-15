import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { ok, fail } from "../lib/response";
import { parsePagination } from "../lib/pagination";
import { authDecorator } from "../plugins/auth";
import { requirePermission } from "../plugins/permission";

export const positionRoutes = new Elysia({ prefix: "/positions" })
  .use(authDecorator)
  .guard(requirePermission("position.manage"), (app) =>
    app.get("/", async ({ auth, query }) => {
    const { skip, take } = parsePagination(query);
    const keyword = query.keyword?.trim();
    const where = {
      tenantId: auth!.tenantId,
      deletedAt: null,
      ...(keyword
        ? { OR: [{ name: { contains: keyword } }, { code: { contains: keyword } }] }
        : {})
    };

    const [total, items] = await Promise.all([
      prisma.position.count({ where }),
      prisma.position.findMany({ where, skip, take, orderBy: { id: "desc" } })
    ]);

    return ok({ total, items });
  })
  .post(
    "/",
    async ({ auth, body }) => {
      const position = await prisma.position.create({
        data: {
          tenantId: auth!.tenantId,
          name: body.name,
          code: body.code,
          description: body.description,
          isActive: body.isActive ?? true,
          createdBy: auth!.userId
        }
      });

      return ok(position);
    },
    {
      body: t.Object({
        name: t.String(),
        code: t.Optional(t.String()),
        description: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean())
      })
    }
  )
  .put(
    "/:id",
    async ({ auth, params, body, set }) => {
      const tenantId = auth!.tenantId;
      const position = await prisma.position.findFirst({
        where: { id: Number(params.id), tenantId, deletedAt: null }
      });
      if (!position) {
        set.status = 404;
        return fail("岗位不存在");
      }

      const updated = await prisma.position.update({
        where: { id: position.id },
        data: {
          name: body.name,
          code: body.code,
          description: body.description,
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
        description: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean())
      })
    }
  ));
