const readline = require('readline-sync');
// Symbolic constants
const INITIAL_MARKER = ' ';
const HUMAN_MARKER = 'X';
const COMPUTER_MARKER = 'O';


function displayBoard(board) {
  console.clear();

  console.log(`You are ${HUMAN_MARKER}. Computer is ${COMPUTER_MARKER}.`)
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


function initializeBoard() {
  let board = {};
  for (let square = 1; square <= 9; square += 1) {
    board[String(square)] = INITIAL_MARKER;
  }
  return board;
}


function prompt(msg) {
  console.log(`=> ${msg}`);
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
  let winningLines = [
    [1, 2, 3], [ 4, 5, 6], [7, 8, 9], // rows
    [1, 4, 7], [2, 5, 8], [3, 6, 9],  // columns
    [1, 5, 9], [3, 5, 7]              // diagonal
  ];

  // We use a for loop here since we may need to return from the function before the end of the loop
  for (let line = 0; line < winningLines.length; line++) {
    let [ sq1, sq2, sq3 ] = winningLines[line];

    if (
      board[sq1] === HUMAN_MARKER &&
      board[sq2] === HUMAN_MARKER &&
      board[sq3] === HUMAN_MARKER 
    ) {
      return 'Player';
    } else if (
      board[sq1] === COMPUTER_MARKER &&
      board[sq2] === COMPUTER_MARKER &&
      board[sq3] === COMPUTER_MARKER 
    ) {
      return 'Computer';
    }
  }

  return null;
}


function playerChoosesSquare(board) {
  let square;

  while (true) {
    prompt(`Choose a square: ${joinOr(emptySquares(board))}`);
    square = readline.question().trim(); // trim to take away spaces from user input

    if (emptySquares(board).includes(square)) break;

    prompt("That's not a valid choice.");
  }
  board[square] = HUMAN_MARKER;
}


function joinOr(arr, delimiter = ", ", joinWord = "or") {
  if (arr.length === 0) return "";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} ${joinWord} ${arr[1]}`;

  let joinedStr = "";

  while (arr.length > 1) {
    joinedStr += arr[0] + delimiter;
    arr.shift();
  }

  return `${joinedStr}${joinWord} ${arr[0]}`;
}


function computerChoosesSquare(board) {
  
  let randomIndex = Math.floor(Math.random() * emptySquares(board).length);
  let square = emptySquares(board)[randomIndex];

  board[square] = COMPUTER_MARKER;
}


while (true) {
  let board = initializeBoard();
  while (true) {
    displayBoard(board);

    playerChoosesSquare(board);
    if (someoneWon(board) || boardFull(board)) break;

    computerChoosesSquare(board);
    if (someoneWon(board) || boardFull(board)) break;
  }

  displayBoard(board);

  if (someoneWon(board)) {
    prompt(`${detectWinner(board)} won!`);
  } else {
    prompt("It's a tie!");
  }

  prompt('Would you like to play again? y/n');
  let answer = readline.question().toLowerCase()[0];
  if (answer !== 'y') break;
}

prompt('Thanks for playing Tic Tac Toe!');