import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { ok, fail } from "../lib/response";
import { parsePagination } from "../lib/pagination";
import { authDecorator } from "../plugins/auth";
import { requirePermission } from "../plugins/permission";

const resolveTenantIds = (auth: { tenantId: number; isSuperAdmin: boolean }) => {
  const ids = [1, auth.tenantId];
  return auth.isSuperAdmin ? Array.from(new Set(ids)) : ids;
};

export const dictionaryRoutes = new Elysia({ prefix: "/dictionary" })
  .use(authDecorator)
  .guard(requirePermission("dictionary.manage"), (app) =>
    app.get("/groups", async ({ auth, query }) => {
    const { skip, take } = parsePagination(query);
    const keyword = query.keyword?.trim();
    const tenantIds = resolveTenantIds(auth!);

    const where = {
      tenantId: { in: tenantIds },
      deletedAt: null,
      ...(keyword
        ? { OR: [{ name: { contains: keyword } }, { code: { contains: keyword } }] }
        : {})
    };

    const [total, items] = await Promise.all([
      prisma.dictionaryGroup.count({ where }),
      prisma.dictionaryGroup.findMany({ where, skip, take, orderBy: { id: "desc" } })
    ]);

    return ok({ total, items });
  })
  .post(
    "/groups",
    async ({ auth, body }) => {
      const tenantId = auth!.isSuperAdmin && body.tenantId !== undefined ? body.tenantId : auth!.tenantId;

      const group = await prisma.dictionaryGroup.create({
        data: {
          tenantId,
          name: body.name,
          code: body.code,
          description: body.description,
          order: body.order ?? 0,
          isActive: body.isActive ?? true,
          createdBy: auth!.userId
        }
      });

      return ok(group);
    },
    {
      body: t.Object({
        tenantId: t.Optional(t.Number()),
        name: t.String(),
        code: t.String(),
        description: t.Optional(t.String()),
        order: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean())
      })
    }
  )
  .get("/items", async ({ auth, query }) => {
    const { skip, take } = parsePagination(query);
    const tenantIds = resolveTenantIds(auth!);
    const groupId = query.groupId ? Number(query.groupId) : undefined;

    const where = {
      tenantId: { in: tenantIds },
      deletedAt: null,
      ...(groupId ? { groupId } : {})
    };

    const [total, items] = await Promise.all([
      prisma.dictionaryItem.count({ where }),
      prisma.dictionaryItem.findMany({ where, skip, take, orderBy: { id: "desc" } })
    ]);

    return ok({ total, items });
  })
  .post(
    "/items",
    async ({ auth, body, set }) => {
      const group = await prisma.dictionaryGroup.findFirst({
        where: { id: body.groupId, deletedAt: null }
      });
      if (!group) {
        set.status = 404;
        return fail("字典组不存在");
      }

      const tenantId = auth!.isSuperAdmin && body.tenantId !== undefined ? body.tenantId : auth!.tenantId;

      const item = await prisma.dictionaryItem.create({
        data: {
          tenantId,
          groupId: body.groupId,
          label: body.label,
          value: body.value,
          order: body.order ?? 0,
          isActive: body.isActive ?? true,
          description: body.description,
          createdBy: auth!.userId
        }
      });

      return ok(item);
    },
    {
      body: t.Object({
        tenantId: t.Optional(t.Number()),
        groupId: t.Number(),
        label: t.String(),
        value: t.String(),
        description: t.Optional(t.String()),
        order: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean())
      })
    }
  ));
