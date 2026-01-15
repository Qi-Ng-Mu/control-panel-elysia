import { Elysia } from "elysia";
import { prisma } from "../db";
import { Prisma } from "../generated/client";
import type { AuthInfo } from "./auth";

const ignoredPrefixes = ["/api/auth"];

export const operationLogPlugin = new Elysia({ name: "operationLog" }).onAfterHandle(
  async ({ request, path, body, auth }: { request: Request; path: string; body: unknown; auth?: AuthInfo | null }) => {
    if (!auth) return;
    if (ignoredPrefixes.some((prefix) => path.startsWith(prefix))) return;
    if (request.method === "GET") return;

    // 记录非查询操作的审计日志，便于后续追踪
    await prisma.operationLog.create({
      data: {
        tenantId: auth.tenantId,
        userId: auth.userId,
        action: `${request.method} ${path}`,
        payload: body ? (body as Prisma.InputJsonValue) : Prisma.JsonNull
      }
    });
  }
);
