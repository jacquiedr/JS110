const readline = require('readline-sync');

const STARTING_HAND = 2;
const CARDS = [
  // Hearts
  ['H', 'A'], ['H', '2'], ['H', '3'], ['H', '4'], ['H', '5'], ['H', '6'], 
  ['H', '7'], ['H', '8'], ['H', '9'], ['H', '10'], ['H', 'J'], ['H', 'Q'], 
  ['H', 'K'],
  // Diamonds
  ['D', 'A'], ['D', '2'], ['D', '3'], ['D', '4'], ['D', '5'], ['D', '6'], 
  ['D', '7'], ['D', '8'], ['D', '9'], ['D', '10'], ['D', 'J'], ['D', 'Q'],
  ['D', 'K'],
  // Clubs
  ['C', 'A'], ['C', '2'], ['C', '3'], ['C', '4'], ['C', '5'], ['C', '6'], 
  ['C', '7'], ['C', '8'], ['C', '9'], ['C', '10'], ['C', 'J'], ['C', 'Q'],
  ['C', 'K'],
  // Spades
  ['S', 'A'], ['S', '2'], ['S', '3'], ['S', '4'], ['S', '5'], ['S', '6'], 
  ['S', '7'], ['S', '8'], ['S', '9'], ['S', '10'], ['S', 'J'], ['S', 'Q'],
  ['S', 'K']
];
  const CARD_VALUE_WORDS = {
    A: 'Ace',
    J: 'Jack',
    Q: 'Queen',
    K: 'King'
  };

function prompt(message) {
  console.log(`=> ${message}`);
}

function dealCard(cards) {
  cards = shuffle(cards);
  let card = cards.pop();
  return card;
}

function shuffle(array) {
  for (let index = array.length - 1; index > 0; index--) {
    let otherIndex = Math.floor(Math.random() * (index + 1)); // 0 to index
    [array[index], array[otherIndex]] = [array[otherIndex], array[index]]; // swap elements
  }

  return array;
}

function playerTurn(hand) {
  while (true) {
    if (busted(hand)) break;
    prompt("Hit or stay?");
    let answer = readline.question().toLowerCase();
    if (answer === 'stay') break;
    hand.push(dealCard(CARDS));
    prompt(`You have: ${getDisplayFormatPlayerHand(hand)}`);
  }
  
  if (busted(hand)) {
    return 1;
  } else {
    prompt("You chose to stay!");  // if player didn't bust, must have stayed to get here
  }
  return null;
}

function dealerTurn(hand) {
  // hit until the total is at least 17. 
  let sumOfHand = total(hand);

  while (sumOfHand < 17) {
    hand.push(dealCard(CARDS));
    prompt(`Dealer has: ${getCardValue(hand[0][1])} and unknown card`);
    if (busted(hand)) break;
  }

  while (true) {
    if (busted(hand)) break;
    prompt("Hit or stay?");
    let answer = readline.question().toLowerCase();
    if (answer === 'stay') break;
    hand.push(dealCard(CARDS));
    prompt(`Dealer has: ${getCardValue(hand[0][1])} and unknown card`);
  }
  
  if (busted(hand)) {
    return 1;
  } else {
    prompt("You chose to stay!");  // if player didn't bust, must have stayed to get here
  }
  return null;
}

function busted(hand) {
  let sumOfHand = total(hand);
  return sumOfHand > 21;
}

function total(cards) {
  let values = cards.map(card => card[1]);

  let sum = 0;
  values.forEach(value => {
    if (value === "A") {
      sum += 11;
    } else if (['J', 'Q', 'K'].includes(value)) {
      sum += 10;
    } else {
      sum += Number(value);
    }
  });

  // correct for Aces
  values.filter(value => value === "A").forEach(_ => {
    if (sum > 21) sum -= 10;
  });

  return sum;
}

