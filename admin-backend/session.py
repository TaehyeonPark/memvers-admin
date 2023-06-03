from fastapi.requests import Request
from inmemorydb import Redi
import uuid
import datetime

getUTCnow = lambda : datetime.datetime.utcnow().timestamp()

def expire_session(func):
    def wrapper(request : Request, redi : Redi):
        rtn = func(request, redi)
        __uuid = request.cookies.get("uuid")
        if __uuid != None:
            redi.delete(__uuid)
        return rtn
    return wrapper

def IsUUIDValid(request : Request, redi : Redi) -> bool:
    try:
        __uuid = request.cookies.get("uuid")
        if getUTCnow() - float(redi.get(key=__uuid).decode("utf-8")) > 5*60:
            return False
        else:
            redi.set(__uuid, getUTCnow(), ex=60*60)
            return True
    except:
        return False

@expire_session
def CreateSession(request : Request, redi : Redi) -> uuid:
    __uuid = uuid.uuid4().hex
    redi.set(__uuid, getUTCnow(), ex=60*60)
    return __uuid

@expire_session
def RefreshSession(request : Request, redi : Redi) -> uuid:
    __uuid = uuid.uuid4().hex
    redi.set(__uuid, getUTCnow(), ex=60*60)
    return __uuid

def LogoutSession(request : Request, redi : Redi) -> None:
    __uuid = request.cookies.get("uuid")
    redi.delete(__uuid)

def IsRequestedURLValid(request : Request, redi : Redi) -> bool:
    pass