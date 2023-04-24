const readline = require("readline-sync");

const INITIAL_MARKER = " ";
const HUMAN_MARKER = "X";
const COMPUTER_MARKER = "O";

const WINNING_LINES = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], //rows
  [1, 4, 7], [2, 5, 8], [3, 6, 9], //columns
  [1, 5, 9], [3, 5, 7] //diagonals
];

const INITIAL_PLAYER_SETTING = "choose";
const WINNING_SCORE = 5;

// Program Execution
greetPlayer();

startMatch();

prompt('Thanks for playing Tic Tac Toe!');

// Main Game Loop
function startMatch() {
  let roundNum = 0;
  let score = {
    player: 0,
    computer: 0
  };

  while (true) {
    roundNum += 1;

    displayRoundStart(roundNum, score);

    let currentPlayer = determineInitialPlayer();

    let roundWinner = executeRound(currentPlayer);

    incrementScore(roundWinner, score);

    let nextAction = determineMatchEnd(score);

    if (nextAction === "end game") break;

    if (nextAction === "start new match")  {
      roundNum = 0;
      //NOTE: Score reset is inside determineMatchEnd()
      continue;
    }
  }
}

function determineInitialPlayer() {
  let initialPlayer;

  if (INITIAL_PLAYER_SETTING === "choose") {
    initialPlayer = getInitialPlayerChoice();
  } else {
    initialPlayer = INITIAL_PLAYER_SETTING;
    freezeGame();
  }

  return initialPlayer;
}

function getInitialPlayerChoice() {
  let msg = "Who will play first?  ([P]layer or [C]omputer)";

  prompt(msg);

  let initialPlayer;

  const VALID_INPUT = ["p", "player", "c", "computer"];

  //Get user input and validation
  while (true) {
    initialPlayer = readline.question().toLowerCase();

    if (VALID_INPUT.includes(initialPlayer)) break;

    prompt("Invalid input...please try again");
  }

  if (initialPlayer === "p") {
    initialPlayer = "player";
  }

  if (initialPlayer === "c") {
    initialPlayer = "computer";
  }

  return initialPlayer;
}

function determineMatchEnd(score) {
  let matchWinner = checkMatchWinner(score);

  if (!matchWinner) {
    return "continue match";
  }

  displayMatchWinner(matchWinner);

  let playAgain = promptUserToPlayAgain();

  if (playAgain) {
    resetScore(score);
    return "start new match";
  } else {
    return "end game";
  }
}

function promptUserToPlayAgain() {
  const VALID_INPUT = ["y", "yes", "n", "no"];

  prompt("Play again? ([Y]es or [N]o");

  //Get user input and validation
  while (true) {
    let input = readline.question().toLowerCase();

    if (!VALID_INPUT.includes(input)) {
      prompt("Invalid input.  Please try again...");
      continue;
    }

   //Checks for n or no and returns false, returns true otherwise
    if (VALID_INPUT.includes(input, 2)) {
      return false;
    } else {
      return true;
    }
  }
}

// Game Logic / Round Gameplay Loop

function executeRound(currentPlayer) {
  let winner;

  let board = initializeBoard();

  while (true) {
    displayBoard(board);

    chooseSquare(board, currentPlayer);
    currentPlayer = alternatePlayer(currentPlayer);

    if (someoneWon(board) || boardFull(board))  break;
  }

  displayBoard(board);

  if (someoneWon(board)) {
    winner = detectWinner(board);
  } else {
    winner = "Tie";
  }

  displayRoundResult(winner);
  freezeGame();

  return winner;
}

function chooseSquare(board, currentPlayer) {
  if (currentPlayer === "player") {
    playerChoosesSquare(board);
  } else {
    computerChoosesSquare(board);
  }
}

function alternatePlayer(currentPlayer) {
  if (currentPlayer === "player") {
    currentPlayer = "computer";
  } else {
    currentPlayer = "player";
  }

  return currentPlayer;
}

function initializeBoard() {
  let board = {};

  for (let square = 1; square <= 9; square++) {
    board[String(square)] = INITIAL_MARKER;
  }

  return board;
}

function playerChoosesSquare(board) {
  let square;

  //Get user input and validation
  while (true) {
    prompt(`Choose a square (${joinOr(emptySquares(board))})`);
    square = readline.question().trim();

    if (emptySquares(board).includes(square)) break;

    prompt("Sorry, that's not a valid choice.");
  }

  board[square] = HUMAN_MARKER;
}

function computerChoosesSquare(board) {
  //Check if CPU should play Offense first
  let optimalOffensiveSq = detectIncompleteLine(board, "computer");

  if (optimalOffensiveSq) {
    board[optimalOffensiveSq] = COMPUTER_MARKER;
    return;
  }

  //Check if CPU should play Defense next
  let optimalDefensiveSq = detectIncompleteLine(board, "player");

  if (optimalDefensiveSq) {
    board[optimalDefensiveSq] = COMPUTER_MARKER;
    return;
  }

  //Check if Sq 5 is avail for CPU to play
  if (board["5"] === INITIAL_MARKER) {
    board["5"] = COMPUTER_MARKER;
    return;
  }

  //Choose random square if no other plays are available
  let randomIndex = Math.floor(Math.random() * emptySquares(board).length);
  console.log("random sq chosen");

  let square = emptySquares(board)[randomIndex];
  board[square] = COMPUTER_MARKER;
}


