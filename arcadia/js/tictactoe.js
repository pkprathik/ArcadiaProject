const board = document.getElementById("board");
const statusText = document.getElementById("status");
const gamePopup = document.getElementById("gamePopup");
const gamePopupText = document.getElementById("gamePopupText");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

// Create board cells
function createBoard() {
    board.innerHTML = "";
    gameState.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.index = index;
        cellDiv.addEventListener("click", handleCellClick);
        board.appendChild(cellDiv);
    });
}

function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (gameState[index] !== "" || !gameActive) return;

    gameState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    checkResult();
}

function checkResult() {
    let roundWon = false;

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        openPopup("🎉 Player " + currentPlayer + " Wins!");
        return;
    }
    if (!gameState.includes("")) {
        gameActive = false;
        openPopup("Game Draw!");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    openPopup("Player X wins!");
}

function restartGame() {
    gamePopup.style.display = "none";
    currentPlayer = "X";
    gameActive = true;
    gameState = ["","","","","","","","",""];
    statusText.textContent = "Player X's turn";
    createBoard();
}

function openPopup(msg) {
    gamePopupText.innerText = msg;
    gamePopup.style.display = "flex";
}

// Initialize game
createBoard();