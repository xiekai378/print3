# API 接口文档

## 接口规范

### 请求格式
```typescript
{
  url: string,      // 接口地址
  method: string,   // 请求方法
  params?: object,  // URL参数
  data?: object,    // 请求体数据
  headers?: object  // 请求头
}
```

### 响应格式
```typescript
{
  code: number,     // 状态码
  data: any,        // 响应数据
  message: string   // 提示信息
}
```

### 状态码说明
- 200: 成功
- 400: 请求参数错误
- 401: 未登录或token过期
- 403: 无权限
- 404: 资源不存在
- 500: 服务器错误

## 用户模块

### 1. 用户登录
```typescript
POST /api/user/login
Request: {
  username: string
  password: string
}
Response: {
  code: 200
  data: {
    token: string
    userInfo: {
      id: number
      username: string
      role: string
    }
  }
  message: "登录成功"
}
```

### 2. 获取用户信息
```typescript
GET /api/user/info
Response: {
  code: 200
  data: {
    id: number
    username: string
    role: string
    permissions: string[]
  }
  message: "success"
}
```

## 产品管理模块

### 1. 获取产品类型列表
```typescript
GET /api/product-types
Response: {
  code: 200
  data: {
    list: Array<{
      id: number
      name: string
      code: string
      description: string
    }>
    total: number
  }
  message: "success"
}
```

### 2. 新增产品类型
```typescript
POST /api/product-types
Request: {
  name: string
  code: string
  description: string
}
Response: {
  code: 200
  data: {
    id: number
  }
  message: "创建成功"
}
```

## 材料管理模块

### 1. 获取材料列表
```typescript
GET /api/materials
Params: {
  type?: string
  keyword?: string
  page: number
  pageSize: number
}
Response: {
  code: 200
  data: {
    list: Array<{
      id: number
      name: string
      type: string
      spec: string
      price: number
      unit: string
      supplier: string
    }>
    total: number
  }
  message: "success"
}
```

### 2. 新增材料
```typescript
POST /api/materials
Request: {
  name: string
  type: string
  spec: string
  price: number
  unit: string
  supplier: string
  description?: string
}
Response: {
  code: 200
  data: {
    id: number
  }
  message: "创建成功"
}
```

## 工艺管理模块

### 1. 获取工艺列表
```typescript
GET /api/crafts
Params: {
  type?: string
  keyword?: string
  page: number
  pageSize: number
}
Response: {
  code: 200
  data: {
    list: Array<{
      id: number
      name: string
      type: string
      spec: string
      priceType: string
      price: number
      minQuantity: number
    }>
    total: number
  }
  message: "success"
}
```

### 2. 新增工艺
```typescript
POST /api/crafts
Request: {
  name: string
  type: string
  spec: string
  priceType: string
  price: number
  minQuantity: number
  description?: string
}
Response: {
  code: 200
  data: {
    id: number
  }
  message: "创建成功"
}
```

## 报价模块

### 1. 创建报价单
```typescript
POST /api/quotes
Request: {
  customer: string
  productType: string
  size: {
    length: number
    width: number
    height: number
  }
  quantity: number
  material: string
  crafts: string[]
}
Response: {
  code: 200
  data: {
    id: number
    totalPrice: number
    details: {
      materialCost: number
      processingCost: number
      craftCost: number
    }
  }
  message: "报价成功"
}
```

### 2. 获取报价历史
```typescript
GET /api/quotes
Params: {
  startDate?: string
  endDate?: string
  customer?: string
  page: number
  pageSize: number
}
Response: {
  code: 200
  data: {
    list: Array<{
      id: number
      customer: string
      productType: string
      quantity: number
      totalPrice: number
      createTime: string
      status: string
    }>
    total: number
  }
  message: "success"
} 