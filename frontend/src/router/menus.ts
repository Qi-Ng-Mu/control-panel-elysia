export type MenuItem = {
  key: string;
  label: string;
  path: string;
  permission?: string;
};

export const menuItems: MenuItem[] = [
  { key: "dashboard", label: "仪表盘", path: "/dashboard" },
  { key: "tenants", label: "租户管理", path: "/tenants", permission: "tenant.manage" },
  { key: "users", label: "用户管理", path: "/users", permission: "user.manage" },
  { key: "roles", label: "角色管理", path: "/roles", permission: "role.manage" },
  { key: "permissions", label: "权限管理", path: "/permissions", permission: "permission.manage" },
  { key: "menus", label: "菜单管理", path: "/menus", permission: "menu.manage" },
  { key: "departments", label: "部门管理", path: "/departments", permission: "department.manage" },
  { key: "positions", label: "岗位管理", path: "/positions", permission: "position.manage" },
  { key: "dictionary", label: "字典管理", path: "/dictionary", permission: "dictionary.manage" },
  { key: "notice-templates", label: "通知模板", path: "/notice-templates", permission: "notice.manage" },
  { key: "notices", label: "通知管理", path: "/notices", permission: "notice.manage" },
  { key: "ticket-flows", label: "工单流程", path: "/ticket-flows", permission: "ticket.flow.manage" },
  { key: "tickets", label: "工单管理", path: "/tickets", permission: "ticket.manage" },
  { key: "operation-logs", label: "操作日志", path: "/operation-logs", permission: "audit.manage" },
  { key: "sessions", label: "会话管理", path: "/sessions", permission: "session.manage" }
];
