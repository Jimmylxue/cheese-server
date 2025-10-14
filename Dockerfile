FROM node:20.14.0

WORKDIR /app

# 复制源代码
COPY . .

RUN npm install -g pnpm
# RUN npm install -g pm2

# # 设置 CI 环境变量，避免交互式提示
# ENV CI=true

# # 安装依赖
# RUN pnpm install

# # 构建应用
# RUN pnpm build

# 暴露端口
EXPOSE 9999

CMD ["sh", "server.sh"]