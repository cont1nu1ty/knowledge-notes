# Traefik 学习笔记

## 概述

Traefik 是一个开源的边缘路由网关，原生支持 Docker、Kubernetes 等多种 Provider。  
本次实践基于 Docker，目标是实现前端代理、负载均衡与服务自动注册。

## 安装与配置

在具备 Docker 的项目中，可在 `docker-compose.yml` 的 `services` 部分引入 Traefik 服务，指定以下关键配置：

- `image`：镜像版本  
- `command`：启动参数（如启用 Docker Provider）  
- `ports`：对外暴露的端口  
- `volumes`：挂载 Docker 套接字以便服务发现  
- `networks`：定义网络命名空间  

其他被代理容器只需通过 `labels` 声明路由规则即可。  
例如，以下规则实现对 `/api` 前缀请求的反向代理（默认监听 80 端口）：

- `"traefik.http.routers.pb.rule=PathPrefix(\`/api\`)"`

当访问 localhost:8090/api/health 时，Traefik 会将请求转发至后端服务，实现隐藏实际访问端口的效果。

## 核心特性与原理

核心组件包括 Providers、Entrypoints、Routers、Services、Middlewares。

### 服务发现

**Provider**：Traefik 的数据源。启用 Docker Provider 后，Traefik 会实时监控容器的启动与停止，并自动注册或注销路由。

```yaml
command:
  - "--providers.docker=true"
```

**Entrypoint**：定义 Traefik 接收外部请求的网络入口（TCP/UDP）。

**Router**：分析请求并根据规则转发。

**Service**：定义请求的后端目标及负载均衡策略。

**Middleware**：在请求到达服务前或响应返回客户端后修改报文（如添加 Header、重写路径）。

### 动态路由

Traefik 根据定义的规则动态创建或更新路由：请求 → 匹配规则 → 目标服务。

如 `"traefik.http.routers.api.rule=PathPrefix(\`/api\`)"` 当请求路径匹配 /api 时，Traefik 会自动选择对应的服务并执行必要的中间件操作。

### 负载均衡

Traefik 默认使用加权轮询（Weighted Round Robin）算法。

- **权重计算**：通过 maxWeight() 确定最大权重，weightGcd() 计算最大公约数以减少冗余计算。
- **动态选择**：next() 方法按权重遍历服务实例并分配请求。权重较高的实例获得更多流量。（遍历服务器，计算权值，被选择的服务器减去总权重（避免下次仍选取））

### TLS 终止

处理 HTTPS 流量并自动管理证书

### 中间件处理

在请求到达服务前/响应返回客户端后进行加工

## 问题与解决

## 参考链接

- [Traefik 官方文档](https://doc.traefik.io/traefik/)
- [腾讯云开发者社区 - Traefik 详细教程](https://cloud.tencent.com/developer/article/1900486)
