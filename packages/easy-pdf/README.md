# @lm-pdf/easy-pdf

A powerful PDF viewer component library for React.

## Features

- 🚀 High performance PDF rendering with Canvas
- 🎨 Customizable viewer with header controls
- 📱 Responsive design
- 🎯 TypeScript support
- 🔧 Easy to use and integrate
- 📦 Lightweight bundle size

## Installation

```bash
npm install @lm-pdf/easy-pdf
# or
yarn add @lm-pdf/easy-pdf
# or
pnpm add @lm-pdf/easy-pdf
```

## Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-dom
# or
yarn add react react-dom
# or
pnpm add react react-dom
```

## Usage

```tsx
import React from 'react'
import { EasyPdfProvider, EasyPdfHeader, EasyPdfViewer } from '@lm-pdf/easy-pdf'

const PdfViewerComponent = () => {
  const pages = [
    { id: 1, page: 1, width: 595, height: 842 },
    { id: 2, page: 2, width: 595, height: 842 }
  ]

  const loadPageImage = async (page) => {
    // Implement your image loading logic
    return `https://your-api.com/pdf/page/${page.page}/image`
  }

  return (
    <EasyPdfProvider
      pages={pages}
      gap={20}
      defaultPage={1}
      loadPageImage={loadPageImage}
    >
      <EasyPdfHeader />
      <EasyPdfViewer />
    </EasyPdfProvider>
  )
}
```

## API Reference

### EasyPdfProvider

The main provider component that wraps your PDF viewer.

| Prop | Type | Description |
|------|------|-------------|
| `pages` | `Page[]` | Array of page information |
| `loadPageImage` | `(page: Page) => Promise<string>` | Function to load page image |
| `gap` | `number` | Gap between pages (default: 20) |
| `defaultPage` | `number` | Default page to show (default: 1) |
| `emitterRef` | `RefObject<Emitter> \| ((emitter: Emitter) => void)` | Event emitter reference |
| `onRectClick` | `(block: PdfRect, page: Page) => void` | Callback when rect is clicked |
| `onPageChange` | `(page?: Page) => void` | Callback when page changes |

### Page Interface

```typescript
interface Page {
  id: string | number
  page: number
  width: number
  height: number
}
```

### PdfRect Interface

```typescript
interface PdfRect {
  id: string | number
  x: number
  y: number
  width: number
  height: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  [k: string]: any
}
```

## Components

### EasyPdfHeader

Provides navigation and scale controls for the PDF viewer.

### EasyPdfViewer

The main PDF canvas component that renders pages.

## Events

The component uses `mitt` for event handling. You can listen to events:

```tsx
const emitterRef = useRef()

useEffect(() => {
  if (emitterRef.current) {
    emitterRef.current.on('viewerScrollToPage', (data) => {
      console.log('Scroll to page:', data.page)
    })
  }
}, [])
```

Available events:
- `viewerScrollToPage`: Scroll to specific page
- `setActiveViewerRect`: Set active viewer rectangle
- `mdBlocksJumpToIndex`: Jump to specific index

## Development

```bash
# Install dependencies
pnpm install

# Development mode with watch
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## License

MIT