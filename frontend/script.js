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
        } else if (wordQuery == "train"){
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

        document.getElementById('view-title').innerText = "All Words";
        list.classList.remove('hidden');

        words.forEach(word => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('.de-text').innerText = word.wordde;
            clone.querySelector('.bg-text').innerText = word.wordbg;
            list.appendChild(clone);
        });
    }else{
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

function showTrainer(wrod){
    
}

function showError(msg) {
    const err = document.getElementById('error-msg');
    err.innerText = msg;
    err.classList.remove('hidden');
}

window.onload = handleUrlNavigation;