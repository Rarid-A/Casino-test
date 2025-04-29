(function () {
  let round = 0;
  let roundScore = 0;
  let totalScore = 0;
  let currentDice = [];
  let selectedDiceIndices = [];
  let usedDice = [];
  let roundRolls = 0;

  const roundDisplay = document.getElementById("round");
  const roundScoreDisplay = document.getElementById("round-score");
  const totalScoreDisplay = document.getElementById("total-score");
  const messageDisplay = document.getElementById("message");
  const diceArea = document.getElementById("dice-area");
  const newGameButton = document.getElementById("new-game");
  const rollDiceButton = document.getElementById("roll-dice");
  const cashOutButton = document.getElementById("cash-out");
  const balanceDisplay = document.getElementById("balance");

  function updateUI() {
    balanceDisplay.textContent = `Balance: ${accounts[currentUser].money} Gold`;
    roundDisplay.textContent = round;
    roundScoreDisplay.textContent = roundScore;
    totalScoreDisplay.textContent = totalScore;
  }

  function resetGame() {
    round = 0;
    roundScore = 0;
    totalScore = 0;
    roundRolls = 0;
    currentDice = [];
    selectedDiceIndices = [];
    usedDice = [];
    updateUI();
    messageDisplay.textContent = "";
    rollDiceButton.disabled = true;
    cashOutButton.disabled = true;
  }

  function startNewGame() {
    if (accounts[currentUser].money < 10) {
      messageDisplay.textContent = "Not enough gold to start a new game!";
      return;
    }
    accounts[currentUser].money -= 10;
    round = 1;
    roundScore = 0;
    roundRolls = 0;
    totalScore = 0;
    currentDice = [];
    selectedDiceIndices = [];
    usedDice = [];
    updateUI();
    messageDisplay.textContent = "Game started! Roll the dice.";
    rollDiceButton.disabled = false;
    cashOutButton.disabled = true;
    rollDice();
  }

  function rollDice() {
    if (selectedDiceIndices.length > 0) {
      const selectedValues = selectedDiceIndices.map(i => currentDice[i]);
      const score = calculateScore(selectedValues);
      if (score === 0) {
        messageDisplay.textContent = "Invalid dice selection!";
        return;
      }
      roundScore += score;
      usedDice.push(...selectedDiceIndices.map(i => currentDice[i]));
    }

    const diceToRoll = usedDice.length === 6 || usedDice.length === 0 ? 6 : 6 - usedDice.length;
    currentDice = Array.from({ length: diceToRoll }, () => Math.floor(Math.random() * 6) + 1);
    selectedDiceIndices = [];
    renderDice();
    const valid = getScoringIndices(currentDice);
    if (valid.length === 0) {
      messageDisplay.textContent = "Farkle! No scoring dice.";
      rollDiceButton.disabled = true;
      cashOutButton.disabled = true;
      return;
    }

    messageDisplay.textContent = "Select scoring dice to continue or cash out.";
    cashOutButton.disabled = roundScore < 300;
  }

  function renderDice() {
    diceArea.innerHTML = "";

    // Render used dice from previous rolls
    usedDice.forEach((value) => {
      const diceElement = document.createElement("div");
      diceElement.classList.add("dice", "used");
      diceElement.textContent = value;
      diceArea.appendChild(diceElement);
    });

    // Render current dice
    currentDice.forEach((value, index) => {
      const diceElement = document.createElement("div");
      diceElement.classList.add("dice");
      diceElement.textContent = value;

      if (getScoringIndices(currentDice).includes(index)) {
        diceElement.onclick = () => toggleDiceSelection(index);
      } else {
        diceElement.classList.add("disabled");
      }

      if (selectedDiceIndices.includes(index)) {
        diceElement.classList.add("selected");
      }

      diceArea.appendChild(diceElement);
    });
  }

  function toggleDiceSelection(index) {
    if (selectedDiceIndices.includes(index)) {
      selectedDiceIndices = selectedDiceIndices.filter(i => i !== index);
    } else {
      selectedDiceIndices.push(index);
    }

    const selectedValues = selectedDiceIndices.map(i => currentDice[i]);
    const score = calculateScore(selectedValues);

    // Update the round score by adding the score from selected dice to the previous round score
    roundScore = score + usedDice.reduce((acc, val) => acc + calculateScore([val]), 0);
    roundScoreDisplay.textContent = roundScore; // Update the UI for round score

    // Enable or disable the cash-out button based on the score
    cashOutButton.disabled = roundScore < 300;

    // Enable or disable the roll button based on dice selection
    rollDiceButton.disabled = selectedDiceIndices.length === 0;

    renderDice();
  }

  function cashOut() {
    if (roundScore < 300) {
        messageDisplay.textContent = "You need at least 300 points to cash out!";
        return;
    }

    totalScore += roundScore; // Add the current round score to the total score

    // Check for win condition
    if (totalScore >= 1500 || roundScore >= 1500) {
        accounts[currentUser].money += 50; // Add 50 gold for winning
        messageDisplay.textContent = "🎉 Congratulations! You won!";
        updateUI();
        resetGame(); // Reset the game after a win
        return;
    }

    updateUI(); // Ensure UI reflects the updated total score

    round++;
    roundScore = 0;
    usedDice = [];
    currentDice = [];
    selectedDiceIndices = [];

    if (round > 3) {
        endGame();
        return;
    }

    messageDisplay.textContent = `Points cashed out! Round ${round} begins.`;
    rollDiceButton.disabled = false;
    cashOutButton.disabled = true;
    rollDice();
}

  function endGame() {
    rollDiceButton.disabled = true;
    cashOutButton.disabled = true;

    // Check for win condition at the end of the game
    if (totalScore >= 1500 || roundScore >= 1500) {
      accounts[currentUser].money += 50; // Add 50 gold for winning
      messageDisplay.textContent = "🎉 Congratulations! You won!";
    } else {
      messageDisplay.textContent = "Game over. You didn't reach 1500 points.";
    }

    updateUI();
  }

  function calculateScore(diceArray) {
    const counts = {};
    diceArray.forEach(d => counts[d] = (counts[d] || 0) + 1);

    const values = Object.values(counts);
    const keys = Object.keys(counts).map(Number);

    // Straight
    if (keys.length === 6) return 1000;

    // Three Pairs
    if (values.filter(v => v === 2).length === 3) return 750;

    let score = 0;

    for (let i = 1; i <= 6; i++) {
      let count = counts[i] || 0;
      if (count >= 3) {
        score += (i === 1 ? 1000 : i * 100) * (count - 2);
        count -= 3;
      }
      if (i === 1 && count > 0) score += 100 * count;
      if (i === 5 && count > 0) score += 50 * count;
    }

    return score;
  }

  function getScoringIndices(diceArray) {
    const valid = [];
    for (let i = 0; i < diceArray.length; i++) {
      const testDice = [diceArray[i]];
      if (calculateScore(testDice) > 0) valid.push(i);
    }

    // Check for 3+ of a kind
    const counts = {};
    diceArray.forEach(d => counts[d] = (counts[d] || []).concat([]));
    diceArray.forEach((d, i) => {
      if (!counts[d]) counts[d] = [];
      counts[d].push(i);
    });

    for (const val in counts) {
      const indices = counts[val];
      if (indices.length >= 3) {
        valid.push(...indices);
      }
    }

    // Check for straight or three pairs (only valid if using all dice)
    if (diceArray.length === 6) {
      const unique = [...new Set(diceArray)];
      const sorted = [...unique].sort((a, b) => a - b);
      if (sorted.join("") === "123456") {
        return [0, 1, 2, 3, 4, 5];
      }
      const pairCount = Object.values(counts).filter(g => g.length === 2).length;
      if (pairCount === 3) {
        return [0, 1, 2, 3, 4, 5];
      }
    }

    return [...new Set(valid)];
  }

  newGameButton.onclick = startNewGame;
  rollDiceButton.onclick = rollDice;
  cashOutButton.onclick = cashOut;

  resetGame();
})();