function getDisplayFormatPlayerHand(hand) {
  // Get value from each card and turn into array
  let cardValues = hand.map(subArr => subArr[1]).map(value => {
    if (value in CARD_VALUE_WORDS) {
      value = CARD_VALUE_WORDS[value];
      return value;
    } else {
      return value;
    }
  });

  switch(cardValues.length) {
    case 2:
      return `${cardValues[0]} and ${cardValues[1]}`;
    default:
      let cardsUpToLast = cardValues.slice(0, cardValues.length - 1);
      let lastCard = cardValues.pop();
      return `${cardsUpToLast.join(', ')}, and ${lastCard}`;
  }
}

function getCardValue(card) {
  if (card in CARD_VALUE_WORDS) {
    card = CARD_VALUE_WORDS[card];
    return card;
  }
  return card;
}

function compareHands(playersHand, dealersHand) {
  let playerTotal = total(playersHand);
  let dealerTotal = total(dealersHand);

  // Check if player busted
  if (playerTotal > 21 && dealerTotal < 21) {
    return 'dealer';
  } else if (playerTotal < 21 && dealerTotal > 21) {
    return 'player';
  }

  // Calculate different
  let diff1 = Math.abs(21 - playerTotal);
  let diff2 = Math.abs(21 - dealerTotal);

  if (diff1 < diff2) {
    return 'player';
  } else if (diff1 < diff2) {
    return 'dealer';
  } else {
    return 'tie';
  }
}

function displayResult(winner, playersHand, dealersHand) {
  let playerTotal = total(playersHand);
  let dealerTotal = total(dealersHand);
  if (winner === 'player') {
    prompt(`Player won the game with a hand worth ${playerTotal}. The dealer lost with a hand worth ${dealerTotal}.`);
  } else if (winner === 'dealer') {
    prompt(`Dealer won the game with a hand worth ${dealerTotal}. The player lost with a hand worth ${playerTotal}.`);
  } else {
    prompt(`The game was a tie. Both the player and dealer's hand was worth ${dealerTotal}.`);
  }
}

function continuePlaying() {
  let validInputs = ["y", "n"];
  let answer;
  prompt("Would you like to play again?");
  while (true) {
    answer = readline.question().trim().toLowerCase();
    if (validInputs.includes(answer)) break;
    prompt("That's not valid input!");
  }
  return answer;
}


// Main game loop
while (true) {
  console.clear();
  // Initialize empty arrays to represents players hands
  let playersHand = [];
  let dealersHand = [];

  // Deal 2 cards to each player
  while(playersHand.length < STARTING_HAND) {
    playersHand.push(dealCard(CARDS));
  }

  while(dealersHand.length < STARTING_HAND) {
    dealersHand.push(dealCard(CARDS));
  }

  // Show half of dealers hand and players full hand
  prompt(`Dealer has: ${getCardValue(dealersHand[0][1])} and unknown card`)
  prompt(`You have: ${getDisplayFormatPlayerHand(playersHand)}`);
  
  // Player's turn
  console.log("");
  prompt("It's the player's turn.");
  let busted = playerTurn(playersHand);
  if (busted) {
    console.log("");
    prompt("Your hand went over 21. That's a bust!");
    let winner = compareHands(playersHand, dealersHand);
    displayResult(winner, playersHand, dealersHand);
    console.log("");
    let answer = continuePlaying();
    if (answer === 'n') break;
  }

  // Dealer's turn
  console.log("");
  prompt("It's the dealer's turn.");
  busted = dealerTurn(dealersHand);
  if (busted) {
    console.log("");
    prompt("Dealer's hand went over 21. That's a bust!");
    let winner = compareHands(playersHand, dealersHand);
    displayResult(winner, playersHand, dealersHand);
    console.log("");
    let answer = continuePlaying();
    if (answer === 'n') break;
  }

  let winner = compareHands(playersHand, dealersHand);
  displayResult(winner, playersHand, dealersHand);

  // Ask if player wants to play again (if game has not busted)
  if (!busted) {
    let answer = continuePlaying();
    if (answer === 'n') break;
  }
}

prompt("Thanks for playing Twenty One!");