from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates

from fastapi.requests import Request

from fastapi.staticfiles import StaticFiles

# from uuid import UUID
# from fastapi_sessions.backends.implementations import InMemoryBackend

from uvicorn import run

from typing import Optional, List, Dict, Any

from model import Login

from database import Redi

import ldap

from util import *


app = FastAPI()
app.mount("/assets", StaticFiles(directory="templates/assets"), name="assets")

redi = Redi(host="localhost", port=6379, db=0)


@app.get("/", include_in_schema=False)
@app.get("/index", include_in_schema=False)
async def root(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("index.html", {"request": request}) if redi.exist(key=request.client.host) else RedirectResponse(url="/login")

@app.get("/login", include_in_schema=False)
async def root(request: Request):
    return RedirectResponse(url="/") if redi.exist(key=request.client.host) else Jinja2Templates(directory="templates").TemplateResponse("login.html", {"request": request})

@app.get("/memvers", include_in_schema=False)
async def memvers(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("memvers.html", {"request": request}) if redi.exist(key=request.client.host) else RedirectResponse(url="/login")

@app.get("/ldap", include_in_schema=False)
async def _ldap(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("ldap.html", {"request": request}) if redi.exist(key=request.client.host) else RedirectResponse(url="/login")

@app.get("/register", include_in_schema=False)
async def register(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("register.html", {"request": request}) if redi.exist(key=request.client.host) else RedirectResponse(url="/login")



@app.post("/memvers")
async def memvers(request: Request):
    formData = await request.form()
    return {"status": "OK!", "data": formData}

@app.post("/register")
async def register(request: Request):
    formData = await request.form()
    return {"status": "OK!", "data": formData}

@app.post("/ldap")
async def _ldap(request: Request):
    formData = await request.form()
    return {"status": "OK!", "data": formData}

@app.post("/login")
async def login(request: Request):
    formData = await request.form()
    id = formData.get("id")
    if ldap.bind(formData.get("id"), formData.get("pw")):
        redi.set(request.client.host, id, ex=5)
        return {"result": "success"}
    else:
        return {"result": "failed"}

@app.exception_handler(404)
async def not_found(request: Request, exc: Exception):
    return Jinja2Templates(directory="templates").TemplateResponse("404.html", {"request": request})

if __name__ == "__main__":
    run(app, host="0.0.0.0", port=8001)