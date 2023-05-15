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

from model import Login
import models, schema, crud_admin
import ldap
from inmemorydb import Redi
from database import SessionLocal, engine, get_db
from util import *
from session import *

app = FastAPI()
app.mount("/assets", StaticFiles(directory="templates/assets"), name="assets")

redi = Redi(host="localhost", port=6379, db=0)

@app.get("/", include_in_schema=False)
@app.get("/index", include_in_schema=False)
async def root(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("index.html", {"request": request}) if IsUUIDValid(request, redi) else RedirectResponse(url="/login")

@app.get("/login", include_in_schema=False)
async def root(request: Request):
    if IsUUIDValid(request, redi):
        return RedirectResponse(url="/")
    return RedirectResponse(url="/") if IsUUIDValid(request, redi) else Jinja2Templates(directory="templates").TemplateResponse("login.html", {"request": request})

@app.get("/memvers", include_in_schema=False)
async def memvers(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("memvers.html", {"request": request}) if IsUUIDValid(request, redi) else RedirectResponse(url="/login")

@app.get("/ldap", include_in_schema=False)
async def _ldap(request: Request, __uuid: Optional[str] = None):
    return Jinja2Templates(directory="templates").TemplateResponse("ldap.html", {"request": request}) if IsUUIDValid(request, redi) else RedirectResponse(url="/login")

@app.get("/register", include_in_schema=False)
async def register(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("register.html", {"request": request}) if IsUUIDValid(request, redi) else RedirectResponse(url="/login")

@app.get("/search")
async def memvers(request: Request, db: Session = Depends(get_db)):
    """
    # TODO: Implement authentication
    """
    # if not redi.exist(key=request.client.host):
    if not IsUUIDValid(request, redi):
        # return RedirectResponse(url="/login", status_code=302)
        return {"status": "401", "msg": "Invalid uuid. Session timeout."}
    params = request.query_params
    content = params.get("content")
    column = params.get("column")
    mode = params.get("mode")
    rtn = crud_admin.search(db=db, table='nugu', key=column, data=content, mode=mode)
    if type(rtn) == list:
        print("list")
        # rtn = dumps(rtn)
        # print(rtn)
        return {"status": "200", "data": rtn}
    else:
        print("dict")
        return {"status": "400", "msg": "Bad Request"}

# @app.post("/search")
# async def memvers(request: Request, db: Session = Depends(get_db)):
#     """
#     # TODO: Implement authentication
#     """
#     # if not redi.exist(key=request.client.host):
#     if not IsUUIDValid(request, redi):
#         return JSONResponse(content={"status": "401", "msg": "Invalid uuid. Session timeout."}, status_code=401, status=401)
#     formData = await request.form()
#     content = formData.get("content")
#     column = formData.get("column")
#     mode = formData.get("mode")
    
#     rtn = crud_admin.search(db=db, table='nugu', key=column, data=content, mode=mode)
#     print(rtn)
#     if type(rtn) == list:
#         return JSONResponse(content={"status": "200", "data": rtn}, status_code=200)
#     else:
#         return JSONResponse(content={"status": "200", "data": ""}, status_code=200)
        
"""
# Register both LDAP and Nugu DB
"""
@app.post("/register")
async def register(request: Request, db: Session = Depends(get_db)):
    formData = await request.form()
    if formData.get("nickname") == None or formData.get("nickname") == "":
        return {"status": "failed", "data": "nickname is None"}
    if formData.get("pw") == None or formData.get("pw") == "":  # TODO: Implement password policy
        return {"status": "failed", "data": "pw is None"}       # Password double check will not be implemented
    
    _keys = models.get_keys_from_table(table='nugu')
    _types = models.get_types_from_table(table='nugu')

    _data = {}

    for _key in _keys:
        print(_types[_key])
        
        if formData.get(_key) == None or formData.get(_key) == "":
            _data[_key] = models.yield_default_value_type_by_key(table='nugu', key=_key)
        else:
            _data[_key] = formData.get(_key)

    if ldap.add(un=formData.get("nickname"), pw=formData.get("pw")) and crud_admin.insert(db=db, table='nugu', data=_data):
        return HTMLResponse(content="<script>alert('Successfully added.');location.href='/register';</script>", status_code=200)
    return {"status": "failed", "data": "faild to add user"}
 
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

@app.exception_handler(404)
async def not_found(request: Request, exc: Exception):
    return Jinja2Templates(directory="templates").TemplateResponse("404.html", {"request": request})

@app.exception_handler(500)
async def internal_server_error_handler(request: Request, exc: Exception):
    return Jinja2Templates(directory="templates").TemplateResponse("500.html", {"request": request})

if __name__ == "__main__":
    run(app, host="0.0.0.0", port=8001)