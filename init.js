window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();
window.Telegram.WebApp.disableVerticalSwipes();
let highScores = [];

// Reset Game
// resetGame();

function getUserInfo() {
    const initData = window.Telegram.WebApp.initDataUnsafe;
    if (initData && initData.user) {
        const { first_name, last_name } = initData.user;

        // Log the user information for debugging
        console.log('User Info:', { first_name, last_name });

        // Return the user information
        return { first_name, last_name };
    } else {
        console.warn('User information is not available.');
        return { first_name: 'Unknown', last_name: 'Unknown'  };
    }
}

// Display the username in the UI
function displayUserInfo() {
    const userInfo = getUserInfo();
    const fullNameContainer = document.getElementById('full-name-container');
    if (fullNameContainer) {
        fullNameContainer.innerText = `${userInfo.first_name || 'Unknown'} ${userInfo.last_name || ''}`;
    }
}

// Add containers for displaying user info in your HTML
const headerContainer = document.querySelector('.header-container');

const fullNameContainer = document.createElement('div');
fullNameContainer.id = 'full-name-container';
headerContainer.appendChild(fullNameContainer);

// Call the displayUserInfo function to update the UI
displayUserInfo();

const playerData = {
    playerId: null,
    playerBalance: 0,
    playerPerClick: 1,
    playerIncome: 1,
    playerEnergy: 1000,
    playerLastSaved: null,
    playerLevel: 1,
    playerLvlEXP: 0,
    lastEnergyUpdate: Date.now(),
    playerLastLvlUpdate: Date.now(),
    inventory: Array(20).fill(null), // 20 slots initialized to null
    playerEquipped: {
        head: null,
        top: null,
        bottom: null,
        hand: null,
        feet: null
    },
    playerMaterials: Array(6).fill(null) // 6 slots initialized to null
};

document.addEventListener('DOMContentLoaded', () => {
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', resetGame);
});

function resetGame() {
    // Clear saved data from local storage
    localStorage.removeItem('playerData');
    localStorage.removeItem('highScores');

    location.reload();
}

// Function to save player data to localStorage
function savePlayerData() {
    playerData.playerLastSaved = Date.now();

    localStorage.setItem('playerData', JSON.stringify(playerData));
}

function loadPlayerData() {
    const savedData = localStorage.getItem('playerData'); // Get saved data
 

    if (savedData) {
        Object.assign(playerData, JSON.parse(savedData)); // Update playerData with saved data
        console.log('Loaded Player Data:', playerData); // Debugging output
        // Ensure inventory is properly initialized
        if (!Array.isArray(playerData.inventory)) {
            playerData.inventory = Array(20).fill(null);
        }

        playerData.inventory.forEach(item => {
            if (item && !item.id) {
                item.id = generateUUID();
            }
        });

        Object.keys(playerData.playerEquipped).forEach(slot => {
            if (playerData.playerEquipped[slot] && !playerData.playerEquipped[slot].id) {
                playerData.playerEquipped[slot].id = generateUUID();
            }
        });

        // Ensure playerEquipped is properly initialized
        if (!playerData.playerEquipped || typeof playerData.playerEquipped !== 'object') {
            playerData.playerEquipped = {
                head: null,
                top: null,
                bottom: null,
                hand: null,
                feet: null
            };
        }
    } else {
        // Initialize playerData with default values if no saved data
        playerData.playerBalance = 0;
        playerData.playerPerClick = 1;
        playerData.playerIncome = 1;
        playerData.playerEnergy = 1000;
        playerData.playerLevel = 1;
        playerData.playerLvlEXP = 0;
        playerData.lastEnergyUpdate = Date.now();
        playerData.playerLastSaved = Date.now();
        playerData.inventory = Array(20).fill(null); // Initialize inventory
        playerData.playerEquipped = {
            head: null,
            top: null,
            bottom: null,
            hand: null,
            feet: null
        };
        playerData.playerMaterials = Array(6).fill(null); // Initialize inventory
    }

    const lastUpdateTime = playerData.playerLastSaved; // Use the last saved time directly
    const now = Date.now();
    const elapsedTime = now - lastUpdateTime;

    const elapsedTimeInSeconds = Math.floor(elapsedTime / 1000); // Convert to seconds

    // Update player balance based on elapsed time
    playerData.playerBalance += elapsedTimeInSeconds * playerData.playerIncome;

    // Update player experience based on elapsed time
    playerData.playerLvlEXP += elapsedTimeInSeconds * playerData.playerIncome;

    // Call levelUp function to handle leveling logic
 

    const totalIncome = calculateTotalIncome();
    const earnedCoins = totalIncome * elapsedTimeInSeconds;

    showAccumulatedCoinsPopup(earnedCoins); // Show popup for earned coins

    // Update player energy based on elapsed time
    if (elapsedTimeInSeconds > 0) {
        playerData.playerEnergy = Math.min(playerData.playerEnergy + elapsedTimeInSeconds, 1000); // Recharge energy
    }

    // Update last energy update time
    playerData.lastEnergyUpdate = now;

    updateGameUI(); // Update UI after loading data
    //console.log(playerData.playerMaterials);
}

// Function to calculate max coins required for the next level
function calculateMaxCoinsForNextLevel(level) {
    const a = 10; // Scaling factor
    const b = 1.5; // Growth rate
    const c = 10; // Minimum requirement
    return Math.floor(a * Math.pow(level, b)) + c; // Calculate required coins for next level
}

// Initial UI update
updateGameUI();

function calculateTotalIncome() {
    let baseIncome = playerData.playerIncome; // Assume this is your base income
    let totalBoost = 0;

    for (let slot in playerData.playerEquipped) {
        if (playerData.playerEquipped[slot]) {
            const item = playerData.playerEquipped[slot];
            const boostMatch = item.income;
            if (boostMatch) {
                totalBoost += parseInt(boostMatch, 10);
            }
        }
    }

    return baseIncome + totalBoost;
}

// Function to display a popup with accumulated coins
function showAccumulatedCoinsPopup(earnedCoins) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerText = `You earned 💵 ${earnedCoins.toLocaleString()} while you were away!`;
    document.body.appendChild(popup);

    // Style the popup
    Object.assign(popup.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        zIndex: '1000'
    });

    // Remove the popup after 2 seconds
    setTimeout(() => {
        popup.remove();
    }, 2000);
}

// Load player data on initialization
loadPlayerData();


// Function to handle leveling up
function levelUp() {
    let maxCoinsForNextLevel = calculateMaxCoinsForNextLevel(playerData.playerLevel);
    while (playerData.playerLvlEXP >= maxCoinsForNextLevel) {
        playerData.playerLevel += 1; // Level up
        playerData.playerLvlEXP -= maxCoinsForNextLevel; // Deduct the experience required for the next level
        
        // Increase playerIncome by 1 for each level up
        playerData.playerIncome += 1;

        const levelSummaryElement = document.getElementById('level-summary');
        levelSummaryElement.innerText = `Level Boost: + 💵 ${playerData.playerIncome} per second`;

        maxCoinsForNextLevel = calculateMaxCoinsForNextLevel(playerData.playerLevel); // Recalculate for the next level
      
  
        updateGameUI(); // Update the UI to reflect the new balance and energy
        savePlayerData(); // Save updated player data
  
        // Optionally, you can call a function to display level-up message here
        // displayLevelUpMessage();

    }
}


// Function to update the game UI
function updateGameUI() {
    document.getElementById('coins').textContent = formatNumber(playerData.playerBalance); // Update coins display
    document.getElementById('level-value').textContent = `Lvl ${playerData.playerLevel}`; // Update level display

    // Update the level bar based on coins
    updateLevelBar(); // Update the level bar
    updateEnergyBar(); // Update energy bar display

    // Render inventory
    renderInventory(); // Call renderInventory to update inventory UI
}

// Function to update the level bar
function updateLevelBar() {
    const levelExpFill = document.getElementById('level-exp-fill');
    const maxCoinsForNextLevel = calculateMaxCoinsForNextLevel(playerData.playerLevel); // Get max coins for next level
    const widthPercentage = Math.min((playerData.playerLvlEXP / maxCoinsForNextLevel) * 100, 100); // Calculate width
    levelExpFill.style.width = `${widthPercentage}%`; // Update width of the level fill
}

function formatNumber(number) {
    return number.toLocaleString();
}

// Function to update energy bar
function updateEnergyBar() {
    const energyFill = document.getElementById('energy-fill');
    const energyValue = document.getElementById('energy-count');
    if (energyFill && energyValue) {
        energyFill.style.width = `${(playerData.playerEnergy / 1000) * 100}%`; // Assuming max energy is 1000
        energyValue.innerText = playerData.playerEnergy;
    }
}

function updateBalance() {
    playerData.playerBalance += playerData.playerIncome; // Increase balance by player income
    playerData.playerLvlEXP += playerData.playerIncome; // Update playerLvlEXP with income

    // Call levelUp function to handle leveling logic
    levelUp();

    updateGameUI(); // Update the UI
    savePlayerData(); // Save updated player data
}

// Function to reset the level bar for the next level
function resetLevelBar() {
    updateLevelBar(); // Update the level bar UI
}

// Start a timer to update balance every second
setInterval(updateBalance, 1000); // Call updateBalance every 1000 ms (1 second)

// Initial UI update
updateGameUI();

// Inventory Management
// Move inventory-related functions to tab4.js
