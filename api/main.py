# main.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import logging

from database import create_tables
from routes.cards import router as cards_router
from routes.passes import router as passes_router

logging.basicConfig(level=logging.DEBUG)

# create uploads directory
os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title="QuiKard API",
    description="digital business card creation api",
    version="1.0.0"
)

BADGE_API_URL = "https://api.trybadge.com/v0/rpc/userPassUpsert"
BADGE_API_KEY = os.getenv("BADGE_API_KEY")
BADGE_TEMPLATE_ID = os.getenv("BADGE_TEMPLATE_ID")
BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")

# cors middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # next.js dev server
        "http://localhost:3001",
        "https://yourapp.com",    # your production frontend url
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers (before mounting static files)
app.include_router(cards_router)
app.include_router(passes_router)

# serve static files (profile pictures, qr codes)
app.mount("/static", StaticFiles(directory="uploads"), name="static")



@app.on_event("startup")
async def startup_event():
    """create database tables on startup"""
    create_tables()

@app.get("/")
async def root():
    return {
        "message": "quikard api is running",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # only for development
        log_level="debug"
    )