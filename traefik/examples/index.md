# Traefik 示例

## Docker Compose 配置示例

### 基本 Traefik 配置

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
    ports:
      - "80:80"
      - "8080:8080"  # Traefik Dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - traefik

  web:
    image: nginx:alpine
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web.rule=Host(`localhost`)"
      - "traefik.http.routers.web.entrypoints=web"
      - "traefik.http.services.web.loadbalancer.server.port=80"
    networks:
      - traefik

networks:
  traefik:
    external: true
```

### 多服务路由配置

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - traefik

  frontend:
    image: nginx:alpine
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`app.example.com`)"
      - "traefik.http.routers.frontend.entrypoints=web"
      - "traefik.http.services.frontend.loadbalancer.server.port=80"
    networks:
      - traefik

  api:
    image: node:alpine
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`api.example.com`) || PathPrefix(`/api`)"
      - "traefik.http.routers.api.entrypoints=web"
      - "traefik.http.services.api.loadbalancer.server.port=3000"
    networks:
      - traefik

networks:
  traefik:
    external: true
```

## 中间件示例

### 1. 添加安全头

```yaml
services:
  traefik:
    # ... 其他配置
    labels:
      - "traefik.http.middlewares.security-headers.headers.customrequestheaders.X-Frame-Options=DENY"
      - "traefik.http.middlewares.security-headers.headers.customrequestheaders.X-Content-Type-Options=nosniff"
      - "traefik.http.middlewares.security-headers.headers.customrequestheaders.X-XSS-Protection=1; mode=block"

  web:
    # ... 其他配置
    labels:
      - "traefik.http.routers.web.middlewares=security-headers"
```

### 2. 路径重写

```yaml
services:
  api:
    labels:
      - "traefik.http.middlewares.api-stripprefix.stripprefix.prefixes=/api"
      - "traefik.http.routers.api.middlewares=api-stripprefix"
```

### 3. 基本认证

```yaml
services:
  traefik:
    labels:
      - "traefik.http.middlewares.auth.basicauth.users=admin:$$2y$$10$$example"

  protected:
    labels:
      - "traefik.http.routers.protected.middlewares=auth"
```

## 负载均衡示例

```yaml
services:
  app1:
    image: nginx:alpine
    labels:
      - "traefik.http.services.app.loadbalancer.server.port=80"
      - "traefik.http.services.app.loadbalancer.server.weight=1"

  app2:
    image: nginx:alpine
    labels:
      - "traefik.http.services.app.loadbalancer.server.port=80"
      - "traefik.http.services.app.loadbalancer.server.weight=2"
```

## 最佳实践

1. **使用外部网络管理服务通信**
2. **合理配置路由规则避免冲突**
3. **使用中间件增强安全性**
4. **监控 Traefik Dashboard 了解流量情况**
5. **定期更新 Traefik 版本**
