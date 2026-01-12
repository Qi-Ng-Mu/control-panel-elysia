---
name: backend-elysia-standard
description: Bun + Elysia.js 后端开发规范（路由、校验、鉴权、错误处理、配置从 env 获取）
metadata:
  tags: [bun, elysia, prisma, mysql, backend, auth, env]
---

# Backend Elysia Standard Skill

## 使用场景

- 新增或修改后端模块
- 编写 控制器 / 业务逻辑 / 数据模型
- 涉及 Prisma、数据库表、鉴权、权限控制、Redis
- 需要确保命名、结构、迁移全部规范
- 需要从 .env / ConfigService 读取参数（端口、JWT、Redis、缓存）

---

## 技术栈与约束（强制）

- Runtime：Bun
- Framework：Elysia.js
- TypeScript：严格类型，避免 any
- 配置：统一从 env 读取（通过自建 config 模块/加载器）
- 路由层不写业务：业务逻辑下沉到 service 层

---

## 推荐目录结构

backend/
  src/
    modules/
      auth/
        index.ts        # Elysia 控制器
        service.ts      # 业务逻辑
        model.ts        # 数据模型
      user/
        index.ts
        service.ts
        model.ts
    utils/
      a/
        index.ts
      b/
        index.ts
       
---

## Prisma 规范（强制）

- schema.prisma 固定路径：`backend/prisma/schema.prisma`
- 表 / 字段：
  - DB：snake_case
  - Code：PascalCase / camelCase
- 所有模型与字段必须写注释
- 迁移：
  - 一次迁移只做一类变更
  - 命名清晰（add-user-table / add-order-status）
- 所有数据库访问通过 PrismaClient
- 禁止在 Service 外直接操作 Prisma
- 复杂查询需明确 select / include

---

## 环境变量（强制从 env 获取）

以下变量以 `.env` / `backend/.env.example` 为准，禁止硬编码到代码：

- PORT
- NODE_ENV
- DATABASE_URL
- JWT_SECRET
- REFRESH_TOKEN_SECRET
- ACCESS_TOKEN_TTL
- REFRESH_TOKEN_TTL
- REDIS_URL
- CACHE_TTL_SECONDS
- CACHE_KEY_PREFIX
- CORS_ORIGIN
- COOKIE_SECURE
- COOKIE_SAMESITE

建议：在 config 层对 env 做解析与默认值处理；缺失关键项时直接启动失败。

---

## 路由与校验

- 路由：按 domain 分组（例如 /api/v1/users）
- 请求校验：必须校验 body/query/params（避免裸用 any）
- 响应：统一返回结构 { code, message, data }

---

## 错误处理（强制）

- 统一错误格式（HTTP 状态码 + 业务 code）
- 不泄露内部堆栈与数据库错误到客户端
- 对可预期错误（参数非法/权限不足/资源不存在）输出明确 message

---

## 鉴权规范（强制）

- Access Token：
  - secret：JWT_SECRET（env）
  - ttl：ACCESS_TOKEN_TTL（env）
  - 短期，仅访问 API
- Refresh Token：
  - secret：REFRESH_TOKEN_SECRET（env）
  - ttl：REFRESH_TOKEN_TTL（env）
  - 哈希存 Redis（REDIS_URL env）
  - 刷新时必须轮换
- Refresh Token 历史写入 MySQL（审计）

---

## 完成检查清单

- [ ] 路由职责清晰，业务逻辑在 services
- [ ] env 参数无硬编码
- [ ] 参数校验完整
- [ ] Prisma 映射正确（无直接 snake_case 暴露）
- [ ] Prisma 查询安全
- [ ] 返回结构统一 { code, message, data }
- [ ] 给出 curl/Postman 验证方式
