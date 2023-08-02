// Constants to represent the players (player, AI)
const PLAYER = 'X';
const AI = 'O';

// Scores
let playerScore = 0;
let aiScore = 0;

// The board representation
let board = ['', '', '', '', '', '', '', '', ''];

// Function to handle the player's move
function handlePlayerMove(index) {
    // Check if the cell is empty and the game is not over
    if (board[index] === '' && !isGameOver(board)) {
        board[index] = PLAYER;
        // Update the UI to show the player's move
        document.getElementById(index).innerText = PLAYER;
        // Check for game over after the player's move
        if (!isGameOver(board)) {
            // AI makes its move after a short delay to give the illusion of "thinking"
            setTimeout(() => {
                handleAIMove();
            }, 500);
        }
        else if (isGameOver(board)) {
            showEndGamePopup();
        }
    }
}

function isGameOver(board) {
    // Check for win conditions
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return the symbol of the winner (either 'X' or 'O')
        }
    }

    // Check if the board is full (draw scenario)
    if (board.every(cell => cell !== '')) {
        return 'draw';
    }

    return false; // Return false if the game is not over
}


// Function to handle the AI's move using the minimax algorithm
function handleAIMove() {
    // Check if the game is over before AI's move
    if (isGameOver(board)) {
        showEndGamePopup();
    }

    // Set a very low score as the initial best score
    let bestScore = -Infinity;
    let bestMove;

    // Loop through all available moves
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            // If the move is available, make the move for the AI
            board[i] = AI;

            // Calculate the score for this move using the minimax algorithm
            const score = minimax(board, 0, false);

            // Undo the move
            board[i] = '';

            // If the calculated score is greater than the current best score, update the best score and best move
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    // Make the best move for the AI
    board[bestMove] = AI;
    document.getElementById(bestMove).innerText = AI;

    // Check for game over after the AI's move
    if (!isGameOver(board)) {
        // If the game is not over, allow the player to make their move
        enablePlayerMove();
    } else {
        showEndGamePopup();
    }
}

// Minimax algorithm with alpha-beta pruning and depth parameter
function minimax(board, depth, isMaximizing) {
    if (isGameOver(board)) {
        if (isMaximizing) {
            return -10 + depth;
        } else {
            return 10 - depth;
        }
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = AI;
                const score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = PLAYER;
                const score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}

// Function to get empty cells on the board
function emptyCells(board) {
    return board.reduce((acc, curr, index) => (curr === '' ? acc.concat(index) : acc), []);
}

// Function to enable player's move
function enablePlayerMove() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => cell.addEventListener('click', () => handlePlayerMove(index)));
}

// Function to disable player's move
function disablePlayerMove() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.removeEventListener('click', handlePlayerMove));
}

// Function to update the scoreboard
function updateScoreboard() {
    document.getElementById('player').innerText = playerScore;
    document.getElementById('robot').innerText = aiScore;
}

// Function to restart the game
function restartGame() {
    // Reset the board and UI
    board = ['', '', '', '', '', '', '', '', ''];
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => (cell.innerText = ''));
    hideEndGamePopup();
    enablePlayerMove();
}

// Function to start the game
function startGame() {
    // Reset the board and UI
    board = ['', '', '', '', '', '', '', '', ''];
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => (cell.innerText = ''));
    hideEndGamePopup();
    enablePlayerMove();
}



function showEndGamePopup() {
    const endgamePopup = document.querySelector('.endgame');
    const endgameText = document.querySelector('.endgame .text');

    // Check if the game is over before showing the endgame pop-up
    const result = isGameOver(board);

    if (result) {
        if (result === 'X') {
            // Player wins
            endgameText.innerText = "Player wins!";
            playerScore++;
        } else if (result === 'O') {
            // AI wins
            endgameText.innerText = "Robot wins!";
            aiScore++;
        } else {
            // It's a draw
            endgameText.innerText = "It's a draw!";
        }
        // Update the scoreboard
        updateScoreboard();
    }

    // Show the endgame pop-up with a small delay
    endgamePopup.style.display = 'flex';
    disablePlayerMove(); // Disable player's move after the game ends
}


// Function to hide the endgame pop-up
function hideEndGamePopup() {
    const endgamePopup = document.querySelector('.endgame');
    endgamePopup.style.display = 'none';
}

// Add event listener for the restart button
document.getElementById('btnRestart').addEventListener('click', restartGame);

// Function to reset the scores
function resetScores() {
    playerScore = 0;
    aiScore = 0;
    updateScoreboard();
}

// Add event listener for the reset scores button
document.getElementById('btnResetScores').addEventListener('click', resetScores);

// Add event listener for the toggle dark mode button
document.getElementById('theme-switch').addEventListener('click', toggleDarkMode);

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');
    
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        darkModeStylesheet.disabled = true;
    } else {
        body.classList.add('dark-mode');
        darkModeStylesheet.disabled = false;
    }
}


// Start the game
startGame();
