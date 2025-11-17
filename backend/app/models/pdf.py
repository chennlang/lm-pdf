from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class TaskStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class PDFPage(BaseModel):
    page_number: int
    width: float
    height: float
    image_path: Optional[str] = None

class PDFInfo(BaseModel):
    id: str
    filename: str
    file_path: str
    total_pages: int
    pages: List[PDFPage]
    status: TaskStatus
    created_at: datetime
    updated_at: datetime
    file_size: int

class PDFUploadResponse(BaseModel):
    success: bool
    message: str
    pdf_id: Optional[str] = None

class PageImageResponse(BaseModel):
    success: bool
    image_url: str
    page_number: int
    width: int
    height: int