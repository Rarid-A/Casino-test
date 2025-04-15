// List of slot symbols
const symbols = ["🍒", "🍋", "🍉", "⭐", "🍇", "🔔", "🍊", "💰"];

// Multipliers for winning combinations
const multipliers = {
	"🍒": 2,
	"🍋": 3,
	"🍉": 4,
	"⭐": 5,
	"💰": 10
};

// Track the current Y position of each reel
let currentYPositions = [0, 0, 0];
let balance = 100; // Starting balance
let currentBet = 0.6; // Default bet amount

// Function to generate a random symbol
function getRandomSymbol() {
	return symbols[Math.floor(Math.random() * symbols.length)];
}

// Function to initialize the reels with random symbols
function initializeReels() {
	const reels = document.querySelectorAll(".icon-container");
	reels.forEach((reel) => {
		const initialSymbol = getRandomSymbol();
		reel.innerHTML = `<div>${initialSymbol}</div>`;
	});
}

// Function to update the balance display
function updateBalanceDisplay() {
	const balanceElement = document.getElementById("balance");
	balanceElement.textContent = balance.toFixed(2);
}

function setBet(amount) {
	currentBet = amount; // Update the current bet
	const betDisplay = document.getElementById("current-bet");
	betDisplay.textContent = amount.toFixed(2); // Display the current bet

	// Dynamically update the winning combinations table
	updateWinningExamples(amount);
}

function calculateWinnings(symbols, betAmount) {
	const uniqueSymbols = Array.from(new Set(symbols));

	// Jackpot: All symbols match (💰)
	if (uniqueSymbols.length === 1 && uniqueSymbols[0] === "💰") {
		return betAmount * 50; // Special multiplier for jackpot
	}

	// Full Match: All symbols match (general case)
	if (uniqueSymbols.length === 1) {
		const symbol = symbols[0];
		return betAmount * (multipliers[symbol] || 1);
	}

	// Partial Match: 2 out of 3 symbols match
	if (uniqueSymbols.length === 2) {
		const repeatedSymbol = symbols.find(
			(symbol) => symbols.filter((s) => s === symbol).length === 2
		);
		if (repeatedSymbol) {
			return betAmount * ((multipliers[repeatedSymbol] || 1) / 2);
		}
	}

	return 0; // No winnings for unmatched symbols
}

// Reset balance
function resetMoney() {
	balance = 100;
	updateBalanceDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
	const resetButton = document.getElementById("reset-button");
	resetButton.addEventListener("click", resetMoney);
});

let isTyping = false; // Flag to track if typing is in progress

function typewriterEffect(element, text, baseSpeed = 100, callback = null) {
	if (isTyping) return; // Prevent new typing effect while one is in progress
	isTyping = true;

	const spinButton = document.querySelector(".spin-button");
	element.textContent = ""; // Clear the element's text
	let index = 0;

	const dynamicSpeed = text.length > 20 ? baseSpeed : baseSpeed / 2;

	spinButton.disabled = true;

	function type() {
		if (index < text.length) {
			element.textContent += text[index];
			index++;
			setTimeout(type, dynamicSpeed);
		} else {
			spinButton.disabled = false;
			isTyping = false; // Reset typing flag
			if (callback) callback();
		}
	}

	type();
}

// Spin functionality
function spin() {
	const reels = document.querySelectorAll(".icon-container");
	const result = document.getElementById("result");
	const spinButton = document.querySelector(".spin-button");
	const buttons = document.querySelectorAll("button");

	if (currentBet <= 0 || currentBet > balance) {
		typewriterEffect(result, "Invalid bet! Select a valid amount.");
		return;
	}

	balance -= currentBet;
	updateBalanceDisplay();
	typewriterEffect(result, "Spinning...", 100);

	buttons.forEach((button) => (button.disabled = true));
	gsap.to(spinButton, {
		scale: 1.1,
		duration: 0.4,
		yoyo: true,
		repeat: -1,
		ease: "power1.inOut"
	});

	reels.forEach((reel, index) => {
		const randomSymbols = Array.from({ length: 20 }, () => getRandomSymbol());
		const finalSymbol = getRandomSymbol();
		const totalHeight = randomSymbols.length * 100;
		const finalPosition = currentYPositions[index] - totalHeight - 100;

		reel.innerHTML += randomSymbols
			.map((symbol) => `<div>${symbol}</div>`)
			.join("");
		reel.innerHTML += `<div>${finalSymbol}</div>`;

		gsap.fromTo(
			reel,
			{ y: currentYPositions[index] },
			{
				y: finalPosition,
				duration: 2 + index * 0.2,
				ease: "power2.inOut",
				onComplete: () => {
					reel.innerHTML = `<div>${finalSymbol}</div>`;
					reel.style.transform = "translateY(0)";
					currentYPositions[index] = 0;
				}
			}
		);

		currentYPositions[index] = finalPosition;
	});

	setTimeout(() => {
		const finalSymbols = Array.from(reels).map((reel) => reel.textContent.trim());
		const winnings = calculateWinnings(finalSymbols, currentBet);

		if (winnings > 0) {
			balance += winnings;
			typewriterEffect(
				result,
				`🎉 You Win $${winnings.toFixed(2)}! 🎉`,
				100,
				() => {
					buttons.forEach((button) => (button.disabled = false));
					updateBalanceDisplay();
				}
			);
		} else {
			typewriterEffect(result, "Try Again!", 50, () => {
				buttons.forEach((button) => (button.disabled = false));
				updateBalanceDisplay();
			});
		}

		gsap.killTweensOf(spinButton);
		gsap.to(spinButton, { scale: 1, duration: 0.2 });
	}, 3000);
}

