<div align="center" style="text-align: center;">
    <h1 style="text-align: center;">⚡ LM PDF</h1>
    <p style="text-align: center;">一个为 AI / RAG 场景设计的极速 PDF 预览方案</p>
    <p style="text-align: center;">1000+ 页 PDF 秒开!</p>
    <p align='center'>
      <a href="/README.md">English</a>
      |
      <b>简体中文</b>
    </p>
</div>

## 🚀 项目简介

在 **AI / RAG 应用** 中，PDF 是最常见的数据来源，例如：

* 📚 学术论文
* 📑 技术文档
* 📊 研究报告
* 📖 电子书

但传统 PDF 渲染器在 **大文件场景下性能极差**：

| 文件页数   | react-pdf 打开时间 |
| ------ | -------------- |
| 50 页   | 7s             |
| 344 页  | 109s           |
| 1000 页 | 240s           |

在 AI 应用中，用户经常需要 **快速打开原文查看引用来源**。

如果需要等待几十秒甚至几分钟，体验会非常糟糕。

**LM PDF 的目标只有一个：**

> 让 PDF 打开速度 **与页数无关**

无论：

* 50 页
* 500 页
* 1000 页

都可以做到 **秒级加载**。

---

## 🎬 Demo

https://github.com/user-attachments/assets/cd555032-2af5-4ac7-b65b-f3b57f767757

290 页 PDF 打开示例

---

## ✨ 核心特点

* ⚡ **秒级加载 PDF**
* 🧠 **与页数几乎无关的加载时间**
* 📉 **极低内存占用**
* 🎯 **极少 DOM 节点**
* 🤖 **非常适合 AI / RAG 场景**

---

## 🧠 核心思路

传统 PDF 渲染流程：

```
PDF
 ↓
pdf.js 解析
 ↓
解析字体 / layout / text
 ↓
Canvas 渲染
```

问题在于：

* 解析 PDF grammar 非常复杂
* 字体解析成本高
* 文档越大越慢

---

### LM PDF 的思路

**把 PDF 当作图片序列处理**

```
PDF
 ↓
服务器切页
 ↓
page1.png
page2.png
page3.png
```

前端只需要：

> 按需加载图片

无需解析 PDF。

---

## ⚙️ 系统架构

```
            PDF 文件
               │
               │
        ┌──────▼──────┐
        │   Backend   │
        │              │
        │ PDF → Image  │
        │ PyMuPDF      │
        │ pdf2image    │
        └──────┬──────┘
               │
               │ HTTP
               │
        ┌──────▼──────┐
        │   Frontend  │
        │              │
        │ React       │
        │ react-konva │
        │ Canvas      │
        │ VirtualScroll│
        └─────────────┘
```

---

## 🧩 核心技术

LM PDF 的性能来自 **三个关键设计**。

---

### 1️⃣ Canvas 渲染

传统 PDF Viewer：

```
DOM + Canvas + Text Layer
```

DOM 节点数量随页数增长。

LM PDF：

```
Canvas
  └ Image
```

只渲染图片。

DOM 数量 **基本恒定**。

---

### 2️⃣ 虚拟滚动（Virtual Scroll）

即使 PDF 有 **1000 页**：

用户屏幕最多看到：

```
3 ~ 5 页
```

因此只渲染可见页面。

例如：

```
总页数：1000
实际渲染：5
```

这就是 **虚拟滚动**。

---

### 3️⃣ Canvas Diff 更新

滚动过程中：

不是重新渲染页面，而是：

```
旧元素
 ↓
diff
 ↓
位置更新
```

保证滚动 **丝滑流畅**。

---

## 📊 性能对比

测试环境：

* 网络：13.9 Mbps

| PDF 页数 | react-pdf | LM PDF |
| ------ | --------- | ------ |
| 3 页    | 3.5s      | 1s     |
| 50 页   | 7s        | 1.5s   |
| 344 页  | 109s      | 2.5s   |
| 1000 页 | 240s      | 2.5s   |

**结论：**

> LM PDF 的加载速度几乎不随页数增长。

---

## 🎯 适用场景

LM PDF 特别适用于：

### 🤖 AI / RAG

用于展示：

* 原文引用
* 文档上下文
* 知识来源

---

### 📚 学术阅读

快速浏览：

* 论文
* 书籍
* 技术文档

---

### 📊 大型报告

例如：

* 年报
* 研究报告
* 数据报告

---

## 📦 项目结构

```
lm-pdf
├── backend
│   ├── FastAPI
│   ├── PyMuPDF
│   └── pdf2image
│
├── packages
│   ├── easy-pdf
│   │   React 组件库
│   │
│   └── web
│       Demo 应用
│
├── pnpm-workspace.yaml
└── package.json
```

---

## ⚡ 快速开始

### 1️⃣ 启动后端

```bash
cd backend

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

python main.py
```

---

### 2️⃣ 启动前端

```bash
pnpm install
pnpm dev
```

访问：

```
http://localhost:5173
```

---

## 🛠 技术栈

### 后端

* FastAPI
* PyMuPDF
* pdf2image

### 前端

* React 18
* TypeScript
* Vite
* react-konva
* Recoil

---

## 👍 优点

* ⚡ 极快的首次加载速度
* 📉 极低的内存占用
* 🎯 丝滑滚动体验
* 📦 极少 DOM 节点
* 🤖 非常适合 AI 应用

---

## ⚠️ 当前限制

* 暂不支持 **复制 PDF 文本**
* PDF 需要 **后端预切页**

---

## 🛣 Roadmap

计划支持：

* [ ] PDF 文本层
* [ ] 搜索
* [ ] 标注
* [ ] 高亮
* [ ] WebAssembly 渲染

---

## 🤝 贡献

欢迎提交 Issue 或 PR。

如果这个项目对你有帮助，欢迎给一个 ⭐。

---

## 📄 License

MIT License
