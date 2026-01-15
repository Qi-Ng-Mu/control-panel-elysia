import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { ok, fail } from "../lib/response";
import { parsePagination } from "../lib/pagination";
import { authDecorator } from "../plugins/auth";
import { requirePermission } from "../plugins/permission";

export const ticketRoutes = new Elysia()
  .use(authDecorator)
  .guard(requirePermission("ticket.flow.manage"), (app) =>
    app.group("/ticket-flows", (group) =>
      group
      .get("/", async ({ auth, query }) => {
        const { skip, take } = parsePagination(query);
        const keyword = query.keyword?.trim();
        const where = {
          tenantId: auth!.tenantId,
          deletedAt: null,
          ...(keyword ? { name: { contains: keyword } } : {})
        };

        const [total, items] = await Promise.all([
          prisma.ticketFlow.count({ where }),
          prisma.ticketFlow.findMany({ where, skip, take, orderBy: { id: "desc" } })
        ]);

        return ok({ total, items });
      })
      .post(
        "/",
        async ({ auth, body }) => {
          const flow = await prisma.ticketFlow.create({
            data: {
              tenantId: auth!.tenantId,
              name: body.name,
              description: body.description,
              isActive: body.isActive ?? true,
              createdBy: auth!.userId
            }
          });

          return ok(flow);
        },
        {
          body: t.Object({
            name: t.String(),
            description: t.Optional(t.String()),
            isActive: t.Optional(t.Boolean())
          })
        }
      )
      .put(
        "/:id",
        async ({ auth, params, body, set }) => {
          const tenantId = auth!.tenantId;
          const flow = await prisma.ticketFlow.findFirst({
            where: { id: Number(params.id), tenantId, deletedAt: null }
          });
          if (!flow) {
            set.status = 404;
            return fail("流程不存在");
          }

          const updated = await prisma.ticketFlow.update({
            where: { id: flow.id },
            data: {
              name: body.name,
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
            description: t.Optional(t.String()),
            isActive: t.Optional(t.Boolean())
          })
        }
      )
      .post(
        "/:id/nodes",
        async ({ auth, params, body }) => {
          const flowId = Number(params.id);
          const nodes = await prisma.ticketFlowNode.createMany({
            data: body.nodes.map((node) => ({
              tenantId: auth!.tenantId,
              flowId,
              name: node.name,
              type: node.type,
              order: node.order ?? 0,
              isStart: node.isStart ?? false,
              isEnd: node.isEnd ?? false,
              createdBy: auth!.userId
            }))
          });

          return ok(nodes);
        },
        {
          body: t.Object({
            nodes: t.Array(
              t.Object({
                name: t.String(),
                type: t.String(),
                order: t.Optional(t.Number()),
                isStart: t.Optional(t.Boolean()),
                isEnd: t.Optional(t.Boolean())
              })
            )
          })
        }
      )
      .post(
        "/:id/conditions",
        async ({ auth, params, body }) => {
          const flowId = Number(params.id);
          const condition = await prisma.ticketFlowCondition.create({
            data: {
              tenantId: auth!.tenantId,
              flowId,
              sourceNodeId: body.sourceNodeId,
              targetNodeId: body.targetNodeId,
              expression: body.expression,
              createdBy: auth!.userId
            }
          });

          return ok(condition);
        },
        {
          body: t.Object({
            sourceNodeId: t.Number(),
            targetNodeId: t.Number(),
            expression: t.Any()
          })
        }
      )
  )
  )
  .guard(requirePermission("ticket.manage"), (app) =>
    app.group("/tickets", (group) =>
      group
      .get("/", async ({ auth, query }) => {
        const { skip, take } = parsePagination(query);
        const keyword = query.keyword?.trim();

        const where = {
          tenantId: auth!.tenantId,
          deletedAt: null,
          ...(keyword ? { title: { contains: keyword } } : {}),
          ...(auth!.dataScope.type === "SELF" ? { createdBy: auth!.userId } : {})
        };

        const [total, items] = await Promise.all([
          prisma.ticket.count({ where }),
          prisma.ticket.findMany({ where, skip, take, orderBy: { id: "desc" } })
        ]);

        return ok({ total, items });
      })
      .post(
        "/",
        async ({ auth, body, set }) => {
          const tenantId = auth!.tenantId;
          let currentNodeId: number | null = null;

          if (body.flowId) {
            const startNode = await prisma.ticketFlowNode.findFirst({
              where: { tenantId, flowId: body.flowId, isStart: true, deletedAt: null }
            });

            if (!startNode) {
              set.status = 400;
              return fail("流程未配置开始节点");
            }

            currentNodeId = startNode.id;
          }

          const ticket = await prisma.ticket.create({
            data: {
              tenantId,
              title: body.title,
              description: body.description,
              status: body.status ?? "OPEN",
              flowId: body.flowId,
              currentNodeId,
              requesterId: body.requesterId,
              createdBy: auth!.userId
            }
          });

          if (body.flowId) {
            const instance = await prisma.ticketFlowInstance.create({
              data: {
                tenantId,
                ticketId: ticket.id,
                flowId: body.flowId,
                currentNodeId,
                status: "RUNNING"
              }
            });

            await prisma.ticketFlowInstanceHistory.create({
              data: {
                tenantId,
                instanceId: instance.id,
                fromNodeId: null,
                toNodeId: currentNodeId,
                action: "START",
                payload: { remark: "流程启动" },
                createdBy: auth!.userId
              }
            });

            // 创建工单后初始化流程实例与首个节点记录
          }

          return ok(ticket);
        },
        {
          body: t.Object({
            title: t.String(),
            description: t.Optional(t.String()),
            status: t.Optional(t.String()),
            flowId: t.Optional(t.Number()),
            requesterId: t.Optional(t.Number())
          })
        }
      )
      .put(
        "/:id",
        async ({ auth, params, body, set }) => {
          const tenantId = auth!.tenantId;
          const ticket = await prisma.ticket.findFirst({
            where: { id: Number(params.id), tenantId, deletedAt: null }
          });
          if (!ticket) {
            set.status = 404;
            return fail("工单不存在");
          }

          const updated = await prisma.ticket.update({
            where: { id: ticket.id },
            data: {
              title: body.title,
              description: body.description,
              status: body.status ?? "OPEN",
              updatedBy: auth!.userId
            }
          });

          return ok(updated);
        },
        {
          body: t.Object({
            title: t.String(),
            description: t.Optional(t.String()),
            status: t.Optional(t.String())
          })
        }
      )
  ));
