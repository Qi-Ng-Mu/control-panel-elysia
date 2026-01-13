import "dotenv/config";
import { PrismaClient } from "../src/generated/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "control_panel",
  connectionLimit: 5
});

const prisma = new PrismaClient({ adapter });

const PERMISSION_ACTIONS = ["list", "detail", "create", "update", "delete"] as const;

const MENU_SEEDS = [
  { key: "dashboard", name: "总览", path: "/dashboard", order: 0, isDirectory: false },
  { key: "system", name: "系统管理", path: "/system", order: 1, isDirectory: true },
  { key: "user", name: "用户管理", path: "/user", order: 0, isDirectory: false },
  { key: "role", name: "角色管理", path: "/role", order: 1, isDirectory: false },
  { key: "permission", name: "权限管理", path: "/permission", order: 2, isDirectory: false },
  { key: "menu", name: "菜单管理", path: "/menu", order: 3, isDirectory: false },
  { key: "system-config", name: "系统配置", path: "/system-config", order: 4, isDirectory: false },
  { key: "file-asset", name: "文件管理", path: "/file-asset", order: 5, isDirectory: false },
  { key: "cache", name: "缓存管理", path: "/cache", order: 6, isDirectory: false },
  { key: "terminal", name: "终端管理", path: "/terminal", order: 7, isDirectory: false },
  { key: "profile", name: "个人设置", path: "/profile", order: 2, isDirectory: false, isHidden:1}
] as const;

const buildPermissionSeeds = () =>
  MENU_SEEDS.flatMap((menu) =>
    PERMISSION_ACTIONS.map((action) => ({
      name: `${menu.key}:${action}`,
      code: `${menu.key}:${action}`
    }))
  );

const ensureRole = async () => {
  // 初始化系统管理员角色
  const existing = await prisma.role.findFirst({
    where: { code: "system-admin", deletedAt: null }
  });

  if (existing) {
    return prisma.role.update({
      where: { id: existing.id },
      data: {
        name: "System Admin",
        isActive: true
      }
    });
  }

  return prisma.role.create({
    data: {
      name: "System Admin",
      code: "system-admin",
      description: "System Admin",
      isActive: true
    }
  });
};

const ensureUser = async () => {
  // 初始化系统管理员账号（密码为 123456 的哈希值）
  const passwordHash = await Bun.password.hash("123456", {
    algorithm: "bcrypt",
    cost: 10
  });

  const existing = await prisma.user.findFirst({
    where: { username: "SystemAdmin", deletedAt: null }
  });

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        displayName: "System Admin",
        passwordHash,
        isActive: true,
      }
    });
  }

  return prisma.user.create({
    data: {
      username: "SystemAdmin",
      displayName: "System Admin",
      passwordHash,
      isActive: true,
    }
  });
};

const ensureUserRole = async (userId: number, roleId: number) => {
  // 关联管理员与管理员角色
  await prisma.userRole.createMany({
    data: [{ userId, roleId }],
    skipDuplicates: true
  });
};

const ensurePermissions = async () => {
  // 初始化菜单相关权限
  const permissions = buildPermissionSeeds();
  const codes = permissions.map((item) => item.code);

  const existing = await prisma.permission.findMany({
    where: { code: { in: codes }, deletedAt: null }
  });

  const existingSet = new Set(existing.map((item) => item.code));
  const toCreate = permissions.filter((item) => !existingSet.has(item.code));

  if (toCreate.length) {
    await prisma.permission.createMany({
      data: toCreate,
      skipDuplicates: true
    });
  }

  const rows = await prisma.permission.findMany({
    where: { code: { in: codes }, deletedAt: null }
  });

  return new Map(rows.map((row) => [row.code, row.id]));
};

const ensureMenus = async (permissionMap: Map<string, number>) => {
  // 初始化菜单与权限绑定
  const menuIdByKey = new Map<string, number>();

  for (const menu of MENU_SEEDS) {
    const parentId =
      menu.key === "system" || menu.key === "dashboard" || menu.key === "profile"
        ? null
        : menuIdByKey.get("system") ?? null;

    const permissionId = permissionMap.get(`${menu.key}:list`) ?? null;

    const existing = await prisma.menu.findFirst({
      where: { path: menu.path, deletedAt: null }
    });

    const data = {
      name: menu.name,
      path: menu.path,
      component: menu.path,
      order: menu.order,
      isHidden: false,
      isActive: true,
      isDirectory: menu.isDirectory,
      parentId,
      permissionId
    };

    const record = existing
      ? await prisma.menu.update({ where: { id: existing.id }, data })
      : await prisma.menu.create({ data });

    menuIdByKey.set(menu.key, record.id);
  }
};

async function main(): Promise<void> {
  const role = await ensureRole();
  const user = await ensureUser();
  await ensureUserRole(user.id, role.id);

  const permissionMap = await ensurePermissions();
  await ensureMenus(permissionMap);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
