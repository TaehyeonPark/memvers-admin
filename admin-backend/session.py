from fastapi.requests import Request
from inmemorydb import Redi

def IsUUIDValid(request : Request, redi : Redi) -> bool:
    __uuid = None
    try:
        import datetime
        __uuid = request.cookies.get("uuid")
        if datetime.datetime.utcnow().timestamp() - float(redi.get(key=__uuid).decode("utf-8")) > 5*60:
            return False
        else:
            redi.set(__uuid, datetime.datetime.utcnow().timestamp(), ex=60*60)
            return True
    except:
        return False
    # return True if (redi.exist(key=request.client.host) and redi.get(key=request.client.host).decode("utf-8")) == __uuid else False

def IsRequestedURLValid(request : Request, redi : Redi) -> bool:
    pass