---
name: 'prd-to-feature'
description: '将业务 PRD (.md) 转换为经过验证的 Feature Markdown 规范文档。在定义或更新业务能力时调用，以生成供代码生成使用的机器可读规范。'
---

# PRD → Feature (Markdown)

将业务级 PRD (Markdown) 转换为标准化的 Feature Markdown (`*.feature.md`)，供下游代码生成器使用。确保一致性、验证以及符合仓库约定的规范。

## 何时调用

- 定义或更新业务能力（新模块/新功能）时。
- 需要一份驱动代码生成和文档的机器可读规范时。

## 激活条件

当用户消息中包含以下关键词时自动激活：

- ”生成 Feature 规范“

## 输入

- Markdown 格式的高层项目/功能 PRD（问题陈述、范围、数据模型、API）。
- 仓库约定：
  - PRD 存放路径：`prd/<Module>/`
    - `README.md` 是模块概览
    - 该目录下的其他 `*.md` 文件均为单个功能的 PRD（例如 `c_sign.md`）
  - Feature 规范存放路径：`features/<module>/<feature-name>.feature.md`
  - 业务代码存放路径：`src/modules/biz/<module>/`

## 输出

- 每个能力生成一份经过验证的 `*.feature.md` 文件，结构如下：

```markdown
# Feature: <功能中文名>

Module: <module> Version: 0.1.0 ID: <unique_short_name>
Domain: <简述领域与目标>

## Entities

### <PascalCaseEntity> (table: snake_case_table)

| Name | Type | Nullable | Unique | Default | Index | Primary | Generated |
| ---- | ---- | -------- | ------ | ------- | ----- | ------- | --------- |
| id   | int  | false    | false  |         |       | true    | true      |

...（按列展开）

Relations:

- belongsTo -> <TargetEntity> (fk: <field>, onDelete: CASCADE|SET NULL|RESTRICT)

Constraints:

- unique: fieldA, fieldB

## Endpoints

### POST /<module>/<resource>

Summary: 简述接口
Auth: required|optional

Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ... | ... | true | ... |

Response 200
| Field | Type | Description |
|-------|------|-------------|
| ... | ... | ... |

Errors
| Code | Message |
|------|-------------|
| 400 | ... |

## Rules

- 业务约束或校验清单

## Auth

- 守卫/角色策略（如需）

## Events

- Published: [...]
- Subscribed: [...]

## Acceptance

- 可执行验收用例描述（用于测试骨架）
```

## 职责

- 规范化命名（PascalCase 实体，snake_case 表名）和 Markdown 表格布局。
- 针对 Markdown Schema（标题/表格）验证类型和约束。
- 强制执行仓库路径约定：
  - Feature 文件：`features/<module>/` 下的 `.feature.md`
  - 代码生成目标：`src/modules/biz/<module>/`
- 确保每个端点都有请求/响应形状和错误契约。
- 模块名称规范化：
  - 使用 PRD 文件夹名称 `<Module>` 并规范化为小写作为 `<module>` 路径（例如 `checkIn` → `checkin`）。
- Feature 名称映射：
  - 使用 PRD 文件名作为 `<feature-name>`（例如 `c_sign.md` → `c_sign.feature.md`）。
- 转换过程中跳过 `README.md`。

## 用法

- 在 PRD Markdown 中提供模块名称、功能范围、实体和端点。
- 该技能将输出一个可直接提交的 `*.feature.md` 和验证报告。

## 注意事项

- 保持 `.feature.md` 作为生成器和文档的唯一真实来源。
- 倾向于每个能力使用增量 Feature 文件，以保持规范专注。
