const accounts = {
  test1: { password: 'test1', money: 750 },
  test2: { password: 'test2', money: 750 },
};

let currentUser = null;

function login(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (accounts[username] && accounts[username].password === password) {
    currentUser = username;
    document.getElementById('login').style.display = 'none';
    document.getElementById('casino-content').style.display = 'block';
    updateBalanceDisplay();
  } else {
    const errorElement = document.getElementById('login-error');
    errorElement.style.display = 'block';
    setTimeout(() => (errorElement.style.display = 'none'), 3000);
  }
}

function openCreateAccountPopup() {
  document.getElementById('create-account-popup').style.display = 'block';
}

function closeCreateAccountPopup() {
  document.getElementById('create-account-popup').style.display = 'none';
}

function createAccount(event) {
  event.preventDefault();

  const username = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;
  const errorElement = document.getElementById('create-account-error');

  const isValid = /^[a-zA-Z0-9]{3,15}$/.test(username) && /^[a-zA-Z0-9]{3,15}$/.test(password);

  if (isValid) {
    if (accounts[username]) {
      errorElement.textContent = 'Username already exists.';
      errorElement.style.display = 'block';
      setTimeout(() => (errorElement.style.display = 'none'), 3000);
    } else {
      accounts[username] = { password, money: 500 };
      alert('Account created successfully!');
      closeCreateAccountPopup();
    }
  } else {
    errorElement.textContent = 'Invalid input. Use 3-15 letters/numbers.';
    errorElement.style.display = 'block';
    setTimeout(() => (errorElement.style.display = 'none'), 3000);
  }
}

function openTab(evt, tabName) {
  const tabcontent = document.querySelectorAll('.tabcontent');
  const tablinks = document.querySelectorAll('.tablink');

  tabcontent.forEach((content) => (content.style.display = 'none'));
  tablinks.forEach((tab) => tab.classList.remove('active'));

  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.classList.add('active');
}

function playSlots() {
  const symbols = ['🍒', '🍋', '🍊', '⭐', '💎'];
  const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
  const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
  const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

  const result = `${slot1} | ${slot2} | ${slot3}`;
  const message = slot1 === slot2 && slot2 === slot3 ? '🎉 Jackpot! You win! 🎉' : 'Try again!';

  alert(`${result}\n${message}`);
}

function updateBalanceDisplay() {
  const balanceElement = document.getElementById('balance');
  balanceElement.textContent = `Balance: ${accounts[currentUser].money} Gold`;
}

function spinSlots() {
  const symbols = ['🍒', '🍋', '🍊', '⭐', '💎'];
  const reel1 = document.getElementById('reel1');
  const reel2 = document.getElementById('reel2');
  const reel3 = document.getElementById('reel3');
  const resultElement = document.getElementById('slot-result');

  if (accounts[currentUser].money < 10) {
    resultElement.textContent = 'Not enough gold to spin!';
    return;
  }

  accounts[currentUser].money -= 10; // Deduct spin cost
  updateBalanceDisplay();

  let spinTimes = [0, 0, 0];
  const maxSpinTime = 2000;
  const intervalTime = 100;

  function spinReel(reel, index) {
    const interval = setInterval(() => {
      reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    }, intervalTime);

    setTimeout(() => {
      clearInterval(interval);
      reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      spinTimes[index] = 1;

      if (spinTimes.every((time) => time === 1)) {
        checkWin();
      }
    }, Math.random() * maxSpinTime);
  }

  function checkWin() {
    const slot1 = reel1.textContent;
    const slot2 = reel2.textContent;
    const slot3 = reel3.textContent;

    if (slot1 === slot2 && slot2 === slot3) {
      let winnings = 0;
      switch (slot1) {
        case '🍒':
          winnings = 50;
          break;
        case '🍋':
          winnings = 100;
          break;
        case '🍊':
          winnings = 200;
          break;
        case '⭐':
          winnings = 500;
          break;
        case '💎':
          winnings = 1000;
          break;
      }
      accounts[currentUser].money += winnings;
      resultElement.textContent = `🎉 Jackpot! You win ${winnings} Gold! 🎉`;
    } else {
      resultElement.textContent = 'Try again!';
    }
    updateBalanceDisplay();
  }

  spinReel(reel1, 0);
  spinReel(reel2, 1);
  spinReel(reel3, 2);
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

  if (betType === spinColor) {
    winnings = betType === 'green' ? 140 : 20; // Green pays 14:1, others pay 2:1
    accounts[currentUser].money += winnings;
    resultElement.textContent = `🎉 The ball landed on ${spinResult} (${spinColor}). You win ${winnings} Gold! 🎉`;
  } else {
    resultElement.textContent = `The ball landed on ${spinResult} (${spinColor}). You lose!`;
  }

  updateBalanceDisplay();
}

// Initialize the roulette board on page load
document.addEventListener('DOMContentLoaded', createRouletteBoard);
