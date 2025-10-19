# 模块名
# Docker：项目容器化实践

## 概述
Docker 是一个开源的应用容器引擎，它允许开发者将应用及其依赖打包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux、Windows 或 macOS 机器上，也可以实现虚拟化。它彻底解决了“在我电脑上能跑”的环境一致性问题，是现代化软件开发与部署的基石。

本次实践旨在将项目应用（如前端 Web 服务、后端 API 服务）容器化，通过 `Dockerfile` 定义标准化的运行环境，并最终利用 `docker-compose` 进行多容器应用的编排与管理。

## 安装与配置
首先，确保开发与部署环境中已安装 Docker Engine。

### 安装：
- **Windows/macOS**: 安装 Docker Desktop。
- **Linux**: 根据具体的发行版，遵循官方指南进行安装。

### 核心配置 (Dockerfile)： 
`Dockerfile` 是一个文本文件，其中包含了一系列用户可以调用来构建镜像的指令。它是实现容器化的核心。
第一阶段 (Dependencies): 只安装依赖。这一层仅在 package.json 或锁文件变更时才重新构建。
第二阶段 (Builder): 编译源代码。这一层利用第一阶段的依赖，并在源代码变更时重新构建。
第三阶段 (Production): 运行环境。这是最终的轻量级镜像，只包含第二阶段的构建产物。

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
## 核心特性及简易原理

### 1. 分层镜像 (Layered Images)
- **原理**：Docker 镜像并非一个单一文件，而是由多个只读的“层”堆叠而成。`Dockerfile` 中的每一条指令（如 `FROM`, `COPY`, `RUN`）都会创建一个新的层。
- **优势**：
  - **复用性**：不同的镜像可以共享相同的底层。
  - **高效性**：当镜像的某一层发生变化时，Docker 只需重新构建该层及其后续层，无需从头开始。

### 2. 构建缓存 (Build Cache)
- **原理**：Docker 在构建镜像时，会检查每一条指令。如果该指令及其依赖的文件没有发生变化，Docker 会直接使用上一次构建时生成的缓存层，而不是重新执行该指令。
- **优化实践**：`Dockerfile` 指令的顺序至关重要。将最不常变化的指令放在前面，最常变化的（如 `COPY . .`）放在后面，可以最大化利用缓存，显著提升构建速度。这就是为什么上例中先 `COPY package.json` 再 `RUN npm install`。

### 3. 多阶段构建 (Multi-stage Builds)
- **原理**：如上方案例所示，在一个 `Dockerfile` 中可以使用多个 `FROM` 指令。每个 `FROM` 开始一个新的构建阶段。你可以选择性地将前一个阶段的产物（Artifacts）复制到下一个阶段，而完全抛弃前一个阶段的所有内容（包括编译工具、开发依赖等）。
- **核心优势**：最终的生产镜像可以非常小且安全。上例中，最终的 Nginx 镜像只包含了构建好的静态文件，完全不含 Node.js、npm、源代码等任何构建时才需要的工具，体积可能从 1GB+ 缩小到 20MB 左右。

### 4. `.dockerignore` 文件
- **原理**：类似于 `.gitignore`，在项目根目录创建 `.dockerignore` 文件可以告诉 Docker 在执行 `COPY` 或 `ADD` 指令时忽略哪些文件或目录。
- **作用**：
  - 避免将不必要的文件（如 `node_modules`, `.git`, `dist`, `*.log`）复制到镜像中，减小镜像体积。
  - 避免不必要的文件变更导致缓存失效。

## 问题与解决

