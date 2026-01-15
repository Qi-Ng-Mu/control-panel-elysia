import type { Role } from "../generated/client";

export type DataScopeType = "ALL" | "DEPT" | "DEPT_AND_CHILD" | "CUSTOM" | "SELF";

export type DataScope = {
  type: DataScopeType;
  departmentIds: number[];
};

const priority: DataScopeType[] = ["ALL", "DEPT_AND_CHILD", "DEPT", "CUSTOM", "SELF"];

export const resolveDataScope = (roles: Role[]): DataScope => {
  if (roles.length === 0) {
    return { type: "SELF", departmentIds: [] };
  }

  let selected: DataScopeType = "SELF";
  let departmentIds: number[] = [];

  for (const role of roles) {
    const roleType = (role.dataScopeType as DataScopeType) ?? "SELF";
    if (priority.indexOf(roleType) < priority.indexOf(selected)) {
      selected = roleType;
    }
    if (roleType === "CUSTOM" && Array.isArray(role.dataScopeDepartmentIds)) {
      departmentIds = [...departmentIds, ...(role.dataScopeDepartmentIds as number[])];
    }
  }

  // 数据范围以角色最高权限为准，避免低权限覆盖高权限
  return { type: selected, departmentIds: Array.from(new Set(departmentIds)) };
};
