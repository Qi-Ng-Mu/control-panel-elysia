---
name: api-contract-sync
description: Frontend & Backend API contract synchronization（前后端接口契约同步）
metadata:
  tags: [api, contract, frontend, backend, sync]
---

# API Contract Sync Skill

## 使用场景

- 后端字段新增/删除/重命名
- 响应结构变化导致前端 undefined / TS 报错
- 需要保证接口与前端类型一致

---

## 契约原则（强制）

- 接口即契约，禁止猜字段
- 后端变更必须同步前端 services/types
- 前端不得“偷偷兼容旧字段”掩盖问题

## 后端侧检查 

- 接口 返回结构必须为：
{ code, message, data }
- 数据对象 定义完整、无 any
- 字段命名使用 camelCase

---

## 前端侧检查

- services 层定义接口类型
- 页面与组件禁止使用 any
- 禁止用 ?. 掩盖结构错误

---

## 同步流程（强制）

1) 以 backend 为唯一接口源（路径/方法/参数/响应）
2) 更新前端 services 的请求与类型定义
3) 删除废弃字段与旧逻辑
4) 更新页面使用点
5) 双端给出验证方式

---

## 输出要求（必须写清）
- 接口路径 + 方法
- 请求参数（body/query/params）
- 响应示例（code/message/data）
- 前端影响点（文件列表）

---

## 完成检查清单
- [ ] 后端响应结构稳定 { code, message, data }
- [ ] 前端 services/types 同步完成
- [ ] 页面无 TS / runtime undefined
- [ ] 给出 curl + 页面验收步骤
