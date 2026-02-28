# Feature: 客户端用户签到

Module: checkin Version: 0.1.0 ID: c_sign
Domain: 客户端用户签到操作，记录用户签到的时间，以及签到时的经纬度信息。

## Entities

### CheckinRecord (table: checkin_record)

| Name      | Type          | Nullable | Unique | Default | Index | Primary | Generated |
| --------- | ------------- | -------- | ------ | ------- | ----- | ------- | --------- |
| id        | int           | false    | false  |         |       | true    | true      |
| userId    | int           | false    | false  |         | true  | false   | false     |
| checkedAt | datetime      | false    | false  |         |       | false   | false     |
| lat       | decimal(10,6) | true     | false  |         |       | false   | false     |
| lng       | decimal(10,6) | true     | false  |         |       | false   | false     |

Relations:

- belongsTo -> User (fk: userId, onDelete: CASCADE)

Constraints:

- unique: userId, checkedAt

## Endpoints

### POST /checkin/sign

Summary: 用户签到
Auth: required

Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| lat | number | false | 签到纬度 |
| lng | number | false | 签到经度 |

Response 200
| Field | Type | Description |
|-------|------|-------------|
| id | number | 签到记录ID |
| checkedAt | string | 签到时间 |
| lat | number | 签到纬度 |
| lng | number | 签到经度 |

Errors
| Code | Message |
|------|-------------|
| 400 | 当日已签到 |

## Rules

- 记录签到时间（服务端当前时间）
- 记录签到时的经纬度（可选）
- 同一用户在同一天内可能需要根据具体业务规则限制签到次数（此处假设需记录每次签到，或由业务逻辑控制频率，Feature中暂不强加唯一约束除基础数据外，但根据PRD描述未提及限制，暂且保留基础记录功能）

## Auth

- 需要用户登录 (AuthGuard)

## Events

- Published: [UserSigned]
- Subscribed: []

## Acceptance

- 用户携带经纬度请求签到，成功返回签到记录
- 用户不携带经纬度请求签到，成功返回签到记录（经纬度为空）
- 未登录用户请求签到，返回 401
