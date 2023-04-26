const readline = require('readline-sync');

const INITIAL_MARKER = ' ';
const HUMAN_MARKER = 'X';
const COMPUTER_MARKER = 'O';
const COMP_2_MARKER = '#';
const NUMBER_OF_SQUARES = 25;
const MATCH_ROUND_COUNT = 3;
const WINNING_LINES = [
  // Rows
  [1, 2, 3], [2, 3, 4], [3, 4, 5], [ 6, 7, 8], [7, 8, 9], [8, 9, 10],
  [10, 11, 12], [12, 13, 14], [13, 14, 15], [16, 17, 18], [17, 18, 19],
  [18, 19, 20], [21, 22, 23], [22, 23, 24], [23, 24, 25],
  // Columns
  [1, 6, 11], [6, 11, 16], [11, 16, 21], [2, 7, 12], [7, 12, 17], [12, 17, 22],
  [3, 8, 13], [8, 13, 18], [13, 18, 23], [4, 9, 14], [9, 14, 19], [14, 19, 24],
  [5, 10, 15], [10, 15, 20], [15, 20, 25],
  // Diagonal
  [1, 7, 13], [2, 8, 14], [3, 7, 11], [3, 9, 15], [4, 8, 12], [5, 9, 13],
  [6, 12, 18], [7, 13, 19], [8, 12, 16], [8, 14, 20], [9, 13, 17], [10, 14, 18],
  [11, 17, 23], [12, 18, 24], [13, 17, 21], [13, 19, 25], [14, 18, 22],
  [15, 19, 23],
];
const CORNERS = [1, 5, 21, 25];
const CENTER_OF_BOARD = 13;
const PLAYERS = ['player', 'computer 1', 'computer 2'];

function displayBoard(board) {
  console.clear();

  console.log(`You are ${HUMAN_MARKER}. Computer 1 is ${COMPUTER_MARKER}. Computer 2 is ${COMP_2_MARKER}.`);

  console.log('');
  console.log('     |     |     |     |');
  console.log(`  ${board['1']}  |  ${board['2']}  |  ${board['3']}  |  ${board['4']}  |  ${board['5']}`);
  console.log('     |     |     |     |');
  console.log('-----+-----+-----+-----+-----');
  console.log('     |     |     |     |');
  console.log(`  ${board['6']}  |  ${board['7']}  |  ${board['8']}  |  ${board['9']}  |  ${board['10']}`);
  console.log('     |     |     |     |');
  console.log('-----+-----+-----+-----+-----');
  console.log('     |     |     |     |');
  console.log(`  ${board['11']}  |  ${board['12']}  |  ${board['13']}  |  ${board['14']}  |  ${board['15']}`);
  console.log('     |     |     |     |');
  console.log('-----+-----+-----+-----+-----');
  console.log('     |     |     |     |');
  console.log(`  ${board['16']}  |  ${board['17']}  |  ${board['18']}  |  ${board['19']}  |  ${board['20']}`);
  console.log('     |     |     |     |');
  console.log('-----+-----+-----+-----+-----');
  console.log('     |     |     |     |');
  console.log(`  ${board['21']}  |  ${board['22']}  |  ${board['23']}  |  ${board['24']}  |  ${board['25']}`);
  console.log('     |     |     |     |');
  console.log('');
}

function initializeBoard() {
  const board = {};
  for (let square = 1; square <= NUMBER_OF_SQUARES; square += 1) {
    board[String(square)] = INITIAL_MARKER;
  }
  return board;
}

function prompt(msg) {
  console.log(`=> ${msg}`);
}

function emptySquares(board) {
  return Object.keys(board).filter((key) => board[key] === INITIAL_MARKER);
}

function boardFull(board) {
  return emptySquares(board).length === 0;
}

function displayScore(scores, scoreboardTitle) {
  prompt(`${scoreboardTitle}`);
  for (const player in scores) {
    prompt(`${player} - ${scores[player]}`);
  }
  console.log(''); // print empty line
}

