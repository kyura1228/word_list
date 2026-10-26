const indexHtml = document.getElementById("root");

indexHtml.innerHTML = `
<div class="container">
        <header>
            <button id="colorBtn" class="colorBtn">
                <div id="svg"></div>
            </button>
        </header>
        <h1>単語帳</h1>
        <div id="mainView">
            <form id="addForm">
                <input type="text" id="wordInput" placeholder="単語" required>
                <input type="text" id="meaningInput" placeholder="意味" required>
                <button type="submit">追加</button>
            </form>
            <div class="word-list" id="wordList"></div>
                <button id="flashcardModeBtn">フラッシュカード</button>
                <button id="importJsonBtn">インポート</button>
                <input type="file" id="fileInput" style="display: none;">
                <button id="exportJsonBtn">エクスポート</button>
            </div>
        <div id="flashcardView" style="display:none;">
            <h2>フラッシュカード</h2>
            <div id="flashcard"></div>
            <button id="backToMainBtn">単語帳</button>
        </div>
    </div>
`