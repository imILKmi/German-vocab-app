#magic to run the api and shit start
from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List,Dict,Optional
import random
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)
#magic to run the api and shit end

MainFileDIR = os.path.dirname(os.path.abspath(__file__))
FrontendDIR = os.path.join(MainFileDIR, '..', 'frontend')

class WordCreate(BaseModel):
    wordde: str
    wordbg: List[str]
    word_type: str
    extra_info: Optional[Dict] = {}

def SearchMeaningList(wordg):
    for i in wordg:
        return i

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

words = [
    MakeWord("Hund","Куче","noun",gender = "der"),
    MakeWord("Frau","Жена","noun",gender = "die"),
    MakeWord("haben","Имам","verb",special_conj = False),
    MakeWord("Sendung",["Пратка","ТВ Предаване","Предаване","Теливизионно предаване"],"noun",gender = "die")
]

@app.post('/add-word')
def add_word(word_in: WordCreate):
    new_word = MakeWord(word_in.wordde,word_in.wordbg,word_in.word_type,**word_in.extra_info)
    words.append(new_word)
    return{'message':f"'{word_in.wordde}' added to the list"}

@app.get("/word")
def get_words():
    databox = []
    for i in words:
        databox.append(i.to_dict())
    return databox

@app.get("/word/{target}")
def get_search(target:str):
    databox = []
    for i in words:
        if target.lower() == i.wordde.lower() or target.lower() == SearchMeaningList(i.wordbg): #for the word itself
            return i.to_dict()
        elif i.word_type.lower() == target.lower(): #for the type
            databox.append(i.to_dict())
        elif target.lower() in i.extra_info.values():
            databox.append(i.to_dict())
        elif target.lower() == "train":
            randword = random.choice(words)
            return randword.to_dict()
    return databox

@app.get("/")
def hello():
    #return {"message": "Welcome to the german learning app Pich. Still in development but hey you can test it right?"}
    return FileResponse(os.path.join(FrontendDIR, "index.html"))
app.mount("/", StaticFiles(directory=FrontendDIR), name="frontend")