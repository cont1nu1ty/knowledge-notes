# PocketBase 示例

## 基本使用示例

### 1. 启动 PocketBase

```go
package main

import (
    "log"
    "github.com/pocketbase/pocketbase"
)

func main() {
    app := pocketbase.New()

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}
```

### 2. 创建 Collection

通过 PocketBase 管理界面或 API 创建 collection：

```json
{
  "name": "posts",
  "type": "base",
  "schema": [
    {
      "name": "title",
      "type": "text",
      "required": true
    },
    {
      "name": "content",
      "type": "editor",
      "required": true
    },
    {
      "name": "author",
      "type": "relation",
      "options": {
        "collectionId": "users",
        "cascadeDelete": false
      }
    }
  ]
}
```

### 3. API 使用示例

#### 创建记录
```javascript
// 创建新文章
const response = await fetch('/api/collections/posts/records', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    title: '我的第一篇文章',
    content: '这是文章内容...',
    author: 'USER_ID'
  })
});
```

#### 查询记录
```javascript
// 获取所有文章
const response = await fetch('/api/collections/posts/records');
const data = await response.json();
```

#### 过滤查询
```javascript
// 根据作者过滤文章
const response = await fetch('/api/collections/posts/records?filter=author="USER_ID"');
```

## 高级功能

### 1. 自定义 API Rules

```javascript
// 只允许作者编辑自己的文章
@collection.posts.author = @request.auth.id
```

### 2. 文件上传

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/files/collection_name/record_id/filename', {
  method: 'POST',
  body: formData
});
```

### 3. 实时订阅

```javascript
// 订阅文章更新
const unsubscribe = pb.collection('posts').subscribe('*', function (e) {
  console.log('文章更新:', e.record);
});
```

## 最佳实践

1. **合理设计 Collection 结构**
2. **使用适当的 API Rules 保护数据**
3. **利用关系字段建立数据关联**
4. **使用过滤器优化查询性能**
5. **定期备份数据库**
