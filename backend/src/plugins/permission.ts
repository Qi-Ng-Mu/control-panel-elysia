import { fail } from "../lib/response";
import type { AuthInfo } from "./auth";

type AuthContext = { auth?: AuthInfo | null; set: { status?: number | string } };

export const requirePermission = (code: string) => ({
  beforeHandle(context: AuthContext) {
    const { auth, set } = context;
    if (!auth) {
      set.status = 401;
      return fail("未登录");
    }

    if (auth.permissionCodes.includes("*") || auth.permissionCodes.includes(code)) {
      return null;
    }

    // 权限校验失败时阻止访问
    set.status = 403;
    return fail("无权限");
  }
});
