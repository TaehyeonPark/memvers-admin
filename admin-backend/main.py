from fastapi import FastAPI, HTTPException, status, Request, Response, APIRouter
from fastapi import Depends, Form, Cookie, Header 
from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import RedirectResponse, HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

from fastapi.requests import Request
from fastapi.staticfiles import StaticFiles
from fastapi_sessions.backends.implementations import InMemoryBackend

from sqlalchemy.orm import Session

from uvicorn import run

import uuid
from json import loads, dumps
from typing import Optional, List, Dict, Any

import models, schema, crud_admin
import ldap
from inmemorydb import Redi
from database import SessionLocal, engine, get_db
from util import *
from session import *
from error_template import error_template
import router

redi = router.redi

app = FastAPI()
app.mount("/assets", StaticFiles(directory="templates/assets"), name="assets")
origins = [
    "http://127.0.0.1:8001",
]

app.include_router(router.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def session_managing_middleware(request: Request, call_next):
    response = await call_next(request)
    if "/assets" in request.url.path:
        return response
    if request.url.path == "/login":
        return response
    if not IsUUIDValid(request, redi) and request.url.path != "/login":
        return RedirectResponse(url="/login", status_code=302)
    return response

@app.exception_handler(404)
async def not_found(request: Request, exc: Exception):
    return Jinja2Templates(directory="templates").TemplateResponse("404.html", {"request": request})

@app.exception_handler(500)
async def internal_server_error_handler(request: Request, exc: Exception):
    return Jinja2Templates(directory="templates").TemplateResponse("500.html", {"request": request})

@app.exception_handler(401)
async def unauthorized_handler(request: Request, exc: Exception):
    return RedirectResponse(url="/login", status_code=302)

@app.exception_handler(422)
async def unprocessable_entity_handler(request: Request, exc: Exception):
    return HTMLResponse(content=error_template(error_code=422, title="Unprocessable Entity", desc="The request was well-formed but was unable to be followed due to semantic errors.", redirect_url="/", redirect_desc="Go to index page"), status_code=422)



if __name__ == "__main__":
    run(app, host="0.0.0.0", port=8001)