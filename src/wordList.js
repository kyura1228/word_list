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
                <button class="editBtn" onclick="editWord(${idx})">編集</button>
                <button class="deleteBtn" onclick="deleteWord(${idx})">削除</button>
            </span>
        `;
        list.appendChild(div);
    });
    saveWords(); // ← localStorage に保存するようになりました
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

// --- Cookie -> localStorage マイグレーション関数 ---
function migrateCookieToLocalStorage() {
    // Cookie に保存された 'words' を探す
    const match = document.cookie.match(/(?:^|; )words=([^;]*)/);
    if (!match) return;

    // localStorage に既にデータがある場合は上書きしない
    if (localStorage.getItem('words')) {
        // 移行不要だが古い Cookie は削除しておく（任意）
        try {
            document.cookie = "words=; Max-Age=0; path=/";
        } catch {}
        return;
    }

    try {
        const decoded = decodeURIComponent(match[1]);
        const parsed = JSON.parse(decoded);
        if (Array.isArray(parsed)) {
            localStorage.setItem('words', JSON.stringify(parsed));
        }
        // 移行完了したら Cookie を削除
        document.cookie = "words=; Max-Age=0; path=/";
    } catch (e) {
        console.error('Cookie -> localStorage の移行に失敗しました', e);
    }
}

// 単語帳データを localStorage に保存
function saveWords() {
    try {
        localStorage.setItem('words', JSON.stringify(words));
    } catch (e) {
        console.error('保存に失敗しました', e);
    }
}

// localStorage から単語帳データを読み込み
function loadWords() {
    const raw = localStorage.getItem('words');
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) words = parsed;
        } catch (e) {
            console.error('読み込みデータの解析に失敗しました', e);
            words = [];
        }
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

// ページ読み込み時: まず Cookie があれば移行、その後 localStorage から読み込む
migrateCookieToLocalStorage();
loadWords();
renderWords();