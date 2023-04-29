const readline = require('readline-sync');

const MATCH_COUNT = 5;
let WINNING_NUMBER = 21;
let NUM_DEALER_HITS_TO = 17;
const SUITS = ['H', 'D', 'S', 'C'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function prompt(message) {
  console.log(`=> ${message}`);
}

// shuffle an array
function shuffle(array) {
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
      deck.push([suit, value]);
    }
  }

  return shuffle(deck);
}

function total(cards) {
  // cards = [['H', '3'], ['S', 'Q'], ... ]
  let values = cards.map((card) => card[1]);

  let sum = 0;
  values.forEach((value) => {
    if (value === 'A') {
      sum += 11;
    } else if (['J', 'Q', 'K'].includes(value)) {
      sum += 10;
    } else {
      sum += Number(value);
    }
  });

  // correct for Aces
  values.filter((value) => value === 'A').forEach((_) => {
    if (sum > 21) sum -= 10;
  });

  return sum;
}

function busted(total) {
  return total > 21;
}

function detectWinner(dealerTotal, playerTotal) {
  if (playerTotal > WINNING_NUMBER) {
    return 'player busted';
  } else if (dealerTotal > WINNING_NUMBER) {
    return 'dealer busted';
  } else if (dealerTotal < playerTotal) {
    return 'player';
  } else if (dealerTotal > playerTotal) {
    return 'dealer';
  } else {
    return 'tie';
  }
}

function displayResults(dealerTotal, playerTotal) {
  let result = detectResult(dealerTotal, playerTotal);

  switch (result) {
    case 'player busted':
      prompt('You busted! Dealer won the round!');
      break;
    case 'dealer busted':
      prompt('Dealer busted! You won the round!');
      break;
    case 'player':
      prompt('You won the round!');
      break;
    case 'dealer':
      prompt('Dealer won the round!');
      break;
    case 'tie':
      prompt("The round was a tie!");
  }
}

function displayComparisons(dealerCards, dealerTot, playerCards, playerTot) {
  console.log('==============');
  prompt(`Dealer has ${dealerCards}, for a total of: ${dealerTot}`);
  prompt(`Player has ${playerCards}, for a total of: ${playerTot}`);
  console.log('==============');
}

