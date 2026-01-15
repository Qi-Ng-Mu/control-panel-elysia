# 计划

## 目标范围

- 多租户：所有业务表 `tenant_id` 非空，`tenant_id=0` 仅用于系统模板与 `super_admin`
- 权限模型：接口级 + 数据级（角色维度数据范围）
- 工单流程：支持自定义节点与条件流转
- CRUD 范围：租户、部门、岗位、字典、通知、工单
- 超管：系统初始化唯一 `super_admin`，拥有全部权限

## 总体阶段

- 阶段 0：数据模型与约束设计
- 阶段 1：后端基础设施
- 阶段 2：核心 CRUD API
- 阶段 3：RBAC 生效与数据范围
- 阶段 4：工单流程引擎
- 阶段 5：前端页面落地
- 阶段 6：运维与审计

## 阶段 0：数据模型与约束设计

- 新增租户与组织基础表结构
- 设计角色数据范围字段与关联策略
- 设计工单流程与实例表结构
- 明确模板数据规则（系统模板 tenant_id=0，租户模板 tenant_id=当前租户）
- 统一表命名（snake_case）与字段约束（非空/唯一/索引）

## 阶段 1：后端基础设施

- 统一 API 响应结构与错误码
- 登录与刷新令牌（JWT + refresh）
- 租户上下文解析与注入（强制 tenant_id）
- 权限校验中间件（接口级权限码）
- 数据范围过滤中间件（角色级数据范围）
- 统一软删除、创建人、更新人处理

## 阶段 2：核心 CRUD API

- 租户管理
  - 租户 CRUD、启停、初始化管理员
- 部门管理
  - 树结构 CRUD、部门与用户关系
- 岗位管理
  - 岗位 CRUD（标签化）
- 字典管理
  - 字典组与字典项 CRUD
- 通知管理
  - 通知模板 CRUD、通知 CRUD
- 工单管理
  - 工单 CRUD、流程绑定、状态查询

## 阶段 3：RBAC 生效与数据范围

- 用户-角色、角色-权限绑定 API
- 菜单-权限绑定
- 权限码体系落地（接口级）
- 数据范围配置（角色维度）
- 前端动态菜单与路由权限过滤

## 阶段 4：工单流程引擎

- 流程定义表（流程、节点、条件、边）
- 流程实例表（当前节点、历史记录）
- 条件流转解析与执行
- 工单状态与流程联动

## 阶段 5：前端页面落地

- 登录与基础布局
- 租户/用户/角色/权限/菜单管理页
- 部门/岗位/字典/通知管理页
- 工单管理与流程配置页
- 角色数据范围配置页

## 阶段 6：运维与审计

- 操作日志查询
- 会话管理（踢下线/刷新）
- 系统配置与文件资产维护

## 数据模型清单（初步）

- 租户：`tenant`
- 部门：`department`
- 岗位：`position`
- 字典：`dictionary_group`、`dictionary_item`
- 通知：`notice_template`、`notice`
- 工单：`ticket`、`ticket_flow`、`ticket_flow_node`、`ticket_flow_condition`、`ticket_flow_instance`、`ticket_flow_instance_history`
- 角色数据范围：`role_data_scope`（或合并到 `role`）

## 接口清单（初步）

- 鉴权
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `POST /auth/logout`
  - `GET /auth/me`
- 租户
  - `GET /tenants`
  - `POST /tenants`
  - `PUT /tenants/:id`
  - `PATCH /tenants/:id/status`
- 用户/角色/权限/菜单
  - `GET /users` `POST /users` `PUT /users/:id` `PATCH /users/:id/status`
  - `GET /roles` `POST /roles` `PUT /roles/:id`
  - `GET /permissions` `POST /permissions` `PUT /permissions/:id`
  - `GET /menus` `POST /menus` `PUT /menus/:id`
  - `POST /roles/:id/permissions`
  - `POST /users/:id/roles`
- 部门/岗位
  - `GET /departments` `POST /departments` `PUT /departments/:id`
  - `GET /positions` `POST /positions` `PUT /positions/:id`
- 字典/通知
  - `GET /dictionary/groups` `POST /dictionary/groups`
  - `GET /dictionary/items` `POST /dictionary/items`
  - `GET /notice-templates` `POST /notice-templates`
  - `GET /notices` `POST /notices`
- 工单与流程
  - `GET /tickets` `POST /tickets` `PUT /tickets/:id`
  - `GET /ticket-flows` `POST /ticket-flows`
  - `POST /ticket-flows/:id/nodes`
  - `POST /ticket-flows/:id/conditions`

## 里程碑输出

- M1：后端基础设施可用（鉴权、租户、权限中间件）
- M2：核心 CRUD 完整
- M3：RBAC 与数据范围生效
- M4：工单流程可配置
- M5：前端页面与权限路由完成
- M6：审计与运维功能完成

## 验证方式

- 后端：`bun run dev` / `bun run test`（如有）
- 前端：`bun run dev` / `bun run build`

## 进度记录

- 实施过程中同步更新 `PROGRESS.md` 对应阶段状态
