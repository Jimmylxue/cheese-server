# 验证服务状态

# 查看所有运行中的服务

docker-compose ps

# 查看服务日志

docker-compose logs app # 只看应用
docker-compose logs # 看所有服务

# 进入应用容器

docker-compose exec app bash

# 检查网络

docker network ls
docker network inspect cheese_default

# 管理命令

## 启动所有服务

docker-compose up -d

## 停止所有服务

docker-compose down

## 重新构建并启动

docker-compose up -d --build

## 只重启应用服务

docker-compose restart app

## 查看资源使用

docker-compose top
