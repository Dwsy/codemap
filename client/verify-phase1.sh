#!/bin/bash
echo "=== Phase 1 验收测试 ==="
echo ""

# 1. 检查目录结构
echo "1. 检查 client/ 目录结构..."
if [ -d "client/src" ]; then
  echo "   ✅ client/src 存在"
else
  echo "   ❌ client/src 不存在"
fi

if [ -d "client/src/router" ]; then
  echo "   ✅ router/ 存在"
else
  echo "   ❌ router/ 不存在"
fi

if [ -d "client/src/stores" ]; then
  echo "   ✅ stores/ 存在"
else
  echo "   ❌ stores/ 不存在"
fi

if [ -d "client/src/views" ]; then
  echo "   ✅ views/ 存在"
else
  echo "   ❌ views/ 不存在"
fi

if [ -d "client/src/components" ]; then
  echo "   ✅ components/ 存在"
else
  echo "   ❌ components/ 不存在"
fi

echo ""

# 2. 检查配置文件
echo "2. 检查配置文件..."
if [ -f "client/vite.config.ts" ]; then
  echo "   ✅ vite.config.ts 存在"
else
  echo "   ❌ vite.config.ts 不存在"
fi

if [ -f "client/tsconfig.json" ]; then
  echo "   ✅ tsconfig.json 存在"
else
  echo "   ❌ tsconfig.json 不存在"
fi

if [ -f "client/tailwind.config.js" ]; then
  echo "   ✅ tailwind.config.js 存在"
else
  echo "   ❌ tailwind.config.js 不存在"
fi

if [ -f "client/postcss.config.js" ]; then
  echo "   ✅ postcss.config.js 存在"
else
  echo "   ❌ postcss.config.js 不存在"
fi

echo ""

# 3. 检查环境变量
echo "3. 检查环境变量..."
if [ -f "client/.env.development" ]; then
  echo "   ✅ .env.development 存在"
  cat client/.env.development | sed 's/^/      /'
else
  echo "   ❌ .env.development 不存在"
fi

if [ -f "client/.env.production" ]; then
  echo "   ✅ .env.production 存在"
  cat client/.env.production | sed 's/^/      /'
else
  echo "   ❌ .env.production 不存在"
fi

echo ""

# 4. 检查依赖
echo "4. 检查依赖..."
cd client

if bun pm ls | grep -q "vue"; then
  echo "   ✅ Vue 已安装"
  bun pm ls | grep vue | head -1 | sed 's/^/      /'
else
  echo "   ❌ Vue 未安装"
fi

if bun pm ls | grep -q "vue-router"; then
  echo "   ✅ Vue Router 已安装"
else
  echo "   ❌ Vue Router 未安装"
fi

if bun pm ls | grep -q "pinia"; then
  echo "   ✅ Pinia 已安装"
else
  echo "   ❌ Pinia 未安装"
fi

if bun pm ls | grep -q "monaco-editor"; then
  echo "   ✅ Monaco Editor 已安装"
else
  echo "   ❌ Monaco Editor 未安装"
fi

if bun pm ls | grep -q "tailwindcss"; then
  echo "   ✅ Tailwind CSS 已安装"
else
  echo "   ❌ Tailwind CSS 未安装"
fi

cd ..
echo ""

# 5. 检查核心文件
echo "5. 检查核心文件..."
files=(
  "client/src/main.ts"
  "client/src/App.vue"
  "client/src/router/index.ts"
  "client/src/stores/projects.ts"
  "client/src/stores/codemaps.ts"
  "client/src/stores/codeViewer.ts"
  "client/src/stores/ui.ts"
  "client/src/views/Dashboard.vue"
  "client/src/views/Project.vue"
  "client/src/views/View.vue"
  "client/src/views/Infographic.vue"
  "client/src/components/layout/Header.vue"
  "client/src/components/layout/Sidebar.vue"
  "client/src/styles/main.css"
  "client/src/types/index.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "   ✅ $file"
  else
    echo "   ❌ $file"
  fi
done

echo ""
echo "=== Phase 1 验收测试完成 ==="