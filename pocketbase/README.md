delete/# 模块名

## 概述

PocketBase 是一个极其轻量级但功能完整的开源后端平台，由 Go 编写，目标是为全栈开发者和快速原型开发场景提供“即下即用”的本地部署型 BaaS（Backend as a Service）解决方案。

## 安装与配置

引入github/pocketbase 
main.go中调用启动 即可使用功能

## 核心特性及简易原理

BAAS 使得快速搭建原型系统。（包含SQILTE数据库支持，登录验证，自动生成collections的API rules/自定义的过滤语法，文件上传，websocket的通信功能）

###API rules and filters
    API Rules 指对自动生成供{collections} 使用通用的api（如 list、view、create、update、delete等）的访问控制、数据筛选。
    访问控制：
    根据filters的不同，区分为pb引擎和collection：
    1.引擎：
    @request.headers.*	请求头字段	@request.headers.user-agent
    @request.query.*	URL 查询参数	@request.query.token
    @request.body.*	请求体字段（POST / PATCH）	@request.body.email
    @request.auth.*	验证通过的用户上下文（来自 token）	@request.auth.id, @request.auth.email
    2.collections：
    对collection中定义的元素进行判断，如@collection.users.id ?= @request.auth.id当登录用户的id存在于users中即可进行op。
    
## 问题与解决

## 参考链接