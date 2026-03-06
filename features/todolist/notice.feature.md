# Feature: 待办通知

Module: todolist Version: 0.1.0 ID: todo_notice
Domain: 提供基于任务截止时间的通知能力，支持用户分别配置邮件与站内信开关和通知时间（24小时制，步长30分钟），系统按用户配置时间推送；管理员可在 B 端手动触发邮件或站内信并查询记录。每天每个任务每个渠道仅发送一次。

发送邮箱的模块可复用不用重新写，参考系统模块 `system/modules/mail` 中的接口。

站内信模块已经完成，可直接调用，参考系统模块 `system/modules/siteLetter` 中的接口

## Entities

### NoticeSetting (table: todo_notice_setting)

| Name           | Type       | Nullable | Unique | Default | Index | Primary | Generated | describe         |
| -------------- | ---------- | -------- | ------ | ------- | ----- | ------- | --------- | ---------------- |
| id             | int        | false    | false  |         |       | true    | true      | 主键             |
| user_id        | int        | false    | true   |         | true  | false   | false     | 用户ID           |
| email_enabled  | boolean    | false    | false  | true    |       | false   | false     | 是否开启邮件通知 |
| letter_enabled | boolean    | false    | false  | false   |       | false   | false     | 是否开启站内信   |
| preferred_time | varchar(5) | false    | false  | 08:30   |       | false   | false     | 通知时间(HH:mm)  |
| created_at     | timestamp  | false    | false  | now()   |       | false   | false     | 创建时间         |
| updated_at     | timestamp  | false    | false  | now()   |       | false   | false     | 更新时间         |

Relations:

- belongsTo -> User (fk: user_id)

Constraints:

- unique: user_id

### NoticeRun (table: todo_notice_run)

| Name         | Type               | Nullable | Unique | Default | Index | Primary | Generated | describe         |
| ------------ | ------------------ | -------- | ------ | ------- | ----- | ------- | --------- | ---------------- |
| id           | int                | false    | false  |         |       | true    | true      | 主键             |
| run_at       | timestamp          | false    | false  | now()   |       | false   | false     | 触发时间         |
| triggered_by | enum(system,admin) | false    | false  | system  |       | false   | false     | 触发来源         |
| operator_id  | int                | true     | false  |         |       | false   | false     | 管理员ID（可空） |
| sent_count   | int                | false    | false  | 0       |       | false   | false     | 发送条数         |
| created_at   | timestamp          | false    | false  | now()   |       | false   | false     | 创建时间         |

Relations:

- belongsTo -> User (fk: operator_id, nullable)

### NoticeRecord (table: todo_notice_record)

| Name          | Type                 | Nullable | Unique | Default | Index | Primary | Generated | describe |
| ------------- | -------------------- | -------- | ------ | ------- | ----- | ------- | --------- | -------- |
| id            | int                  | false    | false  |         |       | true    | true      | 主键     |
| user_id       | int                  | false    | false  |         | true  | false   | false     | 用户ID   |
| task_id       | int                  | false    | false  |         | true  | false   | false     | 任务ID   |
| run_id        | int                  | false    | false  |         | true  | false   | false     | 所属Run  |
| sent_at       | timestamp            | false    | false  | now()   |       | false   | false     | 发送时间 |
| channel       | enum(email,letter)   | false    | false  | email   |       | false   | false     | 通道     |
| status        | enum(success,failed) | false    | false  | success |       | false   | false     | 状态     |
| error_message | varchar(255)         | true     | false  |         |       | false   | false     | 错误信息 |
| created_at    | timestamp            | false    | false  | now()   |       | false   | false     | 创建时间 |

Relations:

- belongsTo -> User (fk: user_id)
- belongsTo -> Task (fk: task_id)
- belongsTo -> NoticeRun (fk: run_id)

Constraints:

- unique: user_id, task_id, DATE(sent_at) // 系统每日只发送一次的去重约束（逻辑约束，可在实现层面保证）

## Endpoints

### POST /todo-notice/setting/get

Summary: 获取用户通知设置
Auth: required

Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| - | - | - | 无请求体 |

Response 200
| Field | Type | Description |
|---------------|----------|---------------------------|
| emailEnabled | boolean | 是否开启邮件通知 |
| letterEnabled | boolean | 是否开启站内信通知 |
| preferredTime | string | 通知时间(HH:mm) |

Errors
| Code | Message |
|------|---------|
| 401 | Unauthorized |

### POST /todo-notice/setting/update

Summary: 更新用户通知设置
Auth: required

