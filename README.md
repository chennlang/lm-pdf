<div align="center" style="text-align: center;">
    <h1 style="text-align: center;">⚡ LM PDF</h1>
    <p style="text-align: center;">An ultra-fast PDF preview solution designed for AI / RAG scenarios</p>
    <p style="text-align: center;">Open 1000+ page PDFs instantly!</p>
    <p align='center'>
      <b>English</b>
      |
      <a href="/README_zh.md">简体中文</a>
    </p>
</div>

## 🚀 Introduction

In **AI / RAG applications**, PDFs are one of the most common data sources, such as:

* 📚 Academic papers  
* 📑 Technical documentation  
* 📊 Research reports  
* 📖 E-books  

However, traditional PDF renderers perform **very poorly with large files**:

| Page Count | react-pdf Load Time |
|------------|---------------------|
| 50 pages   | 7s                  |
| 344 pages  | 109s                |
| 1000 pages | 240s                |

In AI applications, users often need to **quickly open the original document to check the citation source**.

Waiting **tens of seconds or even minutes** creates a terrible user experience.

**LM PDF has only one goal:**

> Make PDF loading speed **independent of page count**

Whether it is:

* 50 pages  
* 500 pages  
* 1000 pages  

It can still achieve **near-instant loading**.

---

## 🎬 Demo

https://github.com/user-attachments/assets/cd555032-2af5-4ac7-b65b-f3b57f767757

Example of opening a **290-page PDF**

---

## ✨ Key Features

* ⚡ **Instant PDF loading**
* 🧠 **Loading time nearly independent of page count**
* 📉 **Extremely low memory usage**
* 🎯 **Very few DOM nodes**
* 🤖 **Perfect for AI / RAG scenarios**

---

## 🧠 Core Idea

Traditional PDF rendering workflow:

```

PDF
↓
pdf.js parsing
↓
Parse fonts / layout / text
↓
Canvas rendering

```

The problems:

* Parsing PDF grammar is extremely complex
* Font parsing is expensive
* The larger the document, the slower it becomes

---

### LM PDF Approach

**Treat the PDF as an image sequence**

```

PDF
↓
Server-side page splitting
↓
page1.png
page2.png
page3.png

```

The frontend only needs to:

> Load images on demand

No PDF parsing is required.

---

## ⚙️ System Architecture

```

```
        PDF File
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

```

---

## 🧩 Core Technologies

LM PDF's performance comes from **three key design decisions**.

---

### 1️⃣ Canvas Rendering

Traditional PDF viewers use:

```

DOM + Canvas + Text Layer

```

The number of DOM nodes grows with the number of pages.

LM PDF uses:

```

Canvas
└ Image

```

Only images are rendered.

The number of DOM nodes remains **almost constant**.

---

### 2️⃣ Virtual Scrolling

Even if the PDF has **1000 pages**:

Users can only see at most:

```

3 ~ 5 pages

```

So only the visible pages are rendered.

Example:

```

Total pages: 1000
Actually rendered: 5

```

This is **virtual scrolling**.

---

### 3️⃣ Canvas Diff Updates

During scrolling:

Instead of re-rendering the entire page:

```

Old elements
↓
diff
↓
position updates

```

This ensures **smooth and fluid scrolling**.

---

## 📊 Performance Comparison

Test environment:

* Network speed: **13.9 Mbps**

| PDF Pages | react-pdf | LM PDF |
|-----------|-----------|--------|
| 3 pages   | 3.5s      | 1s     |
| 50 pages  | 7s        | 1.5s   |
| 344 pages | 109s      | 2.5s   |
| 1000 pages| 240s      | 2.5s   |

**Conclusion:**

> LM PDF's loading speed is almost unaffected by the number of pages.

---

## 🎯 Use Cases

LM PDF is especially suitable for:

### 🤖 AI / RAG

Used to display:

* Original citations
* Document context
* Knowledge sources

---

### 📚 Academic Reading

Quickly browse:

* Research papers
* Books
* Technical documentation

---

### 📊 Large Reports

For example:

* Annual reports
* Research reports
* Data reports

---

## 📦 Project Structure

```

lm-pdf
├── backend
│   ├── FastAPI
│   ├── PyMuPDF
│   └── pdf2image
│
├── packages
│   ├── easy-pdf
│   │   React component library
│   │
│   └── web
│       Demo application
│
├── pnpm-workspace.yaml
└── package.json

````

---

## ⚡ Quick Start

### 1️⃣ Start the Backend

```bash
cd backend

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

python main.py
````

---

### 2️⃣ Start the Frontend

```bash
pnpm install
pnpm dev
```

Visit:

```
http://localhost:5173
```

---

## 🛠 Tech Stack

### Backend

* FastAPI
* PyMuPDF
* pdf2image

### Frontend

* React 18
* TypeScript
* Vite
* react-konva
* Recoil

---

## 👍 Advantages

* ⚡ Extremely fast initial loading
* 📉 Very low memory usage
* 🎯 Smooth scrolling experience
* 📦 Very few DOM nodes
* 🤖 Ideal for AI applications

---

## ⚠️ Current Limitations

* **Copying PDF text is not supported yet**
* PDFs must be **pre-split on the backend**

---

## 🛣 Roadmap

Planned features:

* [ ] PDF text layer
* [ ] Search
* [ ] Annotations
* [ ] Highlighting
* [ ] WebAssembly rendering

---

## 🤝 Contributing

Issues and Pull Requests are welcome.

If this project helps you, please consider giving it a ⭐.

---

## 📄 License

MIT License
