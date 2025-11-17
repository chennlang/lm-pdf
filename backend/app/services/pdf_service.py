import os
import uuid
import asyncio
from typing import List, Optional, Dict
from datetime import datetime
from pathlib import Path
import pymupdf  # PyMuPDF
from PIL import Image
import io
import aiofiles
from fastapi import UploadFile, HTTPException

from ..models.pdf import PDFInfo, PDFPage, TaskStatus
from ..core.config import settings

class PDFService:
    def __init__(self):
        self.upload_dir = Path(settings.upload_dir)
        self.cache_dir = Path(settings.cache_dir)
        self.pdf_storage: Dict[str, PDFInfo] = {}

        # Create directories if they don't exist
        self.upload_dir.mkdir(exist_ok=True)
        self.cache_dir.mkdir(exist_ok=True)

    async def upload_pdf(self, file: UploadFile) -> PDFInfo:
        """Upload and process PDF file"""
        # Validate file
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        if file.size > settings.max_file_size:
            raise HTTPException(status_code=400, detail="File too large")

        # Generate unique ID
        pdf_id = str(uuid.uuid4())

        # Save file
        file_path = self.upload_dir / f"{pdf_id}.pdf"
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)

        # Create PDF info
        pdf_info = PDFInfo(
            id=pdf_id,
            filename=file.filename,
            file_path=str(file_path),
            total_pages=0,
            pages=[],
            status=TaskStatus.PENDING,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            file_size=len(content)
        )

        # Store in memory
        self.pdf_storage[pdf_id] = pdf_info

        # Start processing in background
        asyncio.create_task(self._process_pdf(pdf_id))

        return pdf_info

    async def _process_pdf(self, pdf_id: str):
        """Process PDF and extract pages using PyMuPDF"""
        if pdf_id not in self.pdf_storage:
            return

        pdf_info = self.pdf_storage[pdf_id]
        pdf_info.status = TaskStatus.PROCESSING
        pdf_info.updated_at = datetime.now()

        try:
            # Open PDF using PyMuPDF
            doc = pymupdf.open(pdf_info.file_path)
            pages = []

            # Calculate zoom factor based on DPI (72 DPI = 1.0 zoom)
            zoom = settings.dpi / 72.0
            matrix = pymupdf.Matrix(zoom, zoom)

            for page_num in range(len(doc)):
                page = doc.load_page(page_num)  # Load page

                # Render page to pixmap
                pix = page.get_pixmap(matrix=matrix)

                # Convert pixmap to PIL Image
                img_data = pix.tobytes(settings.image_format.lower())
                image = Image.open(io.BytesIO(img_data))

                # Save image
                image_path = self.cache_dir / f"{pdf_id}_page_{page_num + 1}.{settings.image_format.lower()}"
                image.save(image_path)

                # Create page info
                page_info = PDFPage(
                    page_number=page_num + 1,
                    width=image.width,
                    height=image.height,
                    image_path=str(image_path)
                )
                pages.append(page_info)

            # Close the document
            doc.close()

            # Update PDF info
            pdf_info.pages = pages
            pdf_info.total_pages = len(pages)
            pdf_info.status = TaskStatus.COMPLETED
            pdf_info.updated_at = datetime.now()

        except Exception as e:
            pdf_info.status = TaskStatus.FAILED
            pdf_info.updated_at = datetime.now()
            print(f"Error processing PDF {pdf_id}: {str(e)}")

    def get_pdf_info(self, pdf_id: str) -> Optional[PDFInfo]:
        """Get PDF information"""
        return self.pdf_storage.get(pdf_id)

    def get_page_image_path(self, pdf_id: str, page_number: int) -> Optional[str]:
        """Get page image path"""
        pdf_info = self.get_pdf_info(pdf_id)
        if not pdf_info or pdf_info.status != TaskStatus.COMPLETED:
            return None

        for page in pdf_info.pages:
            if page.page_number == page_number:
                return page.image_path

        return None

    def delete_pdf(self, pdf_id: str) -> bool:
        """Delete PDF and its images"""
        if pdf_id not in self.pdf_storage:
            return False

        pdf_info = self.pdf_storage[pdf_id]

        # Delete PDF file
        try:
            os.remove(pdf_info.file_path)
        except:
            pass

        # Delete image files
        for page in pdf_info.pages:
            if page.image_path:
                try:
                    os.remove(page.image_path)
                except:
                    pass

        # Remove from storage
        del self.pdf_storage[pdf_id]
        return True

    def list_pdfs(self, include_pages: bool = False, limit: Optional[int] = None, offset: int = 0) -> List[PDFInfo]:
        """List all PDFs with optional pagination and page exclusion"""
        pdfs = list(self.pdf_storage.values())

        # Apply pagination if requested
        if limit is not None:
            pdfs = pdfs[offset:offset + limit]

        # If pages are not requested, return PDFs without page data for better performance
        if not include_pages:
            result = []
            for pdf in pdfs:
                # Create a copy without pages data
                pdf_summary = PDFInfo(
                    id=pdf.id,
                    filename=pdf.filename,
                    file_path=pdf.file_path,
                    total_pages=pdf.total_pages,
                    pages=[],  # Empty pages list for better performance
                    status=pdf.status,
                    created_at=pdf.created_at,
                    updated_at=pdf.updated_at,
                    file_size=pdf.file_size
                )
                result.append(pdf_summary)
            return result

        return pdfs

# Global instance
pdf_service = PDFService()