function emptySquares(board) {
  return Object.keys(board).filter(key => board[key] === INITIAL_MARKER);
}

function boardFull(board) {
  return emptySquares(board).length === 0;
}

function someoneWon(board) {
  return !!detectWinner(board);
}

function detectWinner(board) {
  for (let line = 0; line < WINNING_LINES.length; line++) {
    let [ sq1, sq2, sq3 ] = WINNING_LINES[line];

    if (
      board[sq1] === HUMAN_MARKER && board[sq2] === HUMAN_MARKER &&
        board[sq3] === HUMAN_MARKER
    ) {
      return 'Player';
    } else if (
      board[sq1] === COMPUTER_MARKER && board[sq2] === COMPUTER_MARKER &&
        board[sq3] === COMPUTER_MARKER
    ) {
      return 'Computer';
    }
  }

  return null;
}

//Checks if a winning line is filled with 2 of the same player markers
function detectIncompleteLine(board, player) {
  let marker;

  if (player === "player") {
    marker =  HUMAN_MARKER;
  } else {
    marker = COMPUTER_MARKER;
  }

  let missing3rdSq = null;

  let markerFilter = sq => board[sq] === marker;
  let initMarkerFilter = sq => board[sq] === INITIAL_MARKER;

  for (let line = 0; line < WINNING_LINES.length; line++) {

    let markerCount = WINNING_LINES[line].filter(markerFilter).length;
    let initMarkerCount = WINNING_LINES[line].filter(initMarkerFilter).length;

    if (markerCount === 2 && initMarkerCount === 1) {
      missing3rdSq = WINNING_LINES[line].filter(sq => board[sq] !== marker)[0];
      break;
    }
  }

  return missing3rdSq;
}

//Scoring and Determining Winner logic

function incrementScore(winner, score) {
  if (winner === "Player") {
    score.player += 1;
  } else if (winner === "Computer") {
    score.computer += 1;
  }
}

function resetScore(score) {
  score.player = 0;
  score.computer = 0;
}

function checkMatchWinner (score) {
  if (score.player === WINNING_SCORE) {
    return "Player";
  } else if (score.computer === WINNING_SCORE) {
    return "Computer";
  } else {
    return null;
  }
}

// Text Display Functions

function prompt(msg) {
  console.log(`=> ${msg}`);
}

function greetPlayer() {
  let msg1 = "Welcome to Tic Tac Toe!";
  let msg2 = "The first player to win 5 rounds wins!";
  prompt(`${msg1}\n\n${msg2}\n`);
}

function displayRoundStart(roundNum, score) {
  let roundMsg = `Round ${roundNum}`;
  let playerScore = `Player - ${score.player}`;
  let computerScore = `Computer - ${score.computer}`;
  let scoreMsg = `SCORE: ${playerScore}  | ${computerScore}`;

  prompt(`${roundMsg}\n\n${scoreMsg}\n`);
}

function displayRoundResult(winner) {
  if (winner === "Tie") {
    prompt("It's a tie!");
  } else {
    prompt(`${winner} has won the round.`);
  }
}

function displayMatchWinner(winner) {
  console.clear();

  let msg;

  if (winner === "Player") {
    msg = "Congratulations!!!";
  } else {
    msg = "Better luck next time...";
  }

  prompt(`${winner} has won 5 rounds and wins the match.  ${msg}`);
}

//Pauses game execution for better game flow and readability
function freezeGame() {
  readline.question("Press any key to continue");
}

function displayBoard(board) {
  console.log(`You are ${HUMAN_MARKER}. Computer is ${COMPUTER_MARKER}`);

  console.log('');
  console.log('     |     |');
  console.log(`  ${board['1']}  |  ${board['2']}  |  ${board['3']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['4']}  |  ${board['5']}  |  ${board['6']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['7']}  |  ${board['8']}  |  ${board['9']}`);
  console.log('     |     |');
  console.log('');
}

//Used to increase readability of Player's "choose a square" prompt
function joinOr(arr, delimiter = ",", joinWord = "or") {
  if (arr.length < 2) {
    return arr.join("");
  }

  if (arr.length === 2) {
    return `${arr[0]} ${joinWord} ${arr[1]}`;
  }

  let delimitedArr = arr.join(`${delimiter} `).split("");

  let idx = delimitedArr.length - 1;

  while (true) {
    if (delimitedArr[idx] === delimiter) break;
    idx -= 1;
  }

  delimitedArr[idx] = ` ${joinWord}`;

  return delimitedArr.join("");
}