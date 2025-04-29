let balance = accounts[currentUser].money; // Use the account's balance
let currentScore = 0;
let totalScore = 0;
let rollsLeft = 3;
let keptDice = [];
let diceValues = [];
let gameActive = false;
let totalPoints = 0; // Tally for all hands

document.getElementById("balance").innerText = `Balance: ${balance} Gold`;

function rollDice() {
  if (!gameActive) {
    if (balance < 10) {
      alert("Not enough balance to play!");
      return;
    }
    balance -= 10; // Deduct cost only for the first roll
    accounts[currentUser].money = balance; // Update account balance
    document.getElementById("balance").innerText = `Balance: ${balance} Gold`;
    diceValues = Array(6).fill(null); // Initialize dice values
    gameActive = true;
  }

  if (rollsLeft <= 0) {
    alert("No rolls left! Cash out or start a new game.");
    return;
  }

  diceValues = diceValues.map((value, index) =>
    keptDice.includes(index) ? value : Math.floor(Math.random() * 6) + 1
  );

  rollsLeft--;
  calculateScore(); // Recalculate the score after rolling
  checkForWin(); // Check if the player has won
  updateDiceDisplay();
}

function toggleDice(index) {
  if (!gameActive || rollsLeft === 3) {
    alert("You must roll the dice first!");
    return;
  }

  if (keptDice.includes(index)) {
    keptDice = keptDice.filter((i) => i !== index);
  } else if (!diceValues[index]) {
    alert("You cannot keep an unrolled dice!");
  } else {
    keptDice.push(index);
  }

  updateDiceDisplay();
}

function cashOut() {
  if (!gameActive) {
    alert("You must start a game first!");
    return;
  }

  if (currentScore < 300) {
    alert("You need at least 300 points to cash out!");
    return;
  }

  totalScore += currentScore;
  totalPoints += currentScore; // Add to the total points tally

  if (totalPoints >= 1200) {
    alert("Congratulations! You won the game and earned 50 Gold!");
    balance += 50;
    accounts[currentUser].money = balance; // Update account balance
    resetGame(true); // Reset everything after winning
  } else {
    alert(`You cashed out with ${currentScore} points!`);
  }

  document.getElementById("balance").innerText = `Balance: ${balance} Gold`;
  resetGame();
}

function checkForWin() {
  if (!gameActive) return;

  if (totalPoints + currentScore >= 1200) {
    alert("Congratulations! You instantly won the game and earned 50 Gold!");
    balance += 50;
    accounts[currentUser].money = balance; // Update account balance
    document.getElementById("balance").innerText = `Balance: ${balance} Gold`;
    resetGame(true); // Reset everything after winning
  }
}

function resetGame(fullReset = false) {
  if (!gameActive && !fullReset) return;

  if (currentScore < 300 && !fullReset) {
    alert("You scored under 300 points! You lose the 10 Gold deposit.");
    gameActive = false;
    return;
  }

  currentScore = 0;
  rollsLeft = 3;
  keptDice = [];
  diceValues = Array(6).fill(null); // Reset dice values to null
  gameActive = false;

  if (fullReset) {
    totalScore = 0;
    totalPoints = 0;
  }

  updateDiceDisplay(); // Ensure dice are displayed correctly
}

function updateDiceDisplay() {
  const diceArea = document.getElementById("dice-area");
  diceArea.innerHTML = "";

  diceValues.forEach((value, index) => {
    const dice = document.createElement("div");
    dice.className = "dice";
    dice.innerText = value !== null ? value : "-"; // Show "-" for unrolled dice
    dice.style.backgroundColor = keptDice.includes(index) ? "red" : "white";
    dice.style.color = "black";
    dice.onclick = () => toggleDice(index);
    diceArea.appendChild(dice);
  });

  document.getElementById("farkle-score").innerText = `Score: ${currentScore}`;
  document.getElementById("farkle-rolls").innerText = `Rolls Left: ${rollsLeft}`;
  document.getElementById("farkle-total").innerText = `Total Points: ${totalPoints}`;
}

function calculateScore() {
  if (!gameActive) return;

  const counts = Array(6).fill(0); // Array to count occurrences of each dice value (1-6)

  diceValues.forEach((value) => {
    if (value) counts[value - 1]++;
  });

  let score = 0;

  // Check for one of each dice (1, 2, 3, 4, 5, 6)
  if (counts.every((count) => count >= 1)) {
    score += 750;
    alert("You rolled one of each dice! You earned 750 points and can roll again.");
    rollsLeft++; // Allow an extra roll
  }

  // Scoring for three or more of the same number
  for (let i = 0; i < 6; i++) {
    if (counts[i] >= 3) {
      const baseScore = (i + 1) * 100;
      score += baseScore; // Add base score for three of a kind

      if (counts[i] === 4) {
        score += baseScore; // Double the 3x value for four of a kind
      } else if (counts[i] === 5) {
        score += baseScore * 2; // Add 3x value + 2x value for five of a kind
      } else if (counts[i] === 6) {
        score += baseScore * 3; // Add 3x value + 3x value for six of a kind
      }

      counts[i] = 0; // Reset the count for this number
    }
  }

  // Scoring for individual 1s and 5s
  score += counts[0] * 100; // Remaining 1s
  score += counts[4] * 50;  // Remaining 5s

  currentScore = score;

  // Check if no scoring is possible
  if (currentScore === 0) {
    alert("No scoring is possible with this dice throw. You lose the 10 Gold deposit!");
    resetGame(); // Reset the game
    return;
  }

  document.getElementById("farkle-score").innerText = `Score: ${currentScore}`;
}

// Initialize the game UI
resetGame();