# PocketBase 学习笔记

## 概述

PocketBase 是一个极其轻量级但功能完整的开源后端平台，由 Go 编写，目标是为全栈开发者和快速原型开发场景提供"即下即用"的本地部署型 BaaS（Backend as a Service）解决方案。

## 安装与配置

引入 github/pocketbase，在 main.go 中调用启动即可使用功能。

## 核心特性及简易原理

PocketBase 使得快速搭建原型系统成为可能，包含以下功能：

- **SQLite 数据库支持**
- **登录验证**
- **自动生成 collections 的 API**
- **Rules 和自定义的过滤语法**
- **文件上传**
- **WebSocket 通信功能**

### API Rules and Filters

API Rules 指对自动生成供 `{collections}` 使用通用的 API（如 list、view、create、update、delete 等）的访问控制、数据筛选。

#### 访问控制

根据 filters 的不同，区分为 pb 引擎和 collection：

**1. 引擎级别：**
- `@request.headers.*` - 请求头字段，如 `@request.headers.user-agent`
- `@request.query.*` - URL 查询参数，如 `@request.query.token`
- `@request.body.*` - 请求体字段（POST / PATCH），如 `@request.body.email`
- `@request.auth.*` - 验证通过的用户上下文（来自 token），如 `@request.auth.id`, `@request.auth.email`

**2. Collection 级别：**
对 collection 中定义的元素进行判断，如 `@collection.users.id ?= @request.auth.id` 当登录用户的 id 存在于 users 中即可进行操作。

## 问题与解决

## 参考链接
