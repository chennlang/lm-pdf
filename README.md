# LM PDF

<div align="center" style="text-align: center;">
    <h1 style="text-align: center;">LM PDF</h1>
    <p style="text-align: center;">A lightning-fast PDF preview solution for the LLM era</p>
    <p style="text-align: center;">Load 1000+ page PDFs in seconds!</p>
    <p align='center'>
      <b>English</b>
      |
      <a href="/README_zh.md">简体中文</a>
    </p>
</div>

## 🎯 Problems Solved

Compared to the common PDF.js, LM-PDF specifically addresses the problems of slow loading speed and poor rendering performance for large files. No matter how many pages the PDF file has or how large the original file is, it can load and preview in seconds!

**Particularly suitable for scenarios where LLM responses require citation source verification**, such as:

- 📚 Academic paper reading and citation verification
- 🔍 Quick location and preview of long documents
- 🤖 Source material verification for AI assistant responses
- 📊 Instant access and navigation of large reports

https://github.com/user-attachments/assets/cd555032-2af5-4ac7-b65b-f3b57f767757

## 📦 Repository Structure

```
lm-pdf/
├── backend/              # FastAPI backend service
├── packages/
│   ├── easy-pdf/         # React component library
│   └── web/             # Demo application (Vite + React 18)
├── package.json         # Monorepo configuration
└── pnpm-workspace.yaml  # PNPM workspace configuration
```

## 🚀 Features

- **Backend Service**: FastAPI service for PDF to image conversion
- **Component Library**: Reusable React PDF viewer components
- **Demo Application**: Complete demo showcasing all features

## 🛠️ Tech Stack

### Backend

- FastAPI
- pdf2image
- PyMuPDF
- Python 3.8+

### Frontend

- React 18
- TypeScript
- Vite
- Ant Design
- Recoil (state management)
- PNPM (package manager)

## 📋 Prerequisites

- Node.js 18+
- Python 3.8+
- PNPM 8+
- Poppler (for PDF processing)

## 🚀 Quick Start

### 1. Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python main.py
```

### 3. Setup Frontend

```bash
# Install dependencies
pnpm install

# Start demo application (this will resolve the easy-pdf package from source)
pnpm dev

# Or start the full development environment (backend + frontend)
./scripts/dev.sh
```

## 📜 Available Scripts

### Monorepo Scripts

- `pnpm dev` - Start demo application
- `pnpm build` - Build all packages
- `pnpm build:lib` - Build component library only
- `pnpm build:web` - Build demo application only
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean all build outputs

### Backend Scripts

- `python main.py` - Start backend server
- `uvicorn main:app --reload` - Start with hot reload

## 📚 Documentation

- [Component Library Documentation](./packages/easy-pdf/README.md)
- [Backend API Documentation](./backend/README.md)

## 🤝 Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