Request Body
| Field | Type | Required | Description |
|---------------|----------|----------|------------------------------------------|
| emailEnabled | boolean | false | 是否开启邮件通知 |
| letterEnabled | boolean | false | 是否开启站内信通知 |
| preferredTime | string | false | 通知时间(HH:mm)，24小时制，步长30分钟 |

Response 200
| Field | Type | Description |
|---------|---------|-------------|
| success | boolean | 是否成功 |

Errors
| Code | Message |
|------|---------|
| 401 | Unauthorized |
| 400 | Bad Request |

### POST /todo-notice/admin/trigger

Summary: 管理员手动触发今日通知
Auth: required

Request Body
| Field | Type | Required | Description |
|-----------|--------------------------|----------|-------------------------------------|
| date | string | false | 目标日期(YYYY-MM-DD)，默认今日 |
| userId | int | false | 仅对指定用户触发（可选） |
| channel | enum(email,letter,both) | false | 触发渠道，默认 email |

Response 200
| Field | Type | Description |
|-----------|------|----------------|
| runId | int | 本次运行ID |
| runAt | Date | 触发时间 |
| sentCount | int | 实际发送条数 |

Errors
| Code | Message |
|------|---------|
| 401 | Unauthorized |
| 403 | Forbidden |

### POST /todo-notice/admin/records

Summary: 管理员查询通知记录
Auth: required

Request Body
| Field | Type | Required | Description |
|---------|--------------------------|----------|--------------------------|
| page | int | false | 页码 |
| limit | int | false | 每页数量 |
| date | string | false | 发送日期(YYYY-MM-DD)过滤 |
| userId | int | false | 用户ID过滤 |
| status | enum(success,failed) | false | 状态过滤 |
| channel | enum(email,letter) | false | 渠道过滤 |

Response 200
| Field | Type | Description |
|-------|------------------|-------------|
| page | int | 当前页码 |
| result| NoticeRecord[] | 记录列表 |
| total | int | 总数 |

Errors
| Code | Message |
|------|---------|
| 401 | Unauthorized |
| 403 | Forbidden |

### POST /todo-notice/admin/runs

Summary: 管理员查询通知运行记录
Auth: required

Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| page | int | false | 页码 |
| limit | int | false | 每页数量 |

Response 200
| Field | Type | Description |
|-------|----------------|-------------|
| page | int | 当前页码 |
| result| NoticeRun[] | 运行记录 |
| total | int | 总数 |

Errors
| Code | Message |
|------|---------|
| 401 | Unauthorized |
| 403 | Forbidden |

## Rules

- 定时推送：系统按用户配置的 preferred_time 扫描“今日截止”的任务，向开启相应渠道的用户发送通知（邮件/站内信）。
- 只发送一次：同一用户+同一任务+同一天+同一渠道，仅发送一次，需进行去重校验。
- 管理员再次触发：允许管理员手动触发一次运行（可指定渠道），生成新的 NoticeRun 与对应 NoticeRecord。
- 任务过滤：仅包含设置了截止时间且截止日期为“今日”的任务；无截止时间不通知。
- 通知渠道：支持 email 与 letter 两种；若用户同时开启，则分别发送两条记录。
- 时间步长：preferred_time 步长为 30 分钟，格式 HH:mm（24小时制）。
- 模板渲染：按 PRD 模板渲染邮件内容（标题/正文/链接等）；站内信复用相同内容的文本版本。
- 失败记录：发送失败需记录 error_message 且 status=failed。

## Auth

- C 端接口（/setting/\*）：需要登录态（Bearer）
- B 端接口（/admin/\*）：需要管理员角色（后续可加角色守卫）

## Events

- Published:
  - NoticeRunCreated
  - NoticeRecordCreated
  - NoticeRecordFailed
- Subscribed:
  - TaskDueDateChanged（可选，供未来优化）

## Acceptance

- 用户开启邮件且存在今日截止任务：在其 preferred_time 收到邮件；新增一条 channel=email 的 NoticeRecord。
- 用户开启站内信且存在今日截止任务：在其 preferred_time 收到站内信；新增一条 channel=letter 的 NoticeRecord。
- 用户关闭对应渠道：在其 preferred_time 不发送对应渠道通知，不生成该渠道记录。
- 同一任务同一天同一渠道不重复发送：再次系统扫描不新增记录。
- 管理员手动触发（email/letter/both）：创建一条 NoticeRun，sent_count 为实际发送条数；对应新增 NoticeRecord。
- 记录查询：/admin/records 返回分页结构（page/result/total），数据包含 sent_at/status 等信息。
