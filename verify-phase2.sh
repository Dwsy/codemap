#!/bin/bash
echo "=== Phase 2 验收测试 ==="
echo ""

BASE_URL="http://localhost:3456"

# 1. 健康检查
echo "1. 健康检查..."
response=$(curl -s "$BASE_URL/api/v1/health")
if echo "$response" | jq -e '.success' > /dev/null; then
  echo "   ✅ API v1 健康检查通过"
else
  echo "   ❌ API v1 健康检查失败"
  echo "$response"
fi
echo ""

# 2. 获取所有项目
echo "2. 获取所有项目..."
response=$(curl -s "$BASE_URL/api/v1/projects")
if echo "$response" | jq -e '.success' > /dev/null; then
  count=$(echo "$response" | jq '.data | length')
  echo "   ✅ 获取项目成功，共 $count 个项目"
else
  echo "   ❌ 获取项目失败"
  echo "$response"
fi
echo ""

# 3. 获取单个项目
echo "3. 获取单个项目..."
path=$(echo -n "/Users/dengwenyu/.pi/agent/skills/codemap" | jq -sRr @uri)
response=$(curl -s "$BASE_URL/api/v1/projects/$path")
if echo "$response" | jq -e '.success' > /dev/null; then
  name=$(echo "$response" | jq -r '.data.name')
  echo "   ✅ 获取项目成功: $name"
else
  echo "   ❌ 获取项目失败"
  echo "$response"
fi
echo ""

# 4. 获取项目的 CodeMaps
echo "4. 获取项目的 CodeMaps..."
response=$(curl -s "$BASE_URL/api/v1/projects/$path/codemaps")
if echo "$response" | jq -e '.success' > /dev/null; then
  count=$(echo "$response" | jq '.data | length')
  echo "   ✅ 获取 CodeMaps 成功，共 $count 个"
else
  echo "   ❌ 获取 CodeMaps 失败"
  echo "$response"
fi
echo ""

# 5. 获取所有 CodeMaps
echo "5. 获取所有 CodeMaps..."
response=$(curl -s "$BASE_URL/api/v1/codemaps")
if echo "$response" | jq -e '.success' > /dev/null; then
  count=$(echo "$response" | jq '.data | length')
  echo "   ✅ 获取所有 CodeMaps 成功，共 $count 个"
else
  echo "   ❌ 获取所有 CodeMaps 失败"
  echo "$response"
fi
echo ""

# 6. 获取单个 CodeMap
echo "6. 获取单个 CodeMap..."
codemap_id=$(curl -s "$BASE_URL/api/v1/codemaps" | jq -r '.data[0].id')
if [ "$codemap_id" != "null" ]; then
  response=$(curl -s "$BASE_URL/api/v1/codemaps/$codemap_id")
  if echo "$response" | jq -e '.success' > /dev/null; then
    name=$(echo "$response" | jq -r '.data.name')
    echo "   ✅ 获取 CodeMap 成功: $name"
  else
    echo "   ❌ 获取 CodeMap 失败"
    echo "$response"
  fi
else
  echo "   ⚠️  没有 CodeMap 可测试"
fi
echo ""

# 7. 读取文件内容
echo "7. 读取文件内容..."
file_path=$(echo -n "/Users/dengwenyu/.pi/agent/skills/codemap/README.md" | jq -sRr @uri)
response=$(curl -s "$BASE_URL/api/v1/files?path=$file_path")
if echo "$response" | jq -e '.success' > /dev/null; then
  language=$(echo "$response" | jq -r '.data.language')
  echo "   ✅ 读取文件成功，语言: $language"
else
  echo "   ❌ 读取文件失败"
  echo "$response"
fi
echo ""

# 8. 获取文件树
echo "8. 获取文件树..."
dir_path=$(echo -n "/Users/dengwenyu/.pi/agent/skills/codemap/client/src" | jq -sRr @uri)
response=$(curl -s "$BASE_URL/api/v1/files/tree?path=$dir_path")
if echo "$response" | jq -e '.success' > /dev/null; then
  count=$(echo "$response" | jq '.data | length')
  echo "   ✅ 获取文件树成功，共 $count 项"
else
  echo "   ❌ 获取文件树失败"
  echo "$response"
fi
echo ""

# 9. 检查响应格式
echo "9. 检查响应格式..."
response=$(curl -s "$BASE_URL/api/v1/projects")
has_success=$(echo "$response" | jq 'has("success")')
has_data=$(echo "$response" | jq 'has("data")')
if [ "$has_success" = "true" ] && [ "$has_data" = "true" ]; then
  echo "   ✅ 响应格式正确"
else
  echo "   ❌ 响应格式不正确"
  echo "$response"
fi
echo ""

# 10. 检查 CORS
echo "10. 检查 CORS..."
headers=$(curl -s -I -X OPTIONS "$BASE_URL/api/v1/projects" -H "Origin: http://localhost:5173")
if echo "$headers" | grep -qi "access-control-allow"; then
  echo "   ✅ CORS 配置正确"
else
  echo "   ⚠️  CORS 配置可能不正确"
fi
echo ""

echo "=== Phase 2 验收测试完成 ==="