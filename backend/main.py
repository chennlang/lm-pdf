from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import pdf_router
import uvicorn

app = FastAPI(
    title="LM PDF Service",
    description="PDF to Image conversion service",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(pdf_router, prefix="/api/pdf", tags=["pdf"])

@app.get("/")
async def root():
    return {"message": "LM PDF Service is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8006)