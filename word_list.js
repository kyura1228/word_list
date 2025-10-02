let words = [];
let currentIndex = 0;
let showMeaning = false;

function renderWords() {
    const list = document.getElementById('wordList');
    list.innerHTML = '';
    words.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'word-item';
        div.innerHTML = `
            <span>
                <span class="word">${item.word}</span>
                <span class="meaning">${item.meaning}</span>
            </span>
            <span class="actions">
                <button onclick="editWord(${idx})">編集</button>
                <button onclick="deleteWord(${idx})">削除</button>
            </span>
        `;
        list.appendChild(div);
    });
    saveWords(); // ← 単語帳表示時に保存
}

function renderFlashcard() {
    const card = document.getElementById('flashcard');
    if (!words.length) {
        card.innerHTML = '<div class="flashcard-empty">単語がありません</div>';
        return;
    }
    const item = words[currentIndex];
    card.innerHTML = `
        <div class="flashcard-content">
            <div class="flashcard-word">${item.word}</div>
            <div class="flashcard-meaning" style="display:${showMeaning ? 'block' : 'none'}">${item.meaning}</div>
        </div>
        <div class="flashcard-actions">
            <button onclick="prevCard()">前へ</button>
            <button onclick="flipCard()">めくる</button>
            <button onclick="nextCard()">次へ</button>
        </div>
        <div class="flashcard-index">${currentIndex + 1} / ${words.length}</div>
    `;
}

function prevCard() {
    if (words.length) {
        currentIndex = (currentIndex - 1 + words.length) % words.length;
        showMeaning = false;
        renderFlashcard();
    }
}

function nextCard() {
    if (words.length) {
        currentIndex = (currentIndex + 1) % words.length;
        showMeaning = false;
        renderFlashcard();
    }
}

function flipCard() {
    showMeaning = !showMeaning;
    renderFlashcard();
}

document.getElementById('addForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const word = document.getElementById('wordInput').value.trim();
    const meaning = document.getElementById('meaningInput').value.trim();
    if (word && meaning) {
        words.push({ word, meaning });
        renderWords();
        this.reset();
    }
});

window.deleteWord = function(idx) {
    if (confirm('本当に削除しますか？')) {
        words.splice(idx, 1);
        if (currentIndex >= words.length) currentIndex = Math.max(0, words.length - 1);
        renderWords();
    }
};

window.editWord = function(idx) {
    const item = words[idx];
    const newWord = prompt('単語を編集:', item.word);
    const newMeaning = prompt('意味を編集:', item.meaning);
    if (newWord && newMeaning) {
        words[idx] = { word: newWord, meaning: newMeaning };
        renderWords();
    }
};

// 単語帳データをCookieに保存
function saveWords() {
    document.cookie = "words=" + encodeURIComponent(JSON.stringify(words)) + ";path=/";
}

// Cookieから単語帳データを読み込み
function loadWords() {
    const match = document.cookie.match(/(?:^|; )words=([^;]*)/);
    if (match) {
        try {
            words = JSON.parse(decodeURIComponent(match[1]));
        } catch {}
    }
}

document.getElementById('flashcardModeBtn').addEventListener('click', () => {
    document.getElementById('mainView').style.display = 'none';
    document.getElementById('flashcardView').style.display = 'block';
    showMeaning = false;
    renderFlashcard();
});

document.getElementById('backToMainBtn').addEventListener('click', () => {
    document.getElementById('flashcardView').style.display = 'none';
    document.getElementById('mainView').style.display = 'block';
    renderWords();
});

loadWords();
renderWords();