from datetime import datetime
import uuid

def get_internal_servertime() -> datetime:
    return datetime.utcnow().time()

def get_random_uuid() -> str:
    return str(uuid.uuid4())