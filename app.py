from fastapi import FastAPI, Depends, HTTPException, status, Request, Response, Form, Cookie, Header
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

app = FastAPI()
app.mount("/assets", StaticFiles(directory="templates/assets"), name="assets")

redi = Redi(host="localhost", port=6379, db=0)

@app.get("/", include_in_schema=False)
@app.get("/index", include_in_schema=False)
async def root(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("index.html", {"request": request})

@app.get("/login", include_in_schema=False)
async def login(request: Request):
    return RedirectResponse(url="/") if IsUUIDValid(request, redi) else Jinja2Templates(directory="templates").TemplateResponse("login.html", {"request": request})

@app.get("/logout", include_in_schema=False)
async def logout(request: Request):
    redi.delete(request.client.host)
    return RedirectResponse(url="/login", status_code=302)

@app.get("/memvers", include_in_schema=False)
async def memvers(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("memvers.html", {"request": request})

@app.get("/ldap", include_in_schema=False)
async def _ldap(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("ldap.html", {"request": request})

@app.get("/register", include_in_schema=False)
async def register(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("register.html", {"request": request})

@app.get("/edit")
async def edit(request: Request, nickname: str = None, db: Session = Depends(get_db)):
    return Jinja2Templates(directory="templates").TemplateResponse("edit.html", {"request": request}) if nickname != None else RedirectResponse(url="/memvers", status_code=302)

@app.post("/login")
async def login(request: Request):
    __formData = await request.form()
    if ldap.bind(__formData.get("id"), __formData.get("pw")):
        __uuid = uuid.uuid4().hex
        redi.set(request.client.host, __uuid, ex=60*60)
        _response = JSONResponse(content={"result": "success"})
        _response.set_cookie(key="uuid", value=__uuid)
        return _response
    else:
        return JSONResponse(content={"result": "failed"})

@app.get("/search")
async def memvers(request: Request, db: Session = Depends(get_db)):
    """
    # TODO: Implement authentication
    """
    params = request.query_params

    rtn = crud_admin.search(db=db, table=params.get("table"), key=params.get("column"), data=params.get("content"), mode=params.get("mode"))
    print(rtn)
    
    if type(rtn) == list:
        return JSONResponse(content={"status": "200", "msg": "success", "data": rtn})
    else:
        return JSONResponse(content={"status": "400", "msg": "Bad Request"})
        
"""
# Register both LDAP and Nugu DB
"""
@app.post("/register")
async def register(request: Request, db: Session = Depends(get_db)):
    formData = await request.form()
    if ldap.bind(formData.get("id"), formData.get("pw")):
        return JSONResponse(content={"status": "400", "msg": "Already exist"})
    
    data = dict(formData) # through register, pw comes with.
    del data['pw'] # delete pw from data as it is not in nugu table.
    
    for key in models.get_keys_from_table(table='nugu'):
        if key not in data.keys():
            data[key] = models.yield_default_value_type_by_key(table='nugu', key=key)
        data[key] = models.type_casting_by_table(table='nugu', key=key, data=data[key])
    if crud_admin.insert(db=db, table='nugu', data=data):
        return JSONResponse(content={"status": "200", "msg": "success"})
    else:
        return JSONResponse(content={"status": "400", "msg": "Bad Request"})

@app.post("/edit")
async def edit(request: Request, db: Session = Depends(get_db)):
    formData = await request.form()
    return JSONResponse(content={"status": "200", "msg": "success"})

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