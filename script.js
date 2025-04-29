const accounts = {
  test1: { password: 'test1', money: 750 },
};

let currentUser = "test1"; // Default account set to test1

function updateBalanceDisplay() {
  const balanceElement = document.getElementById('balance');
  balanceElement.textContent = `Balance: ${accounts[currentUser].money} Gold`;
}

function openTab(evt, tabName) {
  const tabcontent = document.querySelectorAll('.tabcontent');
  const tablinks = document.querySelectorAll('.tablink');

  tabcontent.forEach((content) => (content.style.display = 'none'));
  tablinks.forEach((tab) => tab.classList.remove('active'));

  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.classList.add('active');

  // Initialize tab-specific logic
  if (tabName === 'slots') {
    initializeSlots();
  } else if (tabName === 'roulette') {
    initializeRoulette();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateBalanceDisplay();
});