function displayOverallWinner(scores) {
  let playerScore = scores['Player'];
  let comp1Score = scores['Computer 1'];
  let comp2Score = scores['Computer 2'];

  if ((playerScore > comp1Score) && (playerScore > comp2Score)) {
    prompt('Player won the match! Congratulations.');
  } else if ((comp1Score > comp2Score) && (comp1Score > playerScore)) {
    prompt('Computer 1 won the match! Good game.');
  } else if ((comp2Score > comp1Score) && (comp2Score > playerScore)) {
    prompt('Computer 2 won the match! Better luck next time, Player and Computer 1.');
  } else if ((playerScore === comp1Score) && (playerScore > comp2Score)) {
    prompt('Player and Computer 1 reigned champions! Great game.');
  } else if ((playerScore === comp2Score) && (playerScore > comp1Score)) {
    prompt('Player and Computer 2 are the winner! Great game.');
  } else if ((comp1Score === comp2Score) && (comp1Score > playerScore)) {
    prompt('Player and Computer 1 reigned champions! Great game.');
  } else {
    prompt('The match was a tie! Three strong contenders indeed.');
  }
}

function detectWinner(board) {
  for (let line = 0; line < WINNING_LINES.length; line += 1) {
    const [sq1, sq2, sq3] = WINNING_LINES[line];

    if ( board[sq1] === HUMAN_MARKER && board[sq2] === HUMAN_MARKER
      && board[sq3] === HUMAN_MARKER) {
      return 'Player';
    } else if (
      board[sq1] === COMPUTER_MARKER && board[sq2] === COMPUTER_MARKER
      && board[sq3] === COMPUTER_MARKER) {
      return 'Computer 1';
    } else if ( board[sq1] === COMP_2_MARKER
      && board[sq2] === COMP_2_MARKER && board[sq3] === COMP_2_MARKER) {
      return 'Computer 2';
    }
  }

  return null;
}

function someoneWon(board) {
  return !!detectWinner(board);
}

function detectMajorityGamesWon(scores) {
  const majority = Math.ceil(MATCH_ROUND_COUNT / 2);
  return (scores['Player'] === majority) || (scores['Computer 1'] === majority)
    || (scores['Computer 2'] === majority);
}

function incrementWinnerPoints(scores, winner) {
  if (winner) {
    scores[winner] += 1;
  }
  return undefined;
}

function joinOr(arr, delimiter = ', ', word = 'or') {
  switch (arr.length) {
    case 0:
      return '';
    case 1:
      return `${arr[0]}`;
    case 2:
      return arr.join(` ${word} `);
    default:
      return arr.slice(0, arr.length - 1).join(delimiter) +
             `${delimiter}${word} ${arr[arr.length - 1]}`;
  }
}

function playerChoosesSquare(board) {
  if (someoneWon(board)) {
    return 0;
  }

  let square;

  while (true) {
    prompt(`Choose a square: ${joinOr(emptySquares(board))}`);
    square = readline.question().trim();

    if (emptySquares(board).includes(square)) break;

    prompt("That's not a valid choice.");
  }

  board[square] = HUMAN_MARKER;
  return undefined;
}

function computerOffense(board, rival1, rival2) {
  let square;
  for (let index = 0; index < WINNING_LINES.length; index += 1) {
    const line = WINNING_LINES[index];
    square = findAtRiskSquare(line, board, rival1, rival2);
    if (square) break;
  }

  return square;
}

function computerDefense(board, rival1, rival2) {
  let square;
  for (let index = 0; index < WINNING_LINES.length; index += 1) {
    const line = WINNING_LINES[index];
    square = findAtRiskSquare(line, board, rival1, rival2);
    if (square) break;
  }

  return square;
}

function checkCenterOfBoardAvail(board) {
  let square;
  if (board[CENTER_OF_BOARD] === INITIAL_MARKER) {
    square = CENTER_OF_BOARD;
  } else {
    square = null;
  }
  return square;
}

function checkBoardCornersAvail(board) {
  let square;
  for (let index = 0; index < CORNERS.length; index += 1) {
    const line = CORNERS[index];
    if (board[line] === INITIAL_MARKER) {
      square = CORNERS[index];
      break;
    } else {
      square = null;
    }
  }
  return square;
}

function getSquareAtRandomIndex(board) {
  const randomIndex = Math.floor(Math.random() * emptySquares(board).length);
  let square = emptySquares(board)[randomIndex];
  return square;
}

