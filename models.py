from sqlalchemy import Column, Integer, String, ForeignKey, Date, Boolean, Float, BOOLEAN
from sqlalchemy.orm import relationship, backref, declarative_base

Base = declarative_base()


class Nugu(Base):
    __tablename__ = 'nugu'

    nickname=Column(String(length=20), primary_key=True)
    studentId=Column(String(length=20), nullable=not True)
    email=Column(String(length=100), unique=True)
    phoneNum=Column(String(length=11), unique=True)
    manager=Column(Boolean, default=False, nullable=not True)
    dongbang=Column(Boolean, default=False, nullable=not True)
    birthday=Column(Integer)
    developer=Column(Boolean, default=False, nullable=not True)
    designer=Column(Boolean, default=False, nullable=not True)
    wheel=Column(Boolean, default=False, nullable=not True)
    rnk=Column(Integer, default=0, nullable=not True) # 0: 준회원 1: 정회원 2: 명예회원
    hide=Column(Boolean, default=True, nullable=not True)

    def __type__():
        return {"nickname": str, "studentId": str, "email": str, "phoneNum": str, "manager": bool, "dongbang": bool, "birthday": int, "developer": bool, "designer": bool, "wheel": bool, "rnk": int, "hide": bool}

class Footprint():
    __tablename__ = 'footprint'
    
    nickname=Column(String(length=20), nullable=not True)
    history=Column(String(length=100))
    joinDate=Column(Boolean, default=True, nullable=not True)
    project=Column(String(length=100))
    pm=Column(String(length=20))
    promotion=Column(String(length=40))

    def __type__():
        return {"nickname": str, "history": str, "joinDate": bool, "project": str, "pm": str, "promotion": str}
    
class Achivement():
    __tablename__ = 'achivement'

    nickname=Column(String(length=20), nullable=not True)
    content=Column(String(length=100), nullable=not True)

    def __type__():
        return {"nickname": str, "content": str}

class Stack():
    __tablename__ = 'stack'
    
    nickname=Column(String(length=20), nullable=not True)
    stackName=Column(String(length=20), nullable=not True)

    def __type__():
        return {"nickname": str, "stackName": str}
    
class Outlink():
    __tablename__ = 'outlink'

    nickname=Column(String(length=20), nullable=not True)
    outLink=Column(String(length=100), nullable=not True)

    def __type__():
        return {"nickname": str, "outLink": str}

class Project():
    __tablename__ = 'project'

    nickname=Column(String(length=20), nullable=not True)
    project=Column(String(length=20), nullable=not True)
    current=Column(Boolean, default=True, nullable=not True)

    def __type__():
        return {"nickname": str, "project": str, "current": bool}


ORMS = [Nugu, Footprint, Achivement, Stack, Outlink, Project]
ORMS_DICT = {ORM.__tablename__ : ORM for ORM in ORMS}
TABLES = [table.__tablename__ for table in ORMS]
# TABLES = ['nugu', 'footprint', 'achivement', 'stack', 'outlink']
KEYS = [{ORM.__tablename__ : [key for key in ORM.__dict__.keys() if not key.startswith('_')]} for ORM in ORMS]
# KEYS = [
#   {'nugu': ['nickname', 'studentId', 'email', 'phoneNum', 'manager', 'dongbang', 'birthday', 'developer', 'designer', 'wheel', 'rnk', 'hide']},
#   {'footprint': ['nickname', 'history', 'joinDate', 'project', 'pm', 'promotion']},
#   {'achivement': ['nickname', 'content']}, {'stack': ['nickname', 'stackName']},
#   {'outlink': ['nickname', 'outLink']},
#   {'project': ['nickname', 'project', 'current']}
# ]
TYPES = [{ORM.__tablename__ : ORM.__type__()} for ORM in ORMS]


def get_keys_from_table(table : str) -> list:
    return KEYS[TABLES.index(table)][table]

def get_types_from_table(table : str) -> dict:
    return TYPES[TABLES.index(table)][table]

def yield_default_value_type_by_key(table : str, key : str) -> type:
    __type = get_types_from_table(table)[key]
    if __type == str:
        return ""
    elif __type == int:
        return 0
    elif __type == float:
        return 0.0
    elif __type == bool:
        return False
    else:
        return None