function playAgain() {
  const validInputs = ['y', 'n'];
  let answer;
  console.log('-------------');
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

function hand(cards) {
  return cards.map(card => `${card[1]}${card[0]}`).join(' ');
}

function updateScoreboard(scores, winner) {
  if (winner === 'PLAYER_BUSTED' || winner === 'DEALER') {
    winner = 'dealer';
  } else if (winner === 'DEALER_BUSTED' || winner === 'PLAYER') {
    winner = 'player';
  } else {
    winner = null;
  }

  if (winner) {
    scores[winner] += 1;
  }

  return undefined;
}

function displayScore(scores, scoreboardTitle) {
  prompt(`${scoreboardTitle}`);
  for (const player in scores) {
    prompt(`${player} - ${scores[player]}`);
  }
  console.log(''); // print empty line
}

function detectWinnerOfMatch(scores) {
  if (scores.player > scores.dealer) {
    return 'Player';
  } else if (scores.player < scores.dealer) {
    return 'Dealer';
  }
  return 'Tie';
}

function detectMajorityGamesWon(scores) {
  const majority = Math.ceil(MATCH_COUNT / 2);
  return (scores.player === majority) || (scores.dealer === majority);
}

// Pauses game execution for better game flow and readability
function freezeGame() {
  readline.question('Press any key to continue to next round');
}

function playersTurn(deck, playerCards, playerTotal) {
  while (true) {
    let playerTurn;
    while (true) {
      console.log(''); // print empty line
      prompt('Would you like to (h)it or (s)tay?');
      playerTurn = readline.question().toLowerCase();
      if (['h', 's', 'hit', 'stay'].includes(playerTurn)) break;
      prompt('Sorry, that is not valid input.');
    }

    if (['h', 'hit'].includes(playerTurn)) {
      playerCards.push(deck.pop());
      prompt('You chose to hit!');
      prompt(`Your cards are now: ${hand(playerCards)}`);
      playerTotal = total(playerCards);
      prompt(`Your total is now: ${playerTotal}`);
    }

    if (['s', 'stay'].includes(playerTurn) || busted(playerTotal)) break;
  }
  return playerTotal;
}

function dealersTurn(deck, dealerCards, dealerTotal) {
  console.log(''); // print empty line
  prompt('Dealer turn...');

  while (dealerTotal < NUM_DEALER_HITS_TO) {
    prompt('Dealer hits!');
    dealerCards.push(deck.pop());
    prompt(`Dealer's cards are now: ${hand(dealerCards)}`);
    dealerTotal = total(dealerCards);
  }
  return dealerTotal;
}

function displayWinner(winner) {
  console.log('');
  if (winner === 'Tie') {
    prompt('The match was a tie. Good work!');
  } else {
    prompt(`${winner} won the match!`);
  }
  console.log('');
  return undefined;
}

function getCardValue(card) {
  if (card in CARD_VALUE_WORDS) {
    card = CARD_VALUE_WORDS[card];
    return card;
  }
  return card;
}


while (true) {
  prompt('Welcome to Twenty-One!');
  const scores = {
    player: 0,
    dealer: 0,
  };
  let roundCount = 1;
  while (roundCount <= MATCH_COUNT) {
  
      if (detectMajorityGamesWon(scores)) break;
      console.log('');
      prompt(`Current round: ${roundCount} / 5`);
      console.log(''); // print empty line
      displayScore(scores, 'CURRENT SCOREBOARD');
      // declare and initialize vars
      

      prompt(`Dealer has ${dealerCards[0]} and ?`);
      prompt(`You have: ${playerCards[0]} and ${playerCards[1]}, for a total of ${total(playerCards)}.`);

      let dealerTotal = total(dealerCards);
      let playerTotal = total(playerCards);

      // player turn
      playerTotal = playersTurn(deck, playerCards, playerTotal);
      player_bust = mfunc(playerTotal, ...);
      if player_bust:
        if (roundCount > MATCH_COUNT) break;
        if (roundCount < MATCH_COUNT) {
          console.log('');
          freezeGame();
        }

      dealerTotal = dealersTurn(deck, dealerCards, dealerTotal);
      dealer_bust = mfunc(dealerTotal, ...);\
      if dealer_bust:
        if (roundCount > MATCH_COUNT) break;
        if (roundCount < MATCH_COUNT) {
          console.log('');
          freezeGame();
        }


      if (busted(playerTotal)) {
        displayComparisons(dealerCards, dealerTotal, playerCards, playerTotal);
        displayResults(dealerTotal, playerTotal);
        roundCount += 1;
        let winner = detectResult(dealerTotal, playerTotal);
        updateScoreboard(scores, winner);
        if (roundCount > MATCH_COUNT) break;
        if (roundCount < MATCH_COUNT) {
          console.log('');
          freezeGame();
        }
        continue;
      } else {
        prompt(`You stayed at ${playerTotal}`);
      }

      // dealer turn
      dealerTotal = dealersTurn(deck, dealerCards, dealerTotal);

      if (busted(dealerTotal)) {
        dealerTotal = total(dealerCards);
        prompt(`Dealer total is now: ${dealerTotal}`);
        displayComparisons(dealerCards, dealerTotal, playerCards, playerTotal);
        displayResults(dealerTotal, playerTotal);
        roundCount += 1;
        let winner = detectResult(dealerTotal, playerTotal);
        updateScoreboard(scores, winner);
        if (roundCount > MATCH_COUNT) break;
        if (roundCount < MATCH_COUNT) {
          console.log('');
          freezeGame();
        }
        continue;
      } else {
        prompt(`Dealer stays at ${dealerTotal}`);
      }

      // both player and dealer stays - compare cards!
      displayComparisons(dealerCards, dealerTotal, playerCards, playerTotal);
      displayResults(dealerTotal, playerTotal);
      let winner = detectResult(dealerTotal, playerTotal);
      updateScoreboard(scores, winner);

      if (roundCount < MATCH_COUNT) {
        console.log('');
        freezeGame();
      }
      break;
    
    roundCount += 1;
  }
  let winnerOfMatch = detectWinnerOfMatch(scores);
  displayWinner(winnerOfMatch);
  displayScore(scores, 'FINAL SCOREBOARD');
  if (playAgain() === 'n') {
    break;
  } else {
    console.clear();
  }
}
prompt('Thanks for playing Twenty One!');



while (true) {
  if a == b {
    // do something
    continue
  }
  // do something else 
}

while (true) {
  if a == b {
    // do something
  } else {
      // do something else 
  }
  //
}