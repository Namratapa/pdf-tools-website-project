"""
main.py
FastAPI application entry point.

Run from inside backend/:
    uvicorn main:app --reload --port 8000
"""
import asyncio
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import APP_ENV, CORS_ORIGINS, OUTPUT_RETENTION_MINUTES
from routes.blogs import router as blog_router
from routes.contact import router as contact_router
from routes.pdf import router as pdf_router
from routes.tools import router as tool_router
from routes.users import router as user_router
from utils.file_utils import purge_expired_outputs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pdf-tools-hub")

app = FastAPI(
    title="PDF Tools Hub API",
    description="Backend for PDF Tools Hub — real PDF processing, tool catalog, contact and blog endpoints.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Global exception handling — never leak internal paths/tracebacks to the client.
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "An unexpected error occurred. Please try again."})


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(pdf_router, prefix="/api/pdf", tags=["PDF Processing"])
app.include_router(tool_router, prefix="/api/tools", tags=["Tools & Categories"])
app.include_router(contact_router, prefix="/api/contact", tags=["Contact"])
app.include_router(blog_router, prefix="/api/blogs", tags=["Blogs"])
app.include_router(user_router, prefix="/api/users", tags=["Users"])


@app.get("/")
def root():
    return {"name": "PDF Tools Hub API", "status": "ok", "env": APP_ENV}


@app.get("/health")
def health():
    return {"status": "healthy"}


# ---------------------------------------------------------------------------
# Background cleanup — deletes generated output files older than the
# configured retention window so OUTPUT_DIR never grows unbounded.
# ---------------------------------------------------------------------------
async def _cleanup_loop():
    while True:
        try:
            removed = purge_expired_outputs()
            if removed:
                logger.info("Cleanup: removed %d expired output file(s).", removed)
        except Exception:
            logger.exception("Cleanup task failed.")
        await asyncio.sleep(max(OUTPUT_RETENTION_MINUTES, 1) * 60)


@app.on_event("startup")
async def start_cleanup_task():
    asyncio.create_task(_cleanup_loop())
