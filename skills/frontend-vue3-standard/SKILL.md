---
name: frontend-vue3-standard
description: Vue3 + TS + Vite + Naive UI 前端开发规范（组件、路由、状态、API 封装、环境变量）
metadata:
  tags: [vue3, vite, frontend, routing, state, naive-ui, xicons]
---

# Frontend Vue3 Standard Skill

## 使用场景

- 新增/修改页面、组件、表单、列表、弹窗
- 调整路由与权限菜单
- 接入后端 API 或适配接口变更

---

## 技术栈与约束（强制）

- Vue 3 + TypeScript + Vite
- 组件库：**Naive UI**（统一使用 Naive UI 的组件与主题能力）
- 图标库：**xicons**（统一入口封装，避免散落引用）
- API 调用必须集中封装（禁止组件里散落请求）
- 环境变量：只使用 Vite 前缀（VITE_），禁止硬编码后端地址
- 禁止引入与 Naive UI 功能高度重叠的组件库（避免样式/交互不一致）

---

## 推荐目录结构

frontend/
  src/
    pages/            # 页面
    components/       # 通用组件
    composables/      # 组合式函数（useXxx）
    services/         # API 封装
    stores/           # 状态管理（Pinia 推荐）
    router/
    theme/            # Naive UI 主题/全局配置
    icons/            # xicons 二次封装（统一导出）
    types/
    utils/

---

## UI 与主题规范（Naive UI）

- 优先使用 Naive UI 组件完成表单、表格、弹窗、消息提示等
- 主题统一在 `src/theme/` 管理
- 禁止在业务组件里硬编码颜色/阴影等设计 token
- 统一使用 Naive UI 的消息/通知（如 message、notification、dialog）

---

## 图标规范（xicons）

- 统一在 `src/icons/` 封装并导出（例如按分类导出）
- 业务组件只从 `src/icons/` 引用，禁止直接从 xicons 各子包散落引入
- 图标与按钮/菜单配合时，保持尺寸与对齐一致

---

## 路由规范

- 路由路径：kebab-case
- 需要鉴权的路由必须显式标识（meta.requiresAuth）
- 页面组件仅做组合与布局，复杂逻辑放 composables/services

---

## 状态管理

- 推荐 Pinia
- 不把服务端列表数据长期当“全局状态”；以请求缓存/分页为主

---

## API 调用规范（强制）

- services 使用fetch统一封装
- 统一处理 { code, message, data }
- 统一错误提示与兜底（避免静默失败）
- 禁止在组件中直接 fetch

---

## 环境变量（强制）

- 后端地址：VITE_API_BASE_URL
- 其他公共配置：均以 VITE_ 前缀注入
- .env 只本地使用，提交 .env.example

---

## 完成检查清单

- [ ] 仅使用 Naive UI 组件与主题体系
- [ ] xicons 通过 icons/ 统一封装引用
- [ ] 路由/页面/菜单命名一致（kebab-case）
- [ ] API 封装集中在 services
- [ ] TS 类型完整，无 any 滥用
- [ ] 关键交互有 loading/empty/error 状态
- [ ] 核心逻辑有中文注释
- [ ] 给出本地验证步骤（dev/build + 手动验收点）
