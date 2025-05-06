// Blackjack game variables
let playerHand = [];
let dealerHand = [];
let deck = [];
let betAmount = 0;
let gameOver = false; // Track if the game is over
let isPlayerStanding = false; // Track if the player has chosen to stand

// Function to initialize a new game
function startBlackjack() {
  const betAmount = 10; // Fixed bet amount

  if (accounts[currentUser].money < betAmount) {
    alert("Not enough gold to play! Minimum bet is 10 Gold.");
    return;
  }

  accounts[currentUser].money -= betAmount; // Deduct the fixed bet amount
  updateBalanceDisplay();

  playerHand = [];
  dealerHand = [];
  deck = createDeck();
  shuffleDeck(deck);

  // Deal initial cards
  playerHand.push(drawCard());
  playerHand.push(drawCard());
  dealerHand.push(drawCard());
  dealerHand.push(drawCard());

  gameOver = false; // Reset game over state
  isPlayerStanding = false; // Reset player standing state
  updateBlackjackTable();
  checkGameStatus();
}

// Function to create a deck of cards
function createDeck() {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

// Function to shuffle the deck
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Function to draw a card from the deck
function drawCard() {
  return deck.pop();
}

// Function to calculate the score of a hand
function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  for (const card of hand) {
    if (['jack', 'queen', 'king'].includes(card.value)) {
      score += 10;
    } else if (card.value === 'ace') {
      aces += 1;
      score += 11;
    } else {
      score += parseInt(card.value);
    }
  }

  // Adjust for aces if score exceeds 21
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
}

// Function to update the Blackjack table
function updateBlackjackTable() {
  const playerTable = document.getElementById('blackjack-table');
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  const hideDealerCard = !gameOver && !isPlayerStanding; // Hide dealer's first card unless game is over or player stands

  playerTable.innerHTML = `
    <div class="blackjack-row">
      <div class="blackjack-hand">
        <h3>Dealer's Hand</h3>
        <div class="cards">
          ${formatHand(dealerHand, hideDealerCard)}
        </div>
        <p>Score: ${hideDealerCard ? '?' : dealerScore}</p>
      </div>
    </div>
    <div class="blackjack-row">
      <div class="blackjack-hand">
        <h3>Player's Hand</h3>
        <div class="cards">
          ${formatHand(playerHand)}
        </div>
        <p>Score: ${playerScore}</p>
      </div>
    </div>
    <div class="blackjack-actions">
      <button id="hit-button" onclick="hit()" ${gameOver ? 'disabled' : ''}>Hit</button>
      <button id="stand-button" onclick="stand()" ${gameOver ? 'disabled' : ''}>Stand</button>
    </div>
  `;
}

// Function to format a hand for display
function formatHand(hand, hideDealerCard = false) {
  return hand
    .map((card, index) => {
      if (hideDealerCard && index === 0) {
        return `<div class="card back"></div>`;
      }
      const suitSymbols = {
        hearts: '♥',
        diamonds: '♦',
        clubs: '♣',
        spades: '♠'
      };
      return `<div class="card ${card.suit}">${card.value.toUpperCase()} ${suitSymbols[card.suit]}</div>`;
    })
    .join('');
}

// Function for the player to hit (draw a card)
function hit() {
  if (gameOver) return;

  playerHand.push(drawCard());
  updateBlackjackTable();
  checkGameStatus();
}

// Function for the player to stand (end their turn)
function stand() {
  if (gameOver) return;

  isPlayerStanding = true; // Player has chosen to stand
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }
  updateBlackjackTable();
  checkGameStatus(true);
}

// Function to check the game status
function checkGameStatus(isStand = false) {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore > 21) {
    gameOver = true;
    endGame('Player busts! Dealer wins.');
  } else if (dealerScore > 21) {
    gameOver = true;
    endGame('Dealer busts! Player wins.', true);
  } else if (isStand) {
    gameOver = true;
    if (playerScore > dealerScore) {
      endGame('Player wins!', true);
    } else if (playerScore < dealerScore) {
      endGame('Dealer wins.');
    } else {
      endGame('It\'s a tie!', true);
    }
  }

  // Disable buttons if the game is over
  if (gameOver) {
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
  }
}

// Function to end the game
function endGame(message, playerWins = false) {
  const result = document.getElementById('blackjack-result');
  result.textContent = message;

  if (playerWins) {
    const winnings = 20; // Fixed winnings amount
    accounts[currentUser].money += winnings;
    updateBalanceDisplay();
    result.textContent += ` You win ${winnings} Gold!`;
  }

  const playerTable = document.getElementById('blackjack-table');
  playerTable.innerHTML += `
    <div class="blackjack-end">
      <p>${message}</p>
      <button onclick="startBlackjack()">Play Again</button>
    </div>
  `;
}