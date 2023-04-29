const readline = require('readline-sync');

const ROUNDS_IN_MATCH = 5;
let WINNING_NUMBER = 21;
let NUM_DEALER_HITS_TO = 17;
const SUITS = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

function prompt(message) {
  console.log(`=> ${message}`);
}

function gameGreeting() {
  prompt('Welcome to Twenty-One!');
}

function displayRules() {
  console.log('');
  console.log('---------------- RULES ----------------');
  prompt('In this game, you are the Player and you are going against the Dealer.');
  prompt('The goal is to get as close to 21 as possible, without going over 21.');
  prompt('If the player or dealer\'s hand goes over 21, it\'s a bust, and an immediate loss.');
  prompt('Both players start with 2 cards. You can see your own deck, and one card from the dealer\'s deck.');
  prompt('Player goes first, you can choose to "hit" (get dealt another card which goes towards your hand\'s total).');
  prompt(`Or you can choose to "stay" (keep your current hand's total). The game is best of ${ROUNDS_IN_MATCH} rounds.`);
  console.log('');
}

function displayCurrentRound(roundCount) {
  console.log('');
  prompt(`---------- Round ${roundCount} / ${ROUNDS_IN_MATCH} ----------`);
}

function shuffleDeck(array) {
  for (let first = array.length - 1; first > 0; first--) {
    let second = Math.floor(Math.random() * (first + 1)); // random index from 0 to i
    [array[first], array[second]] = [array[second], array[first]]; // swap elements
  }

  return array;
}

function initalizeDeck() {
  let deck = [];

  for (let suitIndex = 0; suitIndex < SUITS.length; suitIndex++) {
    let suit = SUITS[suitIndex];

    for (let valueIndex = 0; valueIndex < VALUES.length; valueIndex++) {
      let value = VALUES[valueIndex];
      deck.push([value, suit]);
    }
  }

  return shuffleDeck(deck);
}

function dealInitialHand(deck, playerCards, dealerCards) {
  playerCards.push(...popTwoFromDeck(deck));
  dealerCards.push(...popTwoFromDeck(deck));
}

function calculateHandTotal(cards) {
  let values = cards.map((card) => card[0]);

  let sum = 0;
  values.forEach((value) => {
    if (value === 'Ace') {
      sum += 11;
    } else if (['Jack', 'Queen', 'King'].includes(value)) {
      sum += 10;
    } else {
      sum += Number(value);
    }
  });

  values.filter((value) => value === 'Ace').forEach((_) => {
    if (sum > WINNING_NUMBER) sum -= 10;
  });

  return sum;
}


function busted(total) {
  return total > 21;
}

function detectWinner(dealerTotal, playerTotal) {
  if (dealerTotal > WINNING_NUMBER) {
    return 'player';
  } else if (playerTotal > WINNING_NUMBER) {
    return 'dealer';
  } else if (dealerTotal < playerTotal) {
    return 'player';
  } else if (dealerTotal > playerTotal) {
    return 'dealer';
  } else {
    return 'tie';
  }
}

function displayWinnerOfRound(winner) {
  switch (winner) {
    case 'player':
      prompt('You won the round!');
      break;
    case 'dealer':
      prompt('Dealer won the round!');
      break;
    default:
      prompt("The round was a tie!");
  }
}

function detectWinnerOfMatch(scores) {
  if (scores.player > scores.dealer) {
    return 'Player';
  } else if (scores.player < scores.dealer) {
    return 'Dealer';
  }
  return 'Tie';
}

function printCards(cards) {
  const newArray = [...cards];
  if (typeof newArray[0] === 'string') {
    return newArray.join(' of ');
  }

  return newArray.map((card) => card.join(' of ')).join(', ');
}

function displayFinalScoreBoard(scores) {
  console.clear();
  prompt('----- FINAL SCOREBOARD -----');
  displayScore(scores);
}

function playAgain() {
  const validInputs = ['y', 'n'];
  let answer;
  console.log('--------------------------------');
  prompt('Would you like to play again? y/n');
  while (true) {
    answer = readline.question().toLowerCase();
    if (validInputs.includes(answer)) break;
    prompt("That's not a valid choice.");
  }

  return answer;
}

function popTwoFromDeck(deck) {
  return [deck.pop(), deck.pop()];
}

