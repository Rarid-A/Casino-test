function initializeSlots() {
    console.log("Slots tab initialized");
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