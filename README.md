# Cheese Server

## 支持 Docker-compose 分离式架构部署

> 单一职责，便于维护

用户请求 → 9999端口 → cheese-app容器 → mysql容器 & redis容器

## 支持swagger 在线调试

- 127.0.0.1:9999/platform/all 查看所有线上接口

  > 可进入 /src/config/swagger/const.ts 查看各个子模块的swagger接口文档