function updateScoreboard(scores, winner) {
  if (winner === 'player busted' || winner === 'dealer') {
    winner = 'dealer';
  } else if (winner === 'dealer busted' || winner === 'player') {
    winner = 'player';
  } else {
    winner = null;
  }

  if (winner) {
    scores[winner] += 1;
  }
}

function displayScore(scores) {
  prompt(`    Player - ${scores.player}    Dealer - ${scores.dealer}`);
  console.log('');
}


function detectMajorityGamesWon(scores) {
  const majority = Math.ceil(ROUNDS_IN_MATCH / 2);
  return (scores.player === majority) || (scores.dealer === majority);
}

// eslint-disable-next-line max-lines-per-function
function playersTurn(deck, playerCards, playerTotal) {
  let answer;
  while (true) {
    console.log('');
    prompt('PLAYER\'S TURN: Would you like to (h)it or (s)tay?');
    while (true) {
      answer = readline.question().toLowerCase();
      if (['h', 's', 'hit', 'stay'].includes(answer)) break;
      prompt('Sorry, that is not valid input.');
    }
    if (['h', 'hit'].includes(answer)) {
      playerCards.push(deck.pop());
      playerTotal = calculateHandTotal(playerCards);
      prompt('You chose to hit!');
      prompt(`Your cards are now [${printCards(playerCards)}] for a total of ${playerTotal}.`);
    }
    if (['stay', 's'].includes(answer) || busted(playerTotal)) break;
  }
  return playerTotal;
}

function dealersTurn(deck, dealerCards, dealerTotal) {
  prompt('DEALER\'S TURN...');

  while (true) {
    if (dealerTotal >= NUM_DEALER_HITS_TO) break;
    prompt('Dealer hits!');
    dealerCards.push(deck.pop());
    dealerTotal = calculateHandTotal(dealerCards);
  }
  prompt(`Dealer's reveals their cards... [${printCards(dealerCards)}] for a total of ${dealerTotal}.`);
  return dealerTotal;
}

function displayWinnerOfMatch(winner) {
  if (winner === 'Tie') {
    prompt('The match was a tie. Good work!');
  } else {
    prompt(`${winner} won the match!`);
  }
  console.log('');
}

function displayHands(playerCards, dealerCards) {
  prompt(`Dealer has [${printCards(dealerCards)[0]} and Unknown card].`);
  prompt(`You have [${printCards(playerCards)}] for a total of ${calculateHandTotal(playerCards)}.`);
}


function playRound(roundCount, scores) {
  let deck = initalizeDeck();
  let playerCards = [];
  let dealerCards = [];
  dealInitialHand(deck, playerCards, dealerCards);
  innerRoundLoop(deck, scores, playerCards, dealerCards);
  roundCount += 1;

  return roundCount;
}

function innerRoundLoop(deck,scores, playerCards, dealerCards) {
  let playerTotal = calculateHandTotal(playerCards);
  let dealerTotal = calculateHandTotal(dealerCards);
  displayHands(playerCards, dealerCards);
  playerTotal = playersTurn(deck, playerCards, playerTotal);
  if (busted(playerTotal)) {
    prompt('Player busted!');
  } else {
    console.log('');
    dealerTotal = dealersTurn(deck, dealerCards, dealerTotal);
    if (busted(dealerTotal)) {
      prompt('Dealer busted!');
    }
  }
  let winner = detectWinner(dealerTotal, playerTotal);
  displayWinnerOfRound(winner);
  updateScoreboard(scores, winner);
}

function endOfRound() {
  console.clear();
  readline.question('...And that\'s the game. Press \'enter\' to see the results');
}

// Main game loop
while (true) {
  console.clear();
  gameGreeting();
  displayRules();
  readline.question('\nPress \'enter\' to start the game');
  console.clear();
  const scores = {
    player: 0,
    dealer: 0,
  };

  let roundCount = 1;

  while (roundCount <= ROUNDS_IN_MATCH) {
    if (detectMajorityGamesWon(scores)) {
      endOfRound();
      break;
    }

    displayCurrentRound(roundCount);
    displayScore(scores);

    roundCount = playRound(roundCount, scores);
    if (roundCount > ROUNDS_IN_MATCH) {
      endOfRound();
      break;
    }
    readline.question('\nPress \'enter\' to continue to next round');
    console.clear();
  }
  let winner = detectWinnerOfMatch(scores);
  displayFinalScoreBoard(scores);
  displayWinnerOfMatch(winner);

  if (playAgain() === 'n') break;
}
prompt('Thanks for playing Twenty-one!');