// Update the theme toggle function to include the toast
function toggleTheme() {
	const body = document.body;
	const themeIcon = document.getElementById("theme-icon");

	// Rotate the theme icon using GSAP for added animation
	gsap.fromTo(
		themeIcon,
		{ rotate: 0 },
		{ rotate: 360, duration: 0.5, ease: "power2.inOut" }
	);

	// Toggle between dark and light themes
	if (body.classList.contains("dark-theme")) {
		body.classList.remove("dark-theme");
		body.classList.add("light-theme");
		themeIcon.classList.replace("fa-moon", "fa-sun"); // Change icon
	} else {
		body.classList.remove("light-theme");
		body.classList.add("dark-theme");
		themeIcon.classList.replace("fa-sun", "fa-moon"); // Change icon
	}

	// Save the selected theme in localStorage
	localStorage.setItem(
		"theme",
		body.classList.contains("dark-theme") ? "dark" : "light"
	);
}

// Attach the event listener
document.addEventListener("DOMContentLoaded", () => {
	document.querySelector(".theme-toggle").addEventListener("click", toggleTheme);
});

function updateWinningExamples(currentBet) {
	if (typeof currentBet !== "number" || isNaN(currentBet)) {
		console.error("Invalid currentBet value:", currentBet);
		return;
	}

	document.getElementById("max-bet-display").textContent = currentBet.toFixed(2);

	document.getElementById("cherry-winnings").textContent = `$${(
		currentBet * 2
	).toFixed(2)} (full), $${(currentBet * 1).toFixed(2)} (partial)`;
	document.getElementById("lemon-winnings").textContent = `$${(
		currentBet * 3
	).toFixed(2)} (full), $${(currentBet * 1.5).toFixed(2)} (partial)`;
	document.getElementById("watermelon-winnings").textContent = `$${(
		currentBet * 4
	).toFixed(2)} (full), $${(currentBet * 2).toFixed(2)} (partial)`;
	document.getElementById("star-winnings").textContent = `$${(
		currentBet * 5
	).toFixed(2)} (full), $${(currentBet * 2.5).toFixed(2)} (partial)`;
	document.getElementById("jackpot-winnings").textContent = `$${(
		currentBet * 50
	).toFixed(2)} (jackpot)`;
}

document.addEventListener("DOMContentLoaded", () => {
	const helpButton = document.getElementById("help");
	const helpModal = new bootstrap.Modal(document.getElementById("helpModal"));

	helpButton.addEventListener("click", () => {
		console.log("clicked");
		helpModal.show();
	});
});

// Call the function to update the table when the page loads
document.addEventListener("DOMContentLoaded", () => {
	initializeReels(); // Existing function
	updateBalanceDisplay(); // Existing function
	setBet(0.6); // Default bet amount
	updateWinningExamples(currentBet); // Update the table based on the current bet
});

function showToast(message) {
	console.log("test"); // Should log "function"

	const toastContainer = document.getElementById("toast-container");

	if (!toastContainer) {
		console.error("Toast container not found in the DOM.");
		return;
	}

	console.log("Displaying toast message:", message);

	// Create the toast element
	const toast = document.createElement("div");
	toast.className = "toast align-items-center text-bg-dark border-0";
	toast.setAttribute("role", "alert");
	toast.setAttribute("aria-live", "assertive");
	toast.setAttribute("aria-atomic", "true");

	toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

	toastContainer.appendChild(toast);

	try {
		const bootstrapToast = new bootstrap.Toast(toast);
		bootstrapToast.show();

		toast.addEventListener("hidden.bs.toast", () => {
			toast.remove();
		});
	} catch (err) {
		console.error("Bootstrap Toast initialization failed:", err);
	}
}

// Ensure DOMContentLoaded event has triggered before calling showToast
document.addEventListener("DOMContentLoaded", () => {
	if (!localStorage.getItem("themeToastShown")) {
		showToast("Use the theme button in the corner to switch themes!");
		localStorage.setItem("themeToastShown", "true");
	}
});

var tooltipTriggerList = [].slice.call(
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Initialization
document.addEventListener("DOMContentLoaded", () => {
	document.querySelector(".spin-button").addEventListener("click", spin);
	document.querySelector(".theme-toggle").addEventListener("click", toggleTheme);

	const body = document.body;
	const savedTheme = localStorage.getItem("theme") || "light";
	body.classList.add(savedTheme === "dark" ? "dark-theme" : "light-theme");
	document
		.getElementById("theme-icon")
		.classList.add(savedTheme === "dark" ? "fa-moon" : "fa-sun");

	initializeReels();
	updateBalanceDisplay();
	setBet(0.6);
});
