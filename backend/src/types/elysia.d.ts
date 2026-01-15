import type { AuthInfo } from "../plugins/auth";

declare module "elysia" {
  interface Context {
    auth: AuthInfo | null;
  }
}
