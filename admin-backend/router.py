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


redi = Redi(host="localhost", port=6379, db=0)
router = APIRouter()
router.mount("/assets", StaticFiles(directory="templates/assets"), name="assets")

@router.get("/", include_in_schema=False)
@router.get("/index", include_in_schema=False)
async def root(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("index.html", {"request": request})

@router.get("/login", include_in_schema=False)
async def login(request: Request):
    return RedirectResponse(url="/") if IsUUIDValid(request, redi) else Jinja2Templates(directory="templates").TemplateResponse("login.html", {"request": request})

@router.get("/logout", include_in_schema=False)
async def logout(request: Request):
    LogoutSession(request, redi)
    response = RedirectResponse(url="/login", status_code=302)
    response.delete_cookie(key="uuid")
    return response

@router.get("/memvers", include_in_schema=False)
async def memvers(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("memvers.html", {"request": request})

@router.get("/ldap", include_in_schema=False)
async def _ldap(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("ldap.html", {"request": request})

@router.get("/register", include_in_schema=False)
async def register(request: Request):
    return Jinja2Templates(directory="templates").TemplateResponse("register.html", {"request": request})

@router.get("/edit")
async def edit(request: Request, nickname: str = None, db: Session = Depends(get_db)):
    return Jinja2Templates(directory="templates").TemplateResponse("edit.html", {"request": request}) if nickname != None else RedirectResponse(url="/memvers", status_code=302)

@router.post("/login")
async def login(request: Request):
    __formData = await request.form()
    '''
    데모를 위해 잠시 죽여둔 코드
    1. 휠 권한 확인
    2. 어드민 권한 확인
    *(ldap 로그인은 활성화 되어있음.)
    '''
    if ldap.bind(__formData.get("id"), __formData.get("pw")):# and (ldap.IsWheel(__formData.get("id"), __formData.get("pw")) or ldap.IsAdmin(__formData.get("pw"))):
        __uuid = CreateSession(request, redi)
        response = JSONResponse(content={"result": "success"})
        response.set_cookie(key="uuid", value=__uuid, httponly=True)
        return response
    else:
        return JSONResponse(content={"result": "failed"})

@router.get("/search")
async def memvers(request: Request, db: Session = Depends(get_db)):
    """
    # TODO: Implement authentication
    """
    params = request.query_params
    rtn = crud_admin.search(db=db, table=params.get("table"), key=params.get("column"), data=params.get("content"), mode=params.get("mode"))
    if type(rtn) == list:
        return JSONResponse(content={"status": "200", "msg": "success", "data": rtn})
    else:
        return JSONResponse(content={"status": "400", "msg": "Bad Request"})
        
"""
Register both LDAP and Nugu DB
"""
@router.post("/register")
async def register(request: Request, db: Session = Depends(get_db)):
    formData = await request.form()
    if ldap.bind(formData.get("nickname"), formData.get("pw")):
        return JSONResponse(content={"status": "400", "msg": "Already exist"})
    '''
    데모를 위해 잠시 죽여둔 코드
    어드민 권한 확인
    '''
    # if not ldap.addUser(un=formData.get("nickname"), adminpw=formData.get("adminpw")): 
    #     return JSONResponse(content={"status": "400", "msg": "Bad Request"})
    
    data = dict(formData)   # through register, pw comes with. 
    del data['pw']          # delete pw from data as it is not in nugu table.
    del data['adminpw']     # delete adminpw from data as it is not in nugu table.

    for key in models.get_keys_from_table(table='nugu'):
        if key not in data.keys():
            data[key] = models.yield_default_value_type_by_key(table='nugu', key=key)
        data[key] = models.type_casting_by_table(table='nugu', key=key, data=data[key])
    
    if crud_admin.insert(db=db, table='nugu', data=data):
        return JSONResponse(content={"status": "200", "msg": "success"})
    else:
        return JSONResponse(content={"status": "400", "msg": "Bad Request"})

@router.post("/add")
async def add(request: Request, db: Session = Depends(get_db)): 
    jsonData = await request.json()
    for key in models.get_keys_from_table(table=jsonData['table']):
        if key not in jsonData.keys():
            jsonData[key] = models.yield_default_value_type_by_key(table=jsonData['table'], key=key)
        jsonData[key] = models.type_casting_by_table(table=jsonData['table'], key=key, data=jsonData[key])
    if crud_admin.insert(db=db, table=jsonData['table'], data=jsonData):
        return JSONResponse(content={"status": "200", "msg": "success"})
    else:
        return JSONResponse(content={"status": "400", "msg": "Bad Request"})

@router.post("/edit")
async def edit(request: Request, db: Session = Depends(get_db)):
    jsonData = await request.json()
    if jsonData['table'] == 'ldap':
        '''
        데모를 위해 잠시 죽여둔 코드
        어드민 권한 확인
        '''
        return JSONResponse(content={"status": "200", "msg": "success"})
        # if ldap.resetPassword(un=jsonData['nickname'], npass=jsonData["pw"], adminpw=jsonData["adminpw"]):
        #     return JSONResponse(content={"status": "200", "msg": "success"})
        # return JSONResponse(content={"status": "400", "msg": "Bad Request"})

    oldcontents = jsonData['oldcontents']
    newcontents = jsonData['newcontents']
    
    del jsonData['oldcontents']
    del jsonData['newcontents']
    
    oldcontents['nickname'] = jsonData['nickname']
    newcontents['nickname'] = jsonData['nickname']

    for key in models.get_keys_from_table(table=jsonData['table']):
        if key not in newcontents.keys():
            newcontents[key] = models.yield_default_value_type_by_key(table=jsonData['table'], key=key)
        newcontents[key] = models.type_casting_by_table(table=jsonData['table'], key=key, data=newcontents[key])
        if key not in oldcontents.keys():
            oldcontents[key] = models.yield_default_value_type_by_key(table=jsonData['table'], key=key)
        oldcontents[key] = models.type_casting_by_table(table=jsonData['table'], key=key, data=oldcontents[key])
    
    if crud_admin.edit(db=db, table=jsonData['table'], olddata=oldcontents, newdata=newcontents):
        return JSONResponse(content={"status": "200", "msg": "success"})
    else:
        return JSONResponse(content={"status": "400", "msg": "Bad Request"})

@router.post("/delete")
async def delete(request: Request, db: Session = Depends(get_db)):
    jsonData = await request.json()
    for key in models.get_keys_from_table(table=jsonData['table']):
        if key not in jsonData.keys():
            jsonData[key] = models.yield_default_value_type_by_key(table=jsonData['table'], key=key)
        jsonData[key] = models.type_casting_by_table(table=jsonData['table'], key=key, data=jsonData[key])
    if crud_admin.delete(db=db, table=jsonData['table'], data=jsonData):
        return JSONResponse(content={"status": "200", "msg": "success"})
    else:
        return JSONResponse(content={"status": "400", "msg": "Bad Request"})