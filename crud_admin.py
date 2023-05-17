from sqlalchemy import text
from sqlalchemy.orm import Session
import pymysql

from typing import Dict, List, Tuple, Any, Union

import models, schema

PK = models.Nugu.nickname.__str__().split(".")[-1]
HANDLER = ["create", "read", "update"]

def _execute(db: Session, query: str = None):
    try:
        cursor = db.execute(query)
        db.commit()
        if cursor.  rowcount > 0:
            return True, {"status": 200, "message": f"REQ | Successfully executed"}
        return False, {"status": 400, "message": f"REQ | Failed to execute"}
    except Exception as e:
        return False, e

def _achivement_duplicate_check(db: Session, data: Dict = None):
    try:
        cursor = db.execute(text(f"SELECT * FROM achivement WHERE nickname='{data['nickname']}' AND content='{data['content']}'"))  # True: exist, False: not exist => insert only if not exist(=False)
        if cursor.rowcount > 0:
            return True
        return False
    except Exception as e:
        return {"status": 500, "message": f"REQ | achivement | {e}"}

def insert(db: Session, table: str = None, data: Dict = None):
    try:
        if table == "achivement":
            if _achivement_duplicate_check(db=db, data=data):
                return False
        sorted_data = {}
        for key in models.get_keys_from_table(table=table):
            sorted_data[key] = data[key]
        rtn, msg = _execute(db=db, query=text(f"INSERT INTO {table} VALUES {tuple(sorted_data.values())}"))
        return rtn
    except Exception as e:
        return False
    finally:
        db.close()

def update(db: Session, table: str = None, data: Dict = None): # Needed: Different edition level by privilige.
    try:
        update_list = []
        for key, value in data.items():
            if key == PK:
                continue
            if value == None or value == '':
                continue
            update_list.append(f"{key}={value}")
        rtn, msg = _execute(db=db, query=text(f"UPDATE {table} SET {', '.join(update_list)} WHERE {PK}='{data['nickname']}'"))
        return msg if rtn else {"status": 500, "message": f"REQ | {table} | {msg}"}
    except Exception as e:
        return {"status": 500, "message": f"REQ | {table} | {e}"}
    finally:
        db.close()

def search(db: Session, table: str = None, key: str = PK, data: str = None, mode: str = "OR") -> Dict:
    try:
        rtn = []
        cursor = None
        if mode == "EXACT":
            cursor = db.execute(text(f"SELECT * FROM {table} WHERE {key}='{data}' ORDER BY {PK}"))
        elif mode == "AND":
            __constraints = [f"{key}='{value}'" for key, value in data.items() if value != None and value != '']
            cursor = db.execute(text(f"SELECT * FROM {table} WHERE {' AND '.join(__constraints)} ORDER BY {PK}"))
        elif mode == "OR":
            cursor = db.execute(text(f"SELECT * FROM {table} WHERE {key} LIKE '%{data}%' ORDER BY {PK}"))
        elif mode == "XOR":
            cursor = db.execute(text(f"SELECT * FROM {table} WHERE {' XOR '.join(data)} ORDER BY {PK}"))
        elif mode == "NOT":
            cursor = db.execute(text(f"SELECT * FROM {table} WHERE NOT {' AND NOT '.join(data)} ORDER BY {PK}"))
        else:
            return {"status": 400, "message": f"REQ | {table} | Invalid mode", "data": None}
        
        db.commit()
        
        for row in cursor.fetchall():
            rtn.append(dict(row))
        
        return rtn
    
    except Exception as e:
        return {"status": 500, "message": f"REQ | {table} | {e}"}
    finally:
        db.close()


def read(db: Session, table: str = None, data: Dict = None, mode: str = "AND") -> Dict:
    try:
        rtn = []
        __constraints = []
        
        for key, value in data.items():
            if value == None or value == '':
                continue
            __constraints.append(f"{key}='{value}'")

        cursor = None
        if mode == "AND":
            cursor = db.execute(text(f"SELECT * FROM {table} WHERE {' AND '.join(__constraints)} ORDER BY {PK}"))
        elif mode == "OR":
            cursor = db.execute(text(f"SELECT * FROM {table} WHERE {' OR '.join(__constraints)} ORDER BY {PK}"))
        elif mode == "XOR":
            cursor = db.execute(text(f"SELECT * FROM {table} WHERE {' XOR '.join(__constraints)} ORDER BY {PK}"))
        elif mode == "NOT":
            cursor = db.execute(text(f"SELECT * FROM {table} WHERE NOT {' AND NOT '.join(__constraints)} ORDER BY {PK}"))
        else:
            return {"status": 400, "message": f"REQ | {table} | Invalid mode", "data": None}
        
        db.commit()
        keys = None

        for key in models.KEYS:
            if list(key.keys())[0] == table:
                keys = key[list(key.keys())[0]]
                break
    
        for row in cursor.fetchall():
            tmp = {}
            for i in range(len(keys)):
                tmp[keys[i]] = row[i]
            rtn.append(tmp)

        return rtn
    except Exception as e:
        return {"status": 500, "message": f"REQ | {table} | {e}"}
    finally:
        db.close()