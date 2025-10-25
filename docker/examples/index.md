# Docker 示例

## 多阶段构建示例

以下是一个完整的多阶段构建 Dockerfile 示例：

```dockerfile
# --- STAGE 1: Dependencies Stage ---
# 目标：安装所有依赖项。这一层仅在 package.json 或 pnpm-lock.yaml 变化时才会重新构建。
FROM node:18-alpine AS dependencies
WORKDIR /app
# 只复制构建依赖所需的文件
COPY package.json pnpm-lock.yaml ./
# 安装依赖
# 注意：这里使用 pnpm install --frozen-lockfile 更符合CI/CD的最佳实践
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# --- STAGE 2: Builder Stage ---
# 目标：编译源代码。这一层会利用上一阶段已安装的依赖。
# 它会在你的源代码（除了依赖定义文件）发生变化时重新构建。
FROM node:18-alpine AS builder
WORKDIR /app
# 从第一阶段复制已安装的依赖
COPY --from=dependencies /app/node_modules ./node_modules
# 复制所有剩余的源代码和配置文件
COPY . .
# 执行构建命令
RUN npm install -g pnpm && pnpm run build

# --- STAGE 3: Production Stage ---
# 目标：创建一个最小化的生产镜像来提供服务。
FROM nginx:stable-alpine AS production
# 从第二阶段（builder）复制编译好的静态文件
COPY --from=builder /app/dist /usr/share/nginx/html
# （可选）复制自定义的 Nginx 配置文件
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# 暴露端口
EXPOSE 80
# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]
```

## Docker Compose 示例

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 最佳实践

1. **使用 .dockerignore 文件**
2. **多阶段构建减少镜像大小**
3. **合理利用构建缓存**
4. **使用非 root 用户运行应用**
5. **定期更新基础镜像**
