import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { ok, fail } from "../lib/response";
import { parsePagination } from "../lib/pagination";
import { authDecorator } from "../plugins/auth";
import { requirePermission } from "../plugins/permission";

export const auditRoutes = new Elysia()
  .use(authDecorator)
  .guard(requirePermission("audit.manage"), (app) =>
    app.group("/operation-logs", (group) =>
      group.get("/", async ({ auth, query }) => {
        const { skip, take } = parsePagination(query);
        const keyword = query.keyword?.trim();
        const where = {
          tenantId: auth!.tenantId,
          ...(keyword ? { action: { contains: keyword } } : {})
        };

        const [total, items] = await Promise.all([
          prisma.operationLog.count({ where }),
          prisma.operationLog.findMany({ where, skip, take, orderBy: { id: "desc" } })
        ]);

        return ok({ total, items });
      })
    )
  )
  .guard(requirePermission("session.manage"), (app) =>
    app
      .group("/sessions", (group) =>
        group
          .get("/", async ({ auth, query }) => {
            const { skip, take } = parsePagination(query);
            const where = {
              tenantId: auth!.tenantId
            };

            const [total, items] = await Promise.all([
              prisma.session.count({ where }),
              prisma.session.findMany({ where, skip, take, orderBy: { id: "desc" } })
            ]);

            return ok({ total, items });
          })
          .post(
            "/:id/revoke",
            async ({ auth, params, set }) => {
              const tenantId = auth!.tenantId;
              const session = await prisma.session.findFirst({
                where: { id: Number(params.id), tenantId }
              });
              if (!session) {
                set.status = 404;
                return fail("会话不存在");
              }

              const updated = await prisma.session.update({
                where: { id: session.id },
                data: { revokedAt: new Date() }
              });

              return ok(updated);
            },
            { params: t.Object({ id: t.String() }) }
          )
      )
  );
