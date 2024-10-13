const words = ['the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one', 'would', 'all', 'will', 'there', 'say', 'who', 'make', 'when', 'can', 'more', 'if', 'no', 'man', 'out', 'other', 'so', 'what', 'time', 'up', 'go', 'about', 'than', 'into', 'could', 'state', 'only'];
let currentWords = [];
let wordLength = 3;
let wordSpeed = 1;
let score = 0;
let gameOver = false;
let lastSpeedUpdate = Date.now();

const gameContainer = document.getElementById('game-container');
const input = document.getElementById('input');
const scoreElement = document.getElementById('score-value');
const gameOverElement = document.getElementById('game-over');
const startAgainButton = document.getElementById('start-again');

function init() {
    currentWords = [];
    wordLength = 3;
    wordSpeed = 1;
    score = 0;
    gameOver = false;
    lastSpeedUpdate = Date.now();
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    input.value = '';
    input.focus();
}

function createWord() {
    const word = words[Math.floor(Math.random() * words.length)];
    const wordElement = document.createElement('div');
    wordElement.className = 'word';
    wordElement.textContent = word;
    wordElement.style.left = `${Math.random() * (gameContainer.offsetWidth - 100)}px`;
    gameContainer.appendChild(wordElement);
    currentWords.push({ element: wordElement, word: word });
}

function updateWordPositions() {
    for (let i = currentWords.length - 1; i >= 0; i--) {
        const wordObj = currentWords[i];
        const top = wordObj.element.offsetTop + wordSpeed;
        wordObj.element.style.top = `${top}px`;

        if (top > gameContainer.offsetHeight) {
            gameContainer.removeChild(wordObj.element);
            currentWords.splice(i, 1);
            endGame();
        }
    }
}

function checkInput() {
    const typedWord = input.value.trim().toLowerCase();
    for (let i = 0; i < currentWords.length; i++) {
        if (currentWords[i].word === typedWord) {
            score++;
            scoreElement.textContent = score;
            gameContainer.removeChild(currentWords[i].element);
            currentWords.splice(i, 1);
            input.value = '';
            break;
        }
    }
}

function updateWordSpeed() {
    const now = Date.now();
    if (now - lastSpeedUpdate > 30000) {
        wordSpeed *= 1.5;
        lastSpeedUpdate = now;
    }
}

function endGame() {
    gameOver = true;
    gameOverElement.style.display = 'block';
}

function gameLoop() {
    if (!gameOver) {
        updateWordPositions();
        updateWordSpeed();
        if (Math.random() < 0.02) createWord();
        requestAnimationFrame(gameLoop);
    }
}

input.addEventListener('input', checkInput);

startAgainButton.addEventListener('click', () => {
    init();
    gameLoop();
});

init();
gameLoop();