# Feature: 图片分享

Module: imgCloud Version: 0.1.0 ID: img_share
Domain: 一个基础的分享系统，提供基础的分享、取消分享、查询分享功能。当前实现支持创建分享链接、访问码验证、过期控制及管理员管理。

## Entities

### ImgShare (table: img_share)

| Name        | Type        | Nullable | Unique | Default | Index | Primary | Generated | describe |
| ----------- | ----------- | -------- | ------ | ------- | ----- | ------- | --------- | -------- |
| id          | int         | false    | false  |         |       | true    | true      | 主键     |
| token       | varchar(64) | false    | true   |         |       | false   | false     | 分享令牌 |
| type        | enum        | false    | false  |         |       | false   | false     | 分享类型 |
| user_id     | int         | false    | false  |         |       | false   | false     | 创建者ID |
| resource_id | int         | true     | false  |         |       | false   | false     | 资源ID   |
| folder_id   | int         | true     | false  |         |       | false   | false     | 文件夹ID |
| expire_at   | timestamp   | true     | false  |         |       | false   | false     | 过期时间 |
| access_code | varchar(64) | true     | false  |         |       | false   | false     | 提取码   |
| created_at  | timestamp   | false    | false  | now()   |       | false   | false     | 创建时间 |
| is_delete   | boolean     | false    | false  | false   |       | false   | false     | 是否软删 |
| deleted_at  | timestamp   | true     | false  |         |       | false   | false     | 删除时间 |

Relations:

- belongsTo -> User (fk: user_id)
- belongsTo -> ImgResource (fk: resource_id, nullable)
- belongsTo -> ImgFolder (fk: folder_id, nullable)

Constraints:

- unique: token

## Endpoints

### POST /img-cloud/share/create

Summary: 创建分享链接
Auth: required

Request Body
| Field | Type | Required | Description |
|-----------|------------------------|----------|-----------------------------------------------|
| type | enum(ShareType) | true | 分享类型：file 或 folder |
| targetId | int | true | 资源或文件夹的 ID |
| validity | int(ShareValidityPeriod)| true | 有效期（天）：1、7、30，-1 表示永久 |
| accessCode| string(6) | false | 提取码（可选） |

Response 200
| Field | Type | Description |
|-----------|-----------|--------------------|
| shareLink | string | 前端分享访问链接 |
| token | string | 分享令牌 |
| expireAt | Date|null | 过期时间，永久为 null |
| accessCode| string|null | 提取码 |

Errors
| Code | Message |
|------|---------------------------------------------|
| 404 | Resource not found or access denied |

### POST /img-cloud/share/cancel

Summary: 取消分享（软删除）
Auth: required

Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | int | true | 分享ID |

Response 200
| Field | Type | Description |
|-------|------|-------------|
| success| boolean | 是否成功 |

Errors
| Code | Message |
|------|---------------------|
| 404 | Share not found |
| 403 | Access denied |

### POST /img-cloud/share/list

Summary: 查询当前用户的分享列表
Auth: required

Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| page | int | false | 页码 |
| limit | int | false | 每页数量 |

Response 200
| Field | Type | Description |
|-------|-------------|-------------|
| page | int | 当前页码 |
| result| ImgShare[] | 分享列表 |
| total | int | 总数 |

### POST /img-cloud/share/info

Summary: 获取分享基础信息（访问前检查）
Auth: optional

Request Body
| Field | Type | Required | Description |
|-------|--------|----------|-------------|
| token | string | true | 分享令牌 |

Response 200
| Field | Type | Description |
|-----------|-----------------|-----------------------------------|
| isValid | boolean | 分享是否有效（未过期且未删除） |
| isLocked | boolean | 是否需要提取码 |
| type | enum(ShareType) | 分享类型 |
| creatorId | int | 分享创建者用户ID |
| expireAt | Date|null | 过期时间 |
| data | object|null | 分享内容详情（仅当无锁或已解锁时返回，否则为null）|

Errors
| Code | Message |
|------|---------------------|
| 404 | Share not found |

### POST /img-cloud/share/access

Summary: 验证提取码并获取分享内容
Auth: optional

Request Body
| Field | Type | Required | Description |
|-------|--------|----------|-------------|
| token | string | true | 分享令牌 |
| code | string | true | 提取码 |

Response 200
| Field | Type | Description |
|-----------|-----------------|-----------------------------------|
| isValid | boolean | 分享是否有效 |
| type | enum(ShareType) | 分享类型 |
| data | object | 分享内容详情（验证通过后返回） |

data (type = file)
| Field | Type | Description |
|-----------|---------|-----------------|
| id | int | 资源ID |
| url | string | 文件访问地址 |
| filename | string | 文件名 |
| size | int | 文件大小 |
| mimetype | string | MIME 类型 |
| createdAt | Date | 创建时间 |

data (type = folder)
| Field | Type | Description |
|-----------|-------|-------------|
| id | int | 文件夹ID |
| name | string| 文件夹名称 |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |

Errors
| Code | Message |
|------|---------------------|
| 404 | Share not found |
| 403 | Invalid access code |

### POST /img-cloud/share/admin/list

Summary: 管理员查询所有分享
Auth: required

Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| page | int | false | 页码 |
| limit | int | false | 每页数量 |

Response 200
| Field | Type | Description |
|-------|-------------|-------------|
| page | int | 当前页码 |
| result| ImgShare[] | 分享列表 |
| total | int | 总数 |

### POST /img-cloud/share/admin/update

Summary: 管理员更新分享信息
Auth: required

Request Body
| Field | Type | Required | Description |
|------------|-------------|----------|-------------|
| id | int | true | 分享ID |
| expireAt | Date|null | false | 更新过期时间|
| accessCode | string|null | false | 更新提取码 |

Response 200
| Field | Type | Description |
|-------|------|-------------|
| success| boolean | 是否成功 |

### POST /img-cloud/share/admin/delete

Summary: 管理员删除分享
Auth: required

Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | int | true | 分享ID |

Response 200
| Field | Type | Description |
|-------|------|-------------|
| success| boolean | 是否成功 |

## Rules

- 所有权校验：仅允许资源/文件夹的所有者创建或取消分享链接。
- 令牌唯一：生成随机 token，若已存在则重试直到唯一。
- 有效期计算：`validity = -1` 表示永久（`expireAt = null`）；否则为当前日期加对应天数。
- 过期处理：过期后 `info` 返回 `isValid = false`。
- 提取码验证：若设置了 `accessCode`，`info` 返回 `isLocked = true` 且不返回 data。必须通过 `access` 验证提取码。
- 链接格式：`shareLink = FRONTEND_URL/share/{token}`，`FRONTEND_URL` 来自配置。
- 软删除：`cancel` 操作设置 `is_delete = true` 和 `deleted_at`。

## Auth

- C端创建/取消/列表：Bearer Token (AuthGuard)。
- C端访问分享：无需认证。
- B端管理：需管理员权限（目前复用 AuthGuard，后续可扩展 RoleGuard）。

## Acceptance

- 能创建带提取码的文件分享：返回 token、链接和 accessCode。
- 访问带提取码的分享：直接 `info` 返回 isLocked=true, data=null。
- 验证提取码：`access` 输入正确 code 返回 data；错误 code 返回 403。
- 取消分享：调用 `cancel` 后，访问该分享返回 404 或 isValid=false。
- 管理员能列出所有分享、更新有效期/提取码并删除。
