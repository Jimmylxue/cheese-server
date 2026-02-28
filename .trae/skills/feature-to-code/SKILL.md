---
name: 'feature-to-code'
description: '根据 Feature Markdown 生成 NestJS 代码、迁移、Swagger 和测试。在添加/更新 .feature.md 后调用，以生成或更新业务代码。'
---

# Feature → Code (Markdown)

读取标准化的 `*.feature.md` 文件并生成对齐的 NestJS 产物：实体 (Entities)、DTOs、服务 (Services)、控制器 (Controllers)、模块 (Modules)、TypeORM 迁移、Swagger 注解和测试骨架。

## 何时调用

- 存在新的或更新的 `features/<module>/<feature>.feature.md` 文件时。
- 需要为某项能力生成/刷新业务代码时。

## 激活条件

当用户消息中包含以下关键词时自动激活：

- ”SKILL生成业务代码“

## 输入

- 由 PRD→Feature 技能生成的经过验证的 `*.feature.md`。
- 需遵守的仓库约定：
  - PRD 源文件：`prd/<Module>/(README.md + feature.md files)`
  - Feature 规范：`features/<module>/...`（小写模块目录）
  - 代码生成目标：`src/modules/biz/<module>/...`

## 生成产物

- 实体 (`entities/*.entity.ts`)：包含关系/索引/唯一性/软删除/时间戳。
- DTOs (请求/响应)：包含 `class-validator` 和 Swagger `ApiProperty`。
- 服务 (Service)：包含 CRUD 和源自 `rules` 的规则入口方法。
- 控制器 (Controller)：包含源自 `endpoints` 的路由：
  - 守卫：当 `auth: required` 时使用 `AuthGuard`
  - 拦截器：`TransformInterceptor`
  - 装饰器：`ApiCommonResponse`
- 模块 (Module)：绑定上述组件。
- TypeORM 迁移：反映 Schema 变更（创建/修改表、索引、唯一约束）。
- 测试骨架：基于 `acceptance` 生成（e2e 或单元测试）。
- **Swagger 配置** (`src/config/swagger/const.ts`)：自动将新模块注册到 `platformConfigs` 中。

## 约定与集成

- 与仓库风格保持一致：
  - 受保护的端点使用 `src/modules/auth/guard/auth.guard`。
  - 响应包装使用 `src/common/interceptors/transform.interceptor`。
  - Swagger 响应使用 `src/common/decorators/api-response.decorator`。
- 生成的代码放置在：`src/modules/biz/<module>/...`
- 表名使用 snake_case，实体名使用 PascalCase。
- **Swagger 集成**：
  - 修改 `src/config/swagger/const.ts`。
  - 在 `platformConfigs` 对象中添加新模块的配置（如果尚未存在）。
  - 配置键名应与模块名一致（例如 `checkin`），包含 `title`、`description`、`modules`（数组包含新模块类）和 `path`（例如 `platform/checkin`）。

## 合并策略

- 非破坏性：避免覆盖手写逻辑。
- 开发者填充部分使用分离的 partials/stubs。
- 对同一 Feature 重复运行具有幂等性。

## 用法

- 提供 Feature Markdown 路径。该技能将：
  1. 解析并验证 Markdown 结构（标题/表格）。
  2. 渲染模板（实体/DTOs/服务/控制器/模块）。
  3. 创建/升级 TypeORM 迁移。
  4. **更新 Swagger 配置 (`src/config/swagger/const.ts`)**。
  5. 生成测试骨架。
  6. 生成已创建/更新文件的摘要。

## 注意事项

- 保持 `.feature.md` 作为唯一真实来源；通过重新生成来更新代码。
- 生成后，在提交前运行：lint、测试和迁移 dry-run。
