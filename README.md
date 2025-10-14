Cheese Server

- 支持 Docker-compose 分离式架构部署

> 单一职责，便于维护

用户请求 → 9999端口 → cheese-app容器 → mysql容器 & redis容器
