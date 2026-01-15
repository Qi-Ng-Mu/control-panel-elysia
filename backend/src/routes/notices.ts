import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { ok } from "../lib/response";
import { parsePagination } from "../lib/pagination";
import { authDecorator } from "../plugins/auth";
import { requirePermission } from "../plugins/permission";

const resolveTenantIds = (auth: { tenantId: number; isSuperAdmin: boolean }) => {
  const ids = [1, auth.tenantId];
  return auth.isSuperAdmin ? Array.from(new Set(ids)) : ids;
};

export const noticeRoutes = new Elysia({ prefix: "/notices" })
  .use(authDecorator)
  .guard(requirePermission("notice.manage"), (app) =>
    app.get("/templates", async ({ auth, query }) => {
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
      prisma.noticeTemplate.count({ where }),
      prisma.noticeTemplate.findMany({ where, skip, take, orderBy: { id: "desc" } })
    ]);

    return ok({ total, items });
  })
  .post(
    "/templates",
    async ({ auth, body }) => {
      const tenantId = auth!.isSuperAdmin && body.tenantId !== undefined ? body.tenantId : auth!.tenantId;

      const template = await prisma.noticeTemplate.create({
        data: {
          tenantId,
          name: body.name,
          code: body.code,
          content: body.content,
          description: body.description,
          isActive: body.isActive ?? true,
          createdBy: auth!.userId
        }
      });

      return ok(template);
    },
    {
      body: t.Object({
        tenantId: t.Optional(t.Number()),
        name: t.String(),
        code: t.String(),
        content: t.Any(),
        description: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean())
      })
    }
  )
  .get("/", async ({ auth, query }) => {
    const { skip, take } = parsePagination(query);
    const keyword = query.keyword?.trim();

    const where = {
      tenantId: auth!.tenantId,
      deletedAt: null,
      ...(keyword ? { title: { contains: keyword } } : {})
    };

    const [total, items] = await Promise.all([
      prisma.notice.count({ where }),
      prisma.notice.findMany({ where, skip, take, orderBy: { id: "desc" } })
    ]);

    return ok({ total, items });
  })
  .post(
    "/",
    async ({ auth, body }) => {
      const tenantId = auth!.tenantId;
      const notice = await prisma.notice.create({
        data: {
          tenantId,
          templateId: body.templateId,
          title: body.title,
          content: body.content,
          status: body.status ?? "DRAFT",
          publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
          createdBy: auth!.userId
        }
      });

      return ok(notice);
    },
    {
      body: t.Object({
        templateId: t.Optional(t.Number()),
        title: t.String(),
        content: t.Any(),
        status: t.Optional(t.String()),
        publishedAt: t.Optional(t.String())
      })
    }
  ));
