let currentWord = null;
async function handleUrlNavigation() {
    const urlParams = new URLSearchParams(window.location.search);
    const wordQuery = urlParams.get('word');
    const apiUrl = "http://127.0.0.1:8000/word" + (wordQuery ? "/" + wordQuery : "");

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            showError(data.error);
        } else if (Array.isArray(data)) {
            showList(data);
        } else if (Array.isArray(data) == false && wordQuery != "train") {
            showCard(data);
        } else if (wordQuery == "train") {
            currentWord = data;
            showTrainer(data);
        }
    } catch (err) {
        showError("Server is offline!");
    }
}

function showList(words) {
    if (words[0] != undefined) {
        const list = document.getElementById('word-list');
        const template = document.getElementById('list-item-template');
        list.innerHTML = "";
        document.getElementById('view-title').innerText = "All Words";
        list.classList.remove('hidden');

        words.forEach(word => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('.de-text').innerText = word.wordde;
            clone.querySelector('.bg-text').innerText = word.wordbg;

            const LI = clone.querySelector('li')
            LI.style.cursor = "pointer";
            LI.onclick = () => {
                if (new URLSearchParams(window.location.search).get('word') != null) {
                    document.getElementById('card-back').setAttribute('href', `?word=${new URLSearchParams(window.location.search).get('word')}`);
                }
                list.classList.add('hidden');
                window.history.pushState({}, '', `?word=${word.wordde}`);
                handleUrlNavigation();
            }
            list.appendChild(clone);
        });
    } else {
        showError("Incorrect search! Maybe check spelling...")
    }
}

function showCard(word) {
    document.getElementById('view-title').innerText = "Word Details";
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
    document.getElementById('view-title').innerText = "Train words"
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
        location.reload();
    }
}

function Searchfrombutton() {
    const userChoice = prompt("What do you want to search for?");
    const Choicecleen = userChoice.trim().toLowerCase;
    if (userChoice !== null) {
        if (Choicecleen !== "") {
            document.getElementById('word-list').classList.add('hidden');
            document.getElementById('card-container').classList.add('hidden');
            document.getElementById('trainer-container').classList.add('hidden');
            window.history.pushState({}, '', `?word=${userChoice.toLowerCase()}`);
            handleUrlNavigation();
        }
    } else {
        return;
    }
}

function showError(msg) {
    const err = document.getElementById('error-msg');
    err.innerText = msg;
    err.classList.remove('hidden');
}

window.onpopstate = () => handleUrlNavigation();
window.onload = handleUrlNavigation;