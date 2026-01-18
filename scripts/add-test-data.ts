#!/usr/bin/env bun
/**
 * 测试数据生成器
 * 为 CodeMap 服务器添加示例数据
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const STORAGE_DIR = process.env.CODEMAP_STORAGE || './storage';
const CODEMAPS_DIR = join(STORAGE_DIR, 'codemaps');

// 确保 codemaps 目录存在
if (!existsSync(CODEMAPS_DIR)) {
  mkdirSync(CODEMAPS_DIR, { recursive: true });
}

// 生成唯一 ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

// 示例 CodeMap 数据
const testCodeMaps = [
  {
    schemaVersion: 1,
    title: "用户登录流程",
    description: "从用户输入凭据到登录成功的完整认证流程",
    mermaidDiagram: `graph TB
    subgraph 前端
        A[登录表单] --> B[提交按钮]
    end
    subgraph 后端
        B --> C[AuthController.login]
        C --> D[AuthService.authenticate]
        D -->|成功| E[生成JWT]
        D -->|失败| F[返回错误]
        E --> G[返回Token]
    end
    subgraph 数据库
        D -->|查询| DB[(Users表)]
    end`,
    traces: [
      {
        id: "1",
        title: "提交登录请求",
        description: "用户在前端填写用户名和密码并提交",
        locations: [
          {
            id: "1a",
            path: "/src/components/LoginForm.vue",
            lineNumber: 45,
            lineContent: "const handleLogin = async () => { const result = await authApi.login(form); };",
            title: "表单提交",
            description: "处理用户登录表单提交"
          }
        ],
        traceTextDiagram: "前端登录\n└── handleLogin < -- 1a",
        traceGuide: "## Motivation\n\n允许用户通过用户名密码登录系统，获取访问权限。\n\n## Details\n\n用户填写表单后，调用后端 API [1a] 提交登录凭证。"
      },
      {
        id: "2",
        title: "验证用户凭据",
        description: "后端验证用户名和密码是否正确",
        locations: [
          {
            id: "2a",
            path: "/src/controllers/AuthController.ts",
            lineNumber: 23,
            lineContent: "const result = await authService.authenticate(username, password);",
            title: "调用认证服务",
            description: "委托认证服务验证凭据"
          },
          {
            id: "2b",
            path: "/src/services/AuthService.ts",
            lineNumber: 15,
            lineContent: "const user = await userRepository.findByUsername(username);",
            title: "查询用户",
            description: "从数据库查找用户记录"
          }
        ],
        traceTextDiagram: "AuthController\n├── authenticate < -- 2a\n└── findByUsername < -- 2b",
        traceGuide: "## Motivation\n\n验证用户身份，确保只有合法用户可以访问系统。\n\n## Details\n\nController [2a] 接收请求后，Service 层 [2b] 查询数据库验证用户凭据。"
      },
      {
        id: "3",
        title: "生成并返回 Token",
        description: "验证成功后生成 JWT Token 并返回",
        locations: [
          {
            id: "3a",
            path: "/src/services/AuthService.ts",
            lineNumber: 28,
            lineContent: "const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '24h' });",
            title: "生成 JWT",
            description: "创建包含用户信息的访问令牌"
          }
        ],
        traceTextDiagram: "AuthService\n└── jwt.sign < -- 3a",
        traceGuide: "## Motivation\n\n使用 JWT Token 实现无状态认证，避免每次请求都查询数据库。\n\n## Details\n\n验证成功后，生成包含用户 ID 的 JWT [3a]，有效期 24 小时。"
      }
    ]
  },
  {
    schemaVersion: 1,
    title: "订单创建流程",
    description: "从用户下单到订单创建完成的完整流程",
    mermaidDiagram: `graph TB
    subgraph 前端
        A[购物车] --> B[结算按钮]
    end
    subgraph 后端
        B --> C[OrderController.create]
        C --> D[OrderService.validate]
        D -->|通过| E[OrderService.createOrder]
        E --> F[InventoryService.decreaseStock]
        E --> G[PaymentService.createPayment]
    end
    subgraph 数据库
        C -->|插入| DB1[(Orders表)]
        F -->|更新| DB2[(Inventory表)]
        G -->|插入| DB3[(Payments表)]
    end`,
    traces: [
      {
        id: "1",
        title: "提交订单",
        description: "用户从购物车提交订单",
        locations: [
          {
            id: "1a",
            path: "/src/components/Cart.vue",
            lineNumber: 67,
            lineContent: "const createOrder = async () => { const order = await orderApi.create(cartItems); };",
            title: "创建订单",
            description: "提交购物车商品创建订单"
          }
        ],
        traceTextDiagram: "购物车组件\n└── createOrder < -- 1a",
        traceGuide: "## Motivation\n\n允许用户将购物车商品转换为正式订单。\n\n## Details\n\n用户点击结算后，调用后端 API [1a] 创建订单。"
      },
      {
        id: "2",
        title: "库存校验",
        description: "验证商品库存是否充足",
        locations: [
          {
            id: "2a",
            path: "/src/services/OrderService.ts",
            lineNumber: 34,
            lineContent: "const stockAvailable = await inventoryService.checkStock(items);",
            title: "检查库存",
            description: "验证所有商品库存充足"
          }
        ],
        traceTextDiagram: "OrderService\n└── checkStock < -- 2a",
        traceGuide: "## Motivation\n\n确保订单商品库存充足，避免超卖问题。\n\n## Details\n\n创建订单前，检查每个商品的库存 [2a]，不足则拒绝订单。"
      },
      {
        id: "3",
        title: "扣减库存并创建支付",
        description: "订单创建后扣减库存并生成支付记录",
        locations: [
          {
            id: "3a",
            path: "/src/services/OrderService.ts",
            lineNumber: 52,
            lineContent: "await inventoryService.decreaseStock(order.items);",
            title: "扣减库存",
            description: "减少商品库存数量"
          },
          {
            id: "3b",
            path: "/src/services/PaymentService.ts",
            lineNumber: 18,
            lineContent: "const payment = await paymentRepository.create({ orderId, amount });",
            title: "创建支付记录",
            description: "生成待支付记录"
          }
        ],
        traceTextDiagram: "OrderService\n├── decreaseStock < -- 3a\n└── PaymentService\n    └── create < -- 3b",
        traceGuide: "## Motivation\n\n确保库存和支付记录的原子性操作，保证数据一致性。\n\n## Details\n\n订单创建后，同步扣减库存 [3a] 并创建支付记录 [3b]。"
      }
    ]
  },
  {
    schemaVersion: 1,
    title: "文件上传处理流程",
    description: "从用户上传文件到存储并返回访问链接的完整流程",
    mermaidDiagram: `graph TB
    subgraph 前端
        A[上传组件] --> B[选择文件]
        B --> C[点击上传]
    end
    subgraph 后端
        C --> D[FileController.upload]
        D --> E[FileValidator.validate]
        E -->|通过| F[FileStorage.save]
        E -->|失败| G[返回错误]
        F --> H[生成访问链接]
    end
    subgraph 存储
        F -->|保存| S3[(对象存储)]
    end`,
    traces: [
      {
        id: "1",
        title: "选择并上传文件",
        description: "用户选择文件并触发上传",
        locations: [
          {
            id: "1a",
            path: "/src/components/FileUpload.vue",
            lineNumber: 32,
            lineContent: "const handleUpload = async (file) => { const result = await fileApi.upload(file); };",
            title: "文件上传",
            description: "处理文件上传请求"
          }
        ],
        traceTextDiagram: "上传组件\n└── handleUpload < -- 1a",
        traceGuide: "## Motivation\n\n提供用户友好的文件上传功能，支持多种文件类型。\n\n## Details\n\n用户选择文件后，调用后端 API [1a] 上传文件。"
      },
      {
        id: "2",
        title: "文件验证",
        description: "验证文件类型、大小等是否合规",
        locations: [
          {
            id: "2a",
            path: "/src/services/FileValidator.ts",
            lineNumber: 12,
            lineContent: "if (!ALLOWED_TYPES.includes(file.mimetype)) throw new Error('Invalid file type');",
            title: "类型验证",
            description: "检查文件 MIME 类型"
          },
          {
            id: "2b",
            path: "/src/services/FileValidator.ts",
            lineNumber: 18,
            lineContent: "if (file.size > MAX_SIZE) throw new Error('File too large');",
            "title": "大小验证",
            "description": "检查文件大小限制"
          }
        ],
        traceTextDiagram: "FileValidator\n├── checkType < -- 2a\n└── checkSize < -- 2b",
        traceGuide: "## Motivation\n\n防止恶意文件上传，保护系统安全。\n\n## Details\n\n验证文件类型 [2a] 和大小 [2b]，不符合要求则拒绝上传。"
      },
      {
        id: "3",
        title: "存储并返回链接",
        description: "将文件保存到对象存储并生成访问链接",
        locations: [
          {
            id: "3a",
            path: "/src/services/FileStorage.ts",
            lineNumber: 24,
            lineContent: "const key = await s3Client.upload(bucket, file.buffer, filename);",
            title: "上传到 S3",
            description: "将文件保存到对象存储"
          },
          {
            id: "3b",
            path: "/src/services/FileStorage.ts",
            lineNumber: 28,
            lineContent: "const url = generateSignedUrl(key, expiresIn);",
            title: "生成签名链接",
            description: "创建带签名的访问链接"
          }
        ],
        traceTextDiagram: "FileStorage\n├── s3Client.upload < -- 3a\n└── generateSignedUrl < -- 3b",
        traceGuide: "## Motivation\n\n使用对象存储提供可靠的文件存储服务，通过签名链接控制访问权限。\n\n## Details\n\n文件验证通过后，上传到 S3 [3a] 并生成带时效的访问链接 [3b]。"
      }
    ]
  }
];

// 写入测试数据
const projectPath = "/Users/dengwenyu/Dev/code/company/Jly"; // 使用已注册的测试项目

testCodeMaps.forEach((codemap) => {
  const id = generateId();
  const codemapData = {
    id,
    projectPath,
    ...codemap,
    createdAt: new Date().toISOString()
  };
  const filePath = join(CODEMAPS_DIR, `${id}.json`);
  writeFileSync(filePath, JSON.stringify(codemapData, null, 2), 'utf-8');
  console.log(`✅ Created: ${id}.json - ${codemap.title}`);
});

console.log(`\n📊 Total test data added: ${testCodeMaps.length} CodeMaps`);
console.log(`📂 Project: ${projectPath}`);
console.log(`📂 Storage directory: ${CODEMAPS_DIR}`);