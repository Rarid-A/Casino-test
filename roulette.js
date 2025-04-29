function initializeRoulette() {
    console.log("Roulette tab initialized");
  }

// Generate the roulette board
function createRouletteBoard() {
    const board = document.getElementById('roulette-board');
    const numbers = [
      { number: 0, color: 'green' },
      { number: 1, color: 'red' },
      { number: 2, color: 'black' },
      { number: 3, color: 'red' },
      { number: 4, color: 'black' },
      { number: 5, color: 'red' },
      { number: 6, color: 'black' },
      { number: 7, color: 'red' },
      { number: 8, color: 'black' },
      { number: 9, color: 'red' },
      { number: 10, color: 'black' },
      { number: 11, color: 'black' },
      { number: 12, color: 'red' },
      { number: 13, color: 'black' },
      { number: 14, color: 'red' },
      { number: 15, color: 'black' },
      { number: 16, color: 'red' },
      { number: 17, color: 'black' },
      { number: 18, color: 'red' },
      { number: 19, color: 'red' },
      { number: 20, color: 'black' },
      { number: 21, color: 'red' },
      { number: 22, color: 'black' },
      { number: 23, color: 'red' },
      { number: 24, color: 'black' },
      { number: 25, color: 'red' },
      { number: 26, color: 'black' },
      { number: 27, color: 'red' },
      { number: 28, color: 'black' },
      { number: 29, color: 'black' },
      { number: 30, color: 'red' },
      { number: 31, color: 'black' },
      { number: 32, color: 'red' },
      { number: 33, color: 'black' },
      { number: 34, color: 'red' },
    ];
  
    numbers.forEach((item) => {
      const cell = document.createElement('div');
      cell.textContent = item.number;
      cell.style.width = '50px';
      cell.style.height = '50px';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.backgroundColor = item.color;
      cell.style.color = 'white';
      cell.style.margin = '2px';
      cell.style.borderRadius = '5px';
      board.appendChild(cell);
    });
  }
  
  // Handle roulette spin
  function placeRouletteBet(event) {
    event.preventDefault();
  
    const betType = document.getElementById('bet-type').value;
    const resultElement = document.getElementById('roulette-result');
  
    if (accounts[currentUser].money < 10) {
      resultElement.textContent = 'Not enough gold to place a bet!';
      return;
    }
  
    accounts[currentUser].money -= 10; // Deduct bet amount
    updateBalanceDisplay();
  
    const spinResult = Math.floor(Math.random() * 35); // Random number between 0 and 34
    const colors = [
      'green',
      'red',
      'black',
      'red',
      'black',
      'red',
      'black',
      'red',
      'black',
      'red',
      'black',
      'black',
      'red',
      'black',
      'red',
      'black',
      'red',
      'black',
      'red',
      'red',
      'black',
      'red',
      'black',
      'red',
      'black',
      'red',
      'black',
      'red',
      'black',
      'black',
      'red',
      'black',
      'red',
      'black',
      'red',
    ];
  
    const spinColor = colors[spinResult];
    let winnings = 0;
  
    // Add animation
    const board = document.getElementById('roulette-board');
    const cells = board.children;
    let currentIndex = 0;
    const spinDuration = 3000; // 3 seconds
    const intervalTime = 50; // Time between cell highlights
  
    // Clear all previous highlights
    Array.from(cells).forEach((cell) => {
      cell.style.border = 'none';
    });
  
    const interval = setInterval(() => {
      // Remove highlight from the previous cell
      if (currentIndex > 0) {
        cells[(currentIndex - 1) % cells.length].style.border = 'none';
      } else {
        cells[cells.length - 1].style.border = 'none';
      }
  
      // Highlight the current cell
      cells[currentIndex % cells.length].style.border = '2px solid yellow';
  
      currentIndex++;
    }, intervalTime);
  
    // Stop the animation after the spin duration
    setTimeout(() => {
      clearInterval(interval);
  
      // Clear all highlights again to ensure no lingering borders
      Array.from(cells).forEach((cell) => {
        cell.style.border = 'none';
      });
  
      // Highlight the final result
      cells[spinResult].style.border = '4px solid gold';
  
      // Determine winnings
      if (betType === spinColor) {
        winnings = betType === 'green' ? 140 : 20; // Green pays 14:1, others pay 2:1
        accounts[currentUser].money += winnings;
        resultElement.textContent = `🎉 The ball landed on ${spinResult} (${spinColor}). You win ${winnings} Gold! 🎉`;
      } else {
        resultElement.textContent = `The ball landed on ${spinResult} (${spinColor}). You lose!`;
      }
  
      updateBalanceDisplay();
    }, spinDuration);
  }
  
  // Initialize the roulette board on page load
  document.addEventListener('DOMContentLoaded', createRouletteBoard);