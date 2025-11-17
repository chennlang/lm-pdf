# LM PDF Service

FastAPI backend service for PDF to image conversion.

## Features

- PDF upload and processing
- Convert PDF pages to high-resolution images
- RESTful API endpoints
- Asynchronous processing
- File management and cleanup

## Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Install system dependencies for PDF processing:

**macOS:**
```bash
brew install poppler
```

**Ubuntu/Debian:**
```bash
sudo apt-get install poppler-utils
```

**Windows:**
Download and install Poppler from [http://blog.alivate.com.au/poppler-windows/](http://blog.alivate.com.au/poppler-windows/)

## Usage

1. Copy `.env.example` to `.env` and configure settings:
```bash
cp .env.example .env
```

2. Run the server:
```bash
python main.py
```

Or use uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### PDF Operations

- `POST /api/pdf/upload` - Upload a PDF file
- `GET /api/pdf/list` - List all PDFs
- `GET /api/pdf/{pdf_id}` - Get PDF information
- `GET /api/pdf/{pdf_id}/pages` - Get PDF pages info
- `GET /api/pdf/{pdf_id}/page/{page_number}/image` - Get page image info
- `GET /api/pdf/{pdf_id}/page/{page_number}/image/file` - Get page image file
- `DELETE /api/pdf/{pdf_id}` - Delete a PDF

### Health Check

- `GET /` - Root endpoint
- `GET /health` - Health check

## Configuration

Environment variables can be set in `.env` file:

- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 50MB)
- `UPLOAD_DIR`: Directory for uploaded PDFs (default: uploads)
- `CACHE_DIR`: Directory for cached images (default: cache)
- `DPI`: DPI for PDF to image conversion (default: 200)
- `IMAGE_FORMAT`: Image format - PNG or JPEG (default: PNG)

## Development

The service includes automatic CORS configuration for development. In production, update the CORS origins to specific domains.