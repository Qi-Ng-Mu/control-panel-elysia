import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { env } from "./config/env";
import { ok, fail } from "./lib/response";
import { authPlugin, requireAuth } from "./plugins/auth";
import { operationLogPlugin } from "./plugins/operation-log";
import { authRoutes } from "./routes/auth";
import { tenantRoutes } from "./routes/tenants";
import { userRoutes } from "./routes/users";
import { roleRoutes } from "./routes/roles";
import { permissionRoutes } from "./routes/permissions";
import { menuRoutes } from "./routes/menus";
import { departmentRoutes } from "./routes/departments";
import { positionRoutes } from "./routes/positions";
import { dictionaryRoutes } from "./routes/dictionaries";
import { noticeRoutes } from "./routes/notices";
import { ticketRoutes } from "./routes/tickets";
import { auditRoutes } from "./routes/audit";

export const app = new Elysia();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["content-type", "authorization", "x-tenant-id"]
  })
);

app.get("/health", () => ok(null));

app.onError(({ error, set }) => {
  set.status = 400;
  const message =
    typeof error === "object" && error && "message" in error
      ? String((error as { message?: unknown }).message ?? "请求失败")
      : "请求失败";
  return fail(message);
});

const api = new Elysia({ prefix: "/api" })
  .use(authPlugin)
  .use(operationLogPlugin)
  .use(authRoutes)
  .guard(requireAuth(), (guarded) =>
    guarded
      .use(tenantRoutes)
      .use(userRoutes)
      .use(roleRoutes)
      .use(permissionRoutes)
      .use(menuRoutes)
      .use(departmentRoutes)
      .use(positionRoutes)
      .use(dictionaryRoutes)
      .use(noticeRoutes)
      .use(ticketRoutes)
      .use(auditRoutes)
  );

app.use(api);

app.listen({ port: env.port });

console.log(`API listening on http://localhost:${env.port}`);
