from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import FileResponse
from typing import List, Optional
import os

from ..services.pdf_service import pdf_service
from ..models.pdf import PDFUploadResponse, PDFInfo, PageImageResponse

router = APIRouter()

@router.post("/upload", response_model=PDFUploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """Upload a PDF file"""
    try:
        pdf_info = await pdf_service.upload_pdf(file)
        return PDFUploadResponse(
            success=True,
            message="PDF uploaded successfully",
            pdf_id=pdf_info.id
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/list", response_model=List[PDFInfo])
async def list_pdfs(
    include_pages: bool = Query(False, description="Include page details (may be slow for large PDFs)"),
    limit: Optional[int] = Query(None, description="Maximum number of PDFs to return"),
    offset: int = Query(0, description="Number of PDFs to skip")
):
    """List all PDFs with optional pagination and page exclusion"""
    return pdf_service.list_pdfs(include_pages=include_pages, limit=limit, offset=offset)

@router.get("/{pdf_id}", response_model=PDFInfo)
async def get_pdf_info(pdf_id: str):
    """Get PDF information"""
    pdf_info = pdf_service.get_pdf_info(pdf_id)
    if not pdf_info:
        raise HTTPException(status_code=404, detail="PDF not found")
    return pdf_info

@router.get("/{pdf_id}/pages")
async def get_pdf_pages(pdf_id: str):
    """Get all pages of a PDF"""
    pdf_info = pdf_service.get_pdf_info(pdf_id)
    if not pdf_info:
        raise HTTPException(status_code=404, detail="PDF not found")

    return {
        "pdf_id": pdf_id,
        "total_pages": pdf_info.total_pages,
        "status": pdf_info.status,
        "pages": [
            {
                "page_number": page.page_number,
                "width": page.width,
                "height": page.height
            }
            for page in pdf_info.pages
        ]
    }

@router.get("/{pdf_id}/page/{page_number}/image", response_model=PageImageResponse)
async def get_page_image(pdf_id: str, page_number: int):
    """Get page image"""
    pdf_info = pdf_service.get_pdf_info(pdf_id)
    if not pdf_info:
        raise HTTPException(status_code=404, detail="PDF not found")

    if pdf_info.status != "completed":
        raise HTTPException(status_code=400, detail=f"PDF not processed yet. Current status: {pdf_info.status}")

    image_path = pdf_service.get_page_image_path(pdf_id, page_number)
    if not image_path or not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Page image not found")

    # Get image dimensions
    from PIL import Image
    with Image.open(image_path) as img:
        width, height = img.size

    return PageImageResponse(
        success=True,
        image_url=f"/api/pdf/{pdf_id}/page/{page_number}/image/file",
        page_number=page_number,
        width=width,
        height=height
    )

@router.get("/{pdf_id}/page/{page_number}/image/file")
async def get_page_image_file(pdf_id: str, page_number: int):
    """Get page image file"""
    image_path = pdf_service.get_page_image_path(pdf_id, page_number)
    if not image_path or not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Page image not found")

    return FileResponse(
        image_path,
        media_type=f"image/{image_path.split('.')[-1].lower()}",
        headers={"Cache-Control": "public, max-age=3600"}  # Cache for 1 hour
    )

@router.delete("/{pdf_id}")
async def delete_pdf(pdf_id: str):
    """Delete a PDF"""
    success = pdf_service.delete_pdf(pdf_id)
    if not success:
        raise HTTPException(status_code=404, detail="PDF not found")

    return {"success": True, "message": "PDF deleted successfully"}