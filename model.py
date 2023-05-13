from typing import Optional, List, Dict

from pydantic import BaseModel

class Login(BaseModel):
    id: str
    pw: str