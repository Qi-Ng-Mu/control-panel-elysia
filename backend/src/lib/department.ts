import { prisma } from "../db";

export const getDepartmentDescendants = async (tenantId: number, rootIds: number[]) => {
  const departments = await prisma.department.findMany({
    where: { tenantId, deletedAt: null },
    select: { id: true, parentId: true }
  });

  const childrenMap = new Map<number, number[]>();
  for (const dept of departments) {
    if (dept.parentId === null) continue;
    const list = childrenMap.get(dept.parentId) ?? [];
    list.push(dept.id);
    childrenMap.set(dept.parentId, list);
  }

  const result = new Set<number>();
  const queue = [...rootIds];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || result.has(current)) continue;
    result.add(current);
    const children = childrenMap.get(current) ?? [];
    queue.push(...children);
  }

  return Array.from(result);
};
