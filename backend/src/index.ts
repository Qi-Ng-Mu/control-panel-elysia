import { Elysia } from "elysia";
import { env } from "./config/env";

const app = new Elysia();

app.get("/health", () => ({
  code: 0,
  message: "ok",
  data: null
}));

app.listen({ port: env.port });

console.log(`API listening on http://localhost:${env.port}`);
