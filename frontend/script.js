let currentWord = null;
let curList = ``;

document.getElementById('Home').classList.remove('hidden');
async function handleUrlNavigation() {
    const urlParams = new URLSearchParams(window.location.search);
    const wordQuery = urlParams.get('word');
    const apiUrl = "http://127.0.0.1:8000/word" + (wordQuery ? "/" + wordQuery : "");
    hideAll();
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (document.getElementById('Home').classList.contains('hidden')) {
            if (data.error) {
                showError(data.error);
            } else if (Array.isArray(data)) {
                if (wordQuery != null) {
                    curList = `?word=${wordQuery}`;
                } else {
                    curList = `?word`;
                }
                showList(data);
            } else if (Array.isArray(data) == false && wordQuery != "train" && typeof data !== 'string') {
                showCard(data);
            } else if (wordQuery == "train") {
                currentWord = data;
                showTrainer(data);
            }
        }
    } catch (err) {
        showError("Server is offline!");
    }
}

function showList(words) {
    if (words[0] != undefined) {
        document.getElementById('bar').classList.remove('hidden');
        document.getElementById('list-container').innerHTML = '';
        document.getElementById('word-list').classList.remove('hidden');
        window.history.pushState({}, '', curList);
        for (let i = 0; i < words.length; i++) {
            const clone = document.getElementById('list-item-template').content.cloneNode(true);
            clone.querySelector('.de-text').innerText = words[i].wordde;
            clone.querySelector('.bg-text').innerText = words[i].wordbg;
            const listShort = clone.querySelector('li');
            listShort.onclick = function () {
                document.getElementById('word-list').classList.add('hidden');
                window.history.pushState({}, '', `?word=${words[i].wordde}`);
                handleUrlNavigation();
            }
            document.getElementById('list-container').appendChild(clone);
        }
    } else {
        showError('FastAPI returned an empty array. Please god be easy to solve this!');
    }
}

function showCard(word) {
    document.getElementById('card-container').classList.remove('hidden');
    // Pulnim htmla s JSONa ot fastapi
    document.getElementById('card-de').innerText = word.wordde;
    document.getElementById('card-bg').innerText = word.wordbg;
    document.getElementById('card-type').innerText = word.word_type;

    // praim nekvi vunshni raboti za da raboti
    const Cont = document.getElementById('card-extra');
    const row = document.getElementById('extra-row');
    Cont.innerHTML = "";
    // dobavqme bezkraini extra_info
    if (word.extra_info) {
        // razkrivame objecta extra_info shtot se prashta ot fastapi kat obj/dict
        Object.entries(word.extra_info).forEach(([key, value]) => {
            const line = document.createElement('p');
            line.innerHTML = `${key}: ${value}`;
            Cont.appendChild(line);
        });
        row.classList.remove('hidden');
    } else {
        row.classList.add('hidden');
    }
}

function showTrainer(word) {
    document.getElementById('trainer-container').classList.remove('hidden');

    document.getElementById('question-word-de').innerText = word.wordde;
    document.getElementById('answer').value = "";
    document.getElementById('feedback').innerText = "";
    document.getElementById('answer').focus();
}

function TrainerButtonHandler() {
    const button = document.getElementById('check-answer')
    const feedback = document.getElementById('feedback');

    if (button.innerText == "Check Answer") {
        const userAnswer = document.getElementById('answer').value.trim();
        if (Array.isArray(currentWord.wordbg)) {
            for (let i = 0; i < currentWord.wordbg.length; i++) {
                if (userAnswer.toLowerCase() === currentWord.wordbg[i].toLowerCase()) {
                    feedback.innerText = "Correct!";
                    feedback.style.backgroundColor = "green";
                    button.innerText = "Next Word?";
                    break;
                } else {
                    feedback.innerText = "Wrong!";
                    feedback.style.backgroundColor = "red";
                }
            }
        } else {
            if (userAnswer.toLowerCase() === currentWord.wordbg.toLowerCase()) {
                feedback.innerText = "Correct!";
                feedback.style.backgroundColor = "green";
                button.innerText = "Next Word?";
            } else {
                feedback.innerText = "Wrong!";
                feedback.style.backgroundColor = "red";
            }
        }
    } else {
        button.innerText = "Check Answer";
        handleUrlNavigation();
    }
}

function HandleHomeNav(where) {
    if (window.location.search === '') {
        const home = document.getElementById('Home');
        if (where.toLowerCase() === "train") {
            window.history.pushState({}, '', '?word=train');
            home.classList.add('hidden');

        } else if (where.toLowerCase() === "browse") {
            window.history.pushState({}, '', window.location.pathname);
            home.classList.add('hidden');
        }
        handleUrlNavigation();
    }
}

function hideAll() {
    document.getElementById('word-list').classList.add('hidden');
    document.getElementById('card-container').classList.add('hidden');
    document.getElementById('trainer-container').classList.add('hidden');
    document.getElementById('bar').classList.add('hidden');
    document.getElementById('add-word').classList.add('hidden');
}

function goHome() {
    window.history.pushState({}, '', window.location.pathname);
    document.getElementById('Home').classList.remove('hidden');
    handleUrlNavigation();
}

function goListBack() {
    window.history.pushState({}, '', curList);
    handleUrlNavigation();
}

function buttonSearch() {
    const userChoice = prompt("What do you want to search for?");
    const Choicecleen = userChoice.trim().toLowerCase;
    if (userChoice !== null) {
        if (Choicecleen !== "") {
            window.history.pushState({}, '', `?word=${userChoice.toLowerCase()}`);
            document.getElementById('Home').classList.add('hidden');
            handleUrlNavigation();
        }
    } else {
        return;
    }
}

function show(){
    window.history.pushState({},'',`?word=add`);
    hideAll();
    document.getElementById('add-word').classList.remove('hidden');
}

async function SaveWord() {
    const wordde = document.getElementById('new-de').value;
    const wordbg = document.getElementById('new-bg').value.split(',').map(w => w.trim());;
    const word_type = document.getElementById('new-type').value;
    const extra = document.getElementById('new-extra-info').value;
    const extra_info = {};
    if(extra.includes(':')){
        const [key,val] = extra.split(':');
        extra_info[key.trim()] = val.trim();
    }

    const payload = {wordde,wordbg,word_type,extra_info};
    const response = await fetch('http://127.0.0.1:8000/add-word', {method: 'POST',headers: { 'Content-Type': 'application/json' },body: JSON.stringify(payload)});
    const result = await response.json();
    alert(result.message);
}

function quickSearch(type){
    window.history.pushState({},'',`?word=${type.toLowerCase()}`);
    handleUrlNavigation();
}

function showError(msg) {
    const err = document.getElementById('error-msg');
    err.innerText = msg;
    err.classList.remove('hidden');
}

window.onload = () => {
    window.history.pushState({}, '', window.location.pathname);
    handleUrlNavigation();
}