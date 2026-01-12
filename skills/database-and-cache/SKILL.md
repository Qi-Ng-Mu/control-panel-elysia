---
name: database-and-cache
description: MySQL + Redis 数据库与缓存建模规范（前缀与参数从 env 获取）
metadata:
  tags: [database, mysql, prisma, redis, cache, schema, env]
---

# Database & Cache Skill

## 使用场景

- 新建/调整数据库表、字段、索引
- 引入/调整 Redis 缓存
- 统一 Key 前缀、TTL、环境隔离
- 排查脏读 / 缓存失效问题

---

## 环境变量（强制从 env 获取）

缓存与 Redis 参数必须从 env 读取，禁止硬编码：

- REDIS_URL
- CACHE_TTL_SECONDS
- CACHE_KEY_PREFIX
- NODE_ENV（仅用于判断环境，Key 前缀以 CACHE_KEY_PREFIX 为准）

---

## 数据库建模规范（强制）

- MySQL 8.0
- 表名/字段名：snake_case
- 默认排序：utf8mb4_0900_ai_ci
- 主键统一为 id
- 审计字段：
  - created_at / updated_at
  - createdBy / updatedBy
  - deleted_at / deleted_by
- 账号/用户名等：区分大小写（*_bin）

---

## Prisma 映射规范

- Model：PascalCase
- Field：camelCase
- 必须使用 @@map / @map
- 所有字段必须写注释

---

## 迁移规范

- 一次迁移只做一类变更
- 迁移名必须语义明确
- 禁止手改已应用迁移

---

## 权限与系统表（必须存在）

- user (用户表)
- role (角色表)
- user_role (用户-角色关联表)
- permission (权限表)
- role_permission (角色-权限关联表)
- menu (菜单表)
- file_asset (文件表)
- system_config (系统配置表)
- session (登录会话表(Refresh Token))
- operation_log (操作日志表)

---

## 缓存 Key 规范（前缀来自 env）

统一前缀：CACHE_KEY_PREFIX

Key 结构（推荐）：
{CACHE_KEY_PREFIX}:{domain}:{version}:{resource}:{params}

示例（CACHE_KEY_PREFIX=control-panel:dev）：
- control-panel:dev:user:v1:profile:userId=123
- control-panel:dev:config:v1:system

---

## TTL 规则

- 默认 TTL：CACHE_TTL_SECONDS（env）
- 特殊 TTL 可覆盖，但必须写注释说明原因

---

## 一致性规则（强制）

- 查询优先读缓存
- 写操作（新增/修改/删除）后必须清理/更新相关缓存，避免脏读
- 列表缓存必须包含分页与过滤条件
- 复杂条件可用稳定 hash，避免 key 过长

---

## 完成检查清单
- [ ] DB 命名 snake_case
- [ ] Prisma 映射完整
- [ ] 迁移可重复执行
- [ ] 缓存前缀/TTL/Redis 地址均来自 env
- [ ] 写入后缓存失效逻辑完整
