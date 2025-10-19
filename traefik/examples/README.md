# 模块名
Traefik 实现前端代理、服务注册

## 概述
Traefik是开源的边缘路由网关，原生支持多种集群，本次学习过程中使用docker进行实践，主要实现前端代理负载均衡、服务注册等功能。

## 安装与配置
对于具备docker的项目，在docker-compose.yml文件的services部分，引入traefik，标注出image、command、ports、volums等内容，并在文件结尾标注使用的网络命名空间。
此时只需要在其他被代理容器标注出lable 就可以正常运行。
如示例中 localhost:8090/api/health的访问，经过配置：
-  "traefik.http.routers.pb.rule=PathPrefix(`/api`)"
就实现 将访问中包含前缀api的请求，反向代理至localhost/api/health。（默认访问80端口）
显然的，这种方式可以对外隐藏访问端口。

## 核心特性及简易原理

### 服务发现
包括(Providers、Entrypoints、Routers、Services、Middlewares)。
Provider也就是基础组件，Traefik通过docker（k8s、File）实时扫描注册的服务容器或配置文件（监听变化，无需重启即可更新路由）。
「command:
  - "--providers.docker=true"
」
比如，当pb容器（在yml中配置了traefik.http.router...）启动/停止服务后，Traefik会自动注册/移除对应路由。
Entrypoints则是Traefik的网络入口，定义接受请求的接口、以及是否监听TCP/UDP。
Routers主要用于分析请求，将对应请求转发。
Services负责配置如何到达最终将处理传入请求的实际服务（如负载均衡）。
Middlewares可以对请求做出一些修改（如在请求发送前增加一些headers）。

### 动态路由
根据服务自动创建/更新路由规则：请求 → 匹配规则 → 目标服务。
如「- "traefik.http.routers.api.rule=PathPrefix(`/api`)"」会通过路由规则实现路径匹配，然后（使用中间件）调整路径/跳转目标。

### 负载均衡
负载均衡器采用加权轮询。
权重计算：通过maxWeight()方法确定服务器最大权重，使用weightGcd()计算权重的最大公约数，确保流量分配比例精准。（此处还有计算最大公约数来减少计算冗余）
动态选择：next()方法实现核心调度逻辑，通过迭代调整当前权重值，优先选择权重较高的服务器。（遍历服务器，计算权值，（优先队列？），被选择的服务器减去总权重（避免下次仍选取））

### TLS 终止（to do）
处理 HTTPS 流量并自动管理证书

### 中间件处理(to do)
在请求到达服务前/响应返回客户端后进行加工


## 问题与解决

## 参考链接
https://cloud.tencent.com/developer/article/1900486（内容详细有java实例）