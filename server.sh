# 切换分支
git checkout server-prod

# # 清空当前工作区
git checkout .

# # 拉取代码
git pull --rebase origin server-prod

npm install -g pm2

# 安装依赖
pnpm install

# 构建
pnpm build

# 删除pm2 容器
pm2 delete chess-api-server

# pm2 运行
pm2-runtime start dist/main.js --name "chess-api-server"
