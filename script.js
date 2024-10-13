const words = ['alien', 'planet', 'galaxy', 'asteroid', 'nebula', 'comet', 'meteor', 'starship', 'cosmos', 'lunar', 'solar', 'orbit', 'gravity', 'wormhole', 'quasar', 'pulsar', 'supernova', 'telescope', 'constellation', 'interstellar'];
        let currentWords = [];
        let wordSpeed = 1;
        let score = 0;
        let gameOver = false;
        let lastSpeedUpdate = Date.now();

        const gameArea = document.getElementById('game-area');
        const input = document.getElementById('input');
        const scoreElement = document.getElementById('score-value');
        const gameOverElement = document.getElementById('game-over');
        const startAgainButton = document.getElementById('start-again');

        // Starfield
        const canvas = document.getElementById('starfield');
        const ctx = canvas.getContext('2d');
        let stars = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        }

        function initStars() {
            stars = [];
            for (let i = 0; i < 200; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2,
                    speed: Math.random() * 3 + 1
                });
            }
        }

        function drawStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
                star.y += star.speed;
                if (star.y > canvas.height) {
                    star.y = 0;
                }
            });
            requestAnimationFrame(drawStars);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawStars();

        function init() {
            currentWords = [];
            wordSpeed = 1;
            score = 0;
            gameOver = false;
            lastSpeedUpdate = Date.now();
            scoreElement.textContent = score;
            gameOverElement.style.display = 'none';
            input.value = '';
            input.focus();
            gameArea.innerHTML = '';
        }

        function createWord() {
            const word = words[Math.floor(Math.random() * words.length)];
            const wordElement = document.createElement('div');
            wordElement.className = 'word';
            wordElement.textContent = word;
            gameArea.appendChild(wordElement);
            
            const wordWidth = wordElement.offsetWidth;
            const wordHeight = wordElement.offsetHeight;
            
            // Find a non-overlapping position for the new word
            let left, top;
            let overlapping;
            let attempts = 0;
            const maxAttempts = 50;

            do {
                left = Math.random() * (gameArea.offsetWidth - wordWidth);
                top = -wordHeight;  // Start above the game area
                overlapping = currentWords.some(existingWord => {
                    return (left < existingWord.left + existingWord.width &&
                            left + wordWidth > existingWord.left &&
                            top < existingWord.top + existingWord.height &&
                            top + wordHeight > existingWord.top);
                });
                attempts++;
            } while (overlapping && attempts < maxAttempts);

            if (attempts === maxAttempts) {
                gameArea.removeChild(wordElement);
                return false;  // Couldn't find a non-overlapping position
            }

            wordElement.style.left = `${left}px`;
            wordElement.style.top = `${top}px`;

            currentWords.push({
                element: wordElement,
                word: word,
                left: left,
                top: top,
                width: wordWidth,
                height: wordHeight
            });

            return true;
        }

        function updateWordPositions() {
            for (let i = currentWords.length - 1; i >= 0; i--) {
                const wordObj = currentWords[i];
                wordObj.top += wordSpeed;
                wordObj.element.style.top = `${wordObj.top}px`;

                if (wordObj.top > gameArea.offsetHeight) {
                    gameArea.removeChild(wordObj.element);
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
                    currentWords[i].element.classList.add('correct');
                    setTimeout(() => {
                        gameArea.removeChild(currentWords[i].element);
                        currentWords.splice(i, 1);
                    }, 300);
                    input.value = '';
                    break;
                }
            }
        }

        function updateWordSpeed() {
            const now = Date.now();
            if (now - lastSpeedUpdate > 30000) {
                wordSpeed *= 1.2;
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
                if (Math.random() < 0.02 && currentWords.length < 10) {
                    createWord();
                }
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