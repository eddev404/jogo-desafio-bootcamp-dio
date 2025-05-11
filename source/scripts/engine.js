document.getElementById("start-button").addEventListener("click", () => {
    // Oculta a introdução
    document.getElementById("intro-box").style.display = "none";

    // Inicia a música de fundo
    let music = document.getElementById("background-music");
    music.play();  // Começa a música de fundo quando o jogo inicia

    // Inicia o jogo
    initialize();
});

// Pausar ou retomar a música
document.getElementById("toggle-music").addEventListener("click", () => {
    let music = document.getElementById("background-music");

    if (music.paused) {
        music.play();
        document.getElementById("toggle-music").textContent = "🎵";
    } else {
        music.pause();
        document.getElementById("toggle-music").textContent = "❌";
    }
});

const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector(".menu-lives h2"),
    },

    values: {
        gameVelocity: 700,
        hitPositions: {},
        result: 0,
        currentTime: 45,
        lives: 3,
        winningScore: 45, // 🎯 Limite para vencer
    },

    actions: {
        timerId: null,
        countDownTimerId: null,
    },
};

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0 || state.values.lives <= 0) {
        endGame("VOCÊ MORREU! O seu resultado foi: " + state.values.result);
    }
}

function playSound(type) {
    const src = type === "bandit"
        ? "./source/audio/hurt-bandit.wav"
        : "./source/audio/hurt-innocent.wav";

    const audio = new Audio(src);
    audio.volume = 0.2;
    audio.play();
}

function clearCharacters() {
    state.view.squares.forEach((square) => {
        square.classList.remove("bandit", "innocent-1", "innocent-2");
    });
    state.values.hitPositions = {};
}

function randomSquare() {
    clearCharacters();

    const allSquares = Array.from(state.view.squares);
    const shuffled = allSquares.sort(() => 0.5 - Math.random());

    const [banditSquare, innocent1Square, innocent2Square] = shuffled.slice(0, 3);

    banditSquare.classList.add("bandit");
    innocent1Square.classList.add("innocent-1");
    innocent2Square.classList.add("innocent-2");

    state.values.hitPositions = {
        [banditSquare.id]: "bandit",
        [innocent1Square.id]: "innocent",
        [innocent2Square.id]: "innocent",
    };
}

function updateLivesDisplay() {
    state.view.lives.textContent = `x${state.values.lives}`;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            const type = state.values.hitPositions[square.id];

            if (!type) return;

            if (type === "bandit") {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                playSound("bandit");

                if (state.values.result >= state.values.winningScore) {
                    endGame("VOCÊ VENCEU! Parabéns! 🏆");
                }

            } else if (type === "innocent") {
                state.values.lives--;
                updateLivesDisplay();
                playSound("innocent");

                if (state.values.lives <= 0) {
                    endGame("VOCÊ MORREU! O seu resultado foi: " + state.values.result);
                }
            }

            state.values.hitPositions[square.id] = null;
        });
    });
}

function endGame(message) {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
if (message.includes("VENCEU")) {
    document.getElementById("victory-sound").play();
}

else {
    document.getElementById("game-over-sound").play();
}

    alert(message);
}

function initialize() {
    addListenerHitBox();
    updateLivesDisplay();

    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}
