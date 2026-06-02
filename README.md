# German Learning full-stack app. Made for German to Bulgarian (no english translations yet. Could add other languages in the future, don't expect it soon though).

This is a fastAPI-powered app that helps you learn the vocabulary and any specific properties of words (like forcing Dativ or Akkusativ and anything else).

1. To start the app you have to navigate to the folder where the python backend lives (backend) and type:
    python -m uvicorn main:app --reload.

2. You can add your own words (saved via SQL) and you can search through the words via the buttons or the 'search for words' button. You can't search via the url bar anymore because when you reload the page it clears the parameters and it's left with the pathname only.

3. When you have added some words you can use the trainer accessible via the trainer button in the home screen. You can view your mastery of each word (how many times you've gotten the word translation correctly) via the browse words button in the home page.
     
4. Play around and maybe learn some german so you can go to Frankfurt and become a donerkebab guy with a thick moustache! (probably better than programming tbh)