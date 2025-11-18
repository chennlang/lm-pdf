# LM PDF

<div align="center" style="text-align: center;">
    <h1 style="text-align: center;">LM PDF</h1>
    <p style="text-align: center;">一个大模型时代的 PDF 极速预览方案</p>
    <p style="text-align: center;">1000+页的PDF也能秒加载!</p>
    <p align='center'>
      <a href="/README.md">English</a>
      |
      <b>简体中文</b>
      |
      <a href="README_jp.md">日本語</a>
    </p>
</div>

## 🎯 解决的问题

相比常见的 PDF.js，LM-PDF 专门解决大文件加载速度慢、渲染性能差的问题。无论 PDF 文件有多少页，原始文件有多大，都能秒加载和预览！

**特别适用于大模型回答需要查看引用来源的场景**，如：

- 📚 学术论文阅读和引用验证
- 🔍 长文档快速定位和预览
- 🤖 AI 助手回答的原始资料核查
- 📊 大型报告的即时访问和导航

https://github.com/user-attachments/assets/cd555032-2af5-4ac7-b65b-f3b57f767757

## 📦 仓库结构

```
lm-pdf/
├── backend/              # FastAPI 后端服务
├── packages/
│   ├── easy-pdf/         # React 组件库
│   └── web/             # 演示应用 (Vite + React 18)
├── package.json         # Monorepo 配置
└── pnpm-workspace.yaml  # PNPM 工作区配置
```

## 🚀 功能特性

- **后端服务**: FastAPI 服务的 PDF 转 图片转换
- **组件库**: 可复用的 React PDF 查看器组件
- **演示应用**: 展示所有功能的完整演示

## 🛠️ 技术栈

### 后端

- FastAPI
- pdf2image
- PyMuPDF
- Python 3.8+

### 前端

- React 18
- TypeScript
- Vite
- Ant Design
- Recoil (状态管理)
- PNPM (包管理器)

## 📋 环境要求

- Node.js 18+
- Python 3.8+
- PNPM 8+
- Poppler (用于 PDF 处理)

## 🚀 快速开始

### 1. 设置后端

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python main.py
```

### 2. 设置前端

```bash
# 安装依赖
pnpm install

# 启动演示应用 (这将从源码解析 easy-pdf 包)
pnpm dev

# 或者启动完整的开发环境 (后端 + 前端)
./scripts/dev.sh
```

## 📜 可用脚本

### Monorepo 脚本

- `pnpm dev` - 启动演示应用
- `pnpm build` - 构建所有包
- `pnpm build:lib` - 仅构建组件库
- `pnpm build:web` - 仅构建演示应用
- `pnpm lint` - 检查所有包的代码规范
- `pnpm type-check` - 检查所有包的类型
- `pnpm clean` - 清理所有构建输出

### 后端脚本

- `python main.py` - 启动后端服务器
- `uvicorn main:app --reload` - 启用热重载启动

## 📚 文档

- [组件库文档](./packages/easy-pdf/README.md)
- [后端 API 文档](./backend/README.md)

## 🤝 贡献

1. Fork 此仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

此项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
