import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { ok, fail } from "../lib/response";
import { parsePagination } from "../lib/pagination";
import { authDecorator } from "../plugins/auth";
import { requirePermission } from "../plugins/permission";

export const menuRoutes = new Elysia({ prefix: "/menus" })
  .use(authDecorator)
  .guard(requirePermission("menu.manage"), (app) =>
    app.get("/", async ({ auth, query }) => {
    const tenantId = auth!.tenantId;
    const { skip, take } = parsePagination(query);
    const keyword = query.keyword?.trim();

    const where = {
      tenantId,
      deletedAt: null,
      ...(keyword
        ? { OR: [{ name: { contains: keyword } }, { path: { contains: keyword } }] }
        : {})
    };

    const [total, items] = await Promise.all([
      prisma.menu.count({ where }),
      prisma.menu.findMany({ where, skip, take, orderBy: { order: "asc" } })
    ]);

    return ok({ total, items });
  })
  .post(
    "/",
    async ({ auth, body }) => {
      const menu = await prisma.menu.create({
        data: {
          tenantId: auth!.tenantId,
          name: body.name,
          path: body.path,
          component: body.component,
          icon: body.icon,
          order: body.order ?? 0,
          isHidden: body.isHidden ?? false,
          isActive: body.isActive ?? true,
          isDirectory: body.isDirectory ?? false,
          parentId: body.parentId,
          permissionId: body.permissionId,
          createdBy: auth!.userId
        }
      });

      return ok(menu);
    },
    {
      body: t.Object({
        name: t.String(),
        path: t.String(),
        component: t.String(),
        icon: t.Optional(t.String()),
        order: t.Optional(t.Number()),
        isHidden: t.Optional(t.Boolean()),
        isActive: t.Optional(t.Boolean()),
        isDirectory: t.Optional(t.Boolean()),
        parentId: t.Optional(t.Number()),
        permissionId: t.Optional(t.Number())
      })
    }
  )
  .put(
    "/:id",
    async ({ auth, params, body, set }) => {
      const tenantId = auth!.tenantId;
      const menu = await prisma.menu.findFirst({ where: { id: Number(params.id), tenantId, deletedAt: null } });
      if (!menu) {
        set.status = 404;
        return fail("菜单不存在");
      }

      const updated = await prisma.menu.update({
        where: { id: menu.id },
        data: {
          name: body.name,
          path: body.path,
          component: body.component,
          icon: body.icon,
          order: body.order ?? 0,
          isHidden: body.isHidden ?? false,
          isActive: body.isActive ?? true,
          isDirectory: body.isDirectory ?? false,
          parentId: body.parentId,
          permissionId: body.permissionId,
          updatedBy: auth!.userId
        }
      });

      return ok(updated);
    },
    {
      body: t.Object({
        name: t.String(),
        path: t.String(),
        component: t.String(),
        icon: t.Optional(t.String()),
        order: t.Optional(t.Number()),
        isHidden: t.Optional(t.Boolean()),
        isActive: t.Optional(t.Boolean()),
        isDirectory: t.Optional(t.Boolean()),
        parentId: t.Optional(t.Number()),
        permissionId: t.Optional(t.Number())
      })
    }
  ));