function computerChoosesSquare(board, marker, rival1, rival2) {
  if (someoneWon(board)) {
    return 0;
  }

  let square = computerOffense(board, rival1, rival2);

  if (!square) {
    square = computerDefense(board, rival1, rival2);
  }

  if (!square) {
    square = checkCenterOfBoardAvail(board);
  }

  if (!square) {
    square = checkBoardCornersAvail(board);
  }

  if (!square) {
    square = getSquareAtRandomIndex(board);
  }

  board[square] = marker;
  return undefined;
}

function findAtRiskSquare(line, board, marker1, marker2) {
  const markersInLine = line.map((square) => board[square]);

  if (markersInLine.filter((val) => val === marker1).length === 2) {
    const emptySquare = line.find((square) => board[square] === INITIAL_MARKER);
    if (emptySquare !== undefined) {
      return emptySquare;
    }
  } else if (markersInLine.filter((val) => val === marker2).length === 2) {
    const emptySquare = line.find((square) => board[square] === INITIAL_MARKER);
    if (emptySquare !== undefined) {
      return emptySquare;
    }
  }
  return null;
}

function chooseSquare(board, currentPlayer, scores) {
  if (currentPlayer === 'player') {
    return playerChoosesSquare(board, scores);
  } else if (currentPlayer === 'computer 1') {
    return computerChoosesSquare(board, COMPUTER_MARKER,
      HUMAN_MARKER, COMP_2_MARKER);
  } else if (currentPlayer === 'computer 2') {
    return computerChoosesSquare(board, COMP_2_MARKER,
      HUMAN_MARKER, COMPUTER_MARKER);
  }
  return undefined;
}

function alternatePlayer(currentPlayer) {
  if (currentPlayer === 'player') {
    return 'computer 1';
  } else if (currentPlayer === 'computer 1') {
    return 'computer 2';
  } else if (currentPlayer === 'computer 2') {
    return 'player';
  }
  return undefined;
}

function resetBoard(board) {
  for (const key in board) {
    board[key] = INITIAL_MARKER;
  }
}

// Ask player to choose the player who will make the first move
function pickFirstMovePlayer() {
  let answer;

  prompt('Choose who makes the first move: Player or Computer 1 or Computer 2.');

  while (true) {
    answer = readline.question().trim().toLowerCase();
    if (PLAYERS.includes(answer)) break;
    prompt("That's not a valid choice.");
  }

  return answer;
}

// Ask player if they wish to continue playing
function continuePlaying() {
  const validInputs = ['y', 'n'];
  let answer;
  prompt('Would you like to play again? y/n');
  while (true) {
    answer = readline.question().toLowerCase();
    if (validInputs.includes(answer)) break;
    prompt("That's not a valid choice.");
  }
  return answer;
}

// Main game loop
while (true) {
  const board = initializeBoard();
  const scores = {
    'Player': 0,
    'Computer 1': 0,
    'Computer 2': 0,
  };

  console.clear();
  prompt('Welcome to Tic Tac Toe! Today, you (Player) are playing against Two Computers. Get 4 squares in a row to win. Best of 3! Good luck!');
  let firstMovePlayer = pickFirstMovePlayer();
  let roundCount = 1;

  while (roundCount <= MATCH_ROUND_COUNT) {
    while (true) {
      displayBoard(board);
      prompt(`Current round: ${roundCount} / 3`);
      console.log(''); // print empty line
      displayScore(scores, 'CURRENT SCOREBOARD');

      chooseSquare(board, firstMovePlayer, scores);
      firstMovePlayer = alternatePlayer(firstMovePlayer);
      if (someoneWon(board) || boardFull(board)) {
        const winner = detectWinner(board);
        incrementWinnerPoints(scores, winner);
        resetBoard(board);
        break;
      }

      if (detectMajorityGamesWon(scores)) break;

      displayBoard(board);
    }

    roundCount += 1;
  }
  console.clear(''); // print empty line
  roundCount = 1;
  prompt('And that\'s the game!');
  console.log(''); // print empty line

  displayScore(scores, 'FINAL SCOREBOARD');
  displayOverallWinner(scores);
  console.log(''); // print empty line

  const answer = continuePlaying();
  if (answer === 'n') break;
}

prompt('Thanks for playing Tic Tac Toe!');
