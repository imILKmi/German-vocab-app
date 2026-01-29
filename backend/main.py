#magic to run the api and shit start
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)
#magic to run the api and shit end

import random

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
    MakeWord("Sendung",["pratka","TV predavane"],"noun",gender = "die")
]


@app.get("/")
def hello():
    return {"message": "Welcome to the german learning app Pich. Still in development but hey you can test it right?"}

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