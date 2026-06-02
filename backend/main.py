from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List,Dict,Optional
import random
import os
from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from fastapi import Depends

from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

SQLALCHEMY_DATABASE_URL = "sqlite:///./DeutcheWeb.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

MainFileDIR = os.path.dirname(os.path.abspath(__file__))
FrontendDIR = os.path.join(MainFileDIR, '..', 'frontend')

class WordDB(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    wordde = Column(String, index=True)
    wordbg = Column(JSON)
    word_type = Column(String)
    extra_info = Column(JSON)
    mastery_level = Column(Integer, default=0)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class WordCreate(BaseModel):
    wordde: str
    wordbg: List[str]
    word_type: str
    extra_info: Optional[Dict] = {}


class MakeWord:
    def __init__(self,wordde,wordbg,word_type,**extra_info):
        self.wordde = wordde
        self.wordbg = wordbg
        self.word_type = word_type
        self.extra_info = extra_info
    def to_dict(self):
        data = {
            "wordde": self.wordde,
            "wordbg": self.wordbg,
            "word_type": self.word_type,
            "extra_info": self.extra_info
        }
        return data

@app.post('/add-word')
def add_word(word_in: WordCreate, db: Session = Depends(get_db)):
    new_word = WordDB(
        wordde=word_in.wordde,
        wordbg=word_in.wordbg,
        word_type=word_in.word_type,
        extra_info=word_in.extra_info
    )
    db.add(new_word)
    db.commit()
    return {'message': f"'{word_in.wordde}' saved to database"}

@app.get("/word")
def get_words(db: Session = Depends(get_db)):
    all_words = db.query(WordDB).all()
    return all_words

@app.get("/word/{target}")
def get_search(target: str, db: Session = Depends(get_db)):
    if target.lower() == "train":
        all_words = db.query(WordDB).all()
        return random.choice(all_words) if all_words else {"error": "No words in DB"}
    
    exact_match = db.query(WordDB).filter(WordDB.wordde == target).first()
    if exact_match:
        return exact_match
    
    type_matches = db.query(WordDB).filter(WordDB.word_type == target.lower()).all()
    if type_matches:
        return type_matches
    
    return {"error": "Nothing found"}

@app.delete("/word/{word_id}")
def delete_word(word_id: int, db: Session = Depends(get_db)):
    word_to_delete = db.query(WordDB).filter(WordDB.id == word_id).first()
    if not word_to_delete:
        return {"error": "Word not found"}
    
    db.delete(word_to_delete)
    db.commit()
    return {"message": f"Word {word_id} deleted successfully"}

@app.post("/word/{word_id}/review")
def review_word(word_id: int, status: str, db: Session = Depends(get_db)):
    word = db.query(WordDB).filter(WordDB.id == word_id).first()
    if not word:
        return {"error": "Word not found"}
    
    if status == "correct":
        word.mastery_level += 1
    elif status == "wrong":
        word.mastery_level -= 1
        
    db.commit()
    return {"message": f"Mastery updated to {word.mastery_level}"}

@app.get("/")
def hello():
    return {"message": "Welcome to the german learning app DeutscheWeb. Still in development but hey you can test it right?"}
    #return FileResponse(os.path.join(FrontendDIR, "index.html"))
app.mount("/", StaticFiles(directory=FrontendDIR), name="frontend")