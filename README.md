# German Learning full-stack app. Made for German to Bulgarian (no english translations yet)

This is a fastAPI-powered app that helps you learn the vocabulary and any specific properties of words (like forcing Dativ or Akkusativ and anything else).

1. To start the app you have to navigate to the folder where the python backend lives (backend) and type:
    python -m uvicorn main:app --reload.

2. Open the HTML file in the "frontend" folder and search for something with either "?word" or "?word=XYZ" in the URL bar.
    the current supported searches are:
     1. "?word" (shows all of the words)
     2. "?word={any_word}" (shows you only 1 word and all of the info it has)
     3. "?word={any_word_type}" (shows you all of the words of that type like all nouns)
     4. "?word={any_extra_info_of_a_word}" (shows you all words with that extra info in them like all words with a specific gender)
     5. "?word=train" (Shows the training mode)
     
3. Play around and maybe learn some german so you can go to Frankfurt and become a donerkebab guy with a thick moustache!