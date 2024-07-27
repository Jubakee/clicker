// Initialize the Telegram Web App
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();
window.Telegram.WebApp.disableVerticalSwipes();


// Define a player object with default values
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
    playerLastLvlUpdate: Date.now(), // Add this line for tracking last EXP update time
};


function resetGame() {
    // Clear saved data from local storage
    localStorage.removeItem('playerData');
 
}


// Function to save player data to localStorage
function savePlayerData() {
    playerData.playerLastSaved = Date.now();
    playerData.lastEnergyUpdate = playerData.lastEnergyUpdate; // Save last update time
    localStorage.setItem('playerData', JSON.stringify(playerData));
}

function loadPlayerData() {
    const savedData = localStorage.getItem('playerData'); // Get saved data
    if (savedData) {
        Object.assign(playerData, JSON.parse(savedData)); // Update playerData with saved data
    } else {
        // If no saved data, initialize playerData with default values
        playerData.playerBalance = 0;
        playerData.playerPerClick = 1;
        playerData.playerIncome = 1;
        playerData.playerEnergy = 1000;
        playerData.playerLevel = 1;
        playerData.playerLvlEXP = 0;
        playerData.lastEnergyUpdate = Date.now();
        playerData.playerLastSaved = Date.now();
    }
    
    // Calculate elapsed time since last save
    const lastUpdateTime = playerData.playerLastSaved; // Use the last saved time directly
    const now = Date.now();
    const elapsedTime = now - lastUpdateTime;
    
    const elapsedTimeInSeconds = Math.floor(elapsedTime / 1000); // Convert to seconds
    
    // Update player balance based on elapsed time
    playerData.playerBalance += elapsedTimeInSeconds * playerData.playerIncome; 
    showAccumulatedCoinsPopup(elapsedTimeInSeconds); // Show popup for earned coins
    
    // Update player energy based on elapsed time
    if (elapsedTimeInSeconds > 0) {
        playerData.playerEnergy = Math.min(playerData.playerEnergy + elapsedTimeInSeconds, 1000); // Recharge energy
    }

    // Update last energy update time
    playerData.lastEnergyUpdate = now; 

    updateGameUI(); // Update UI after loading data
}


// Function to display a popup with accumulated coins
function showAccumulatedCoinsPopup(accumulatedCoins) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerText = `You earned 💵 ${accumulatedCoins} while you were away!`;
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

// Function to update the game UI
function updateGameUI() {
    document.getElementById('coins').textContent = formatNumber(playerData.playerBalance); // Update coins display
    document.getElementById('level-value').textContent = `Lvl ${playerData.playerLevel}`; // Update level display

    // Update the level bar based on coins
    updateLevelBar(); // Add this line to update the level bar
    updateEnergyBar(); // Update energy bar display
}

// Function to update the level bar
function updateLevelBar() {
    const levelExpFill = document.getElementById('level-exp-fill');
    const maxCoinsForNextLevel = 1000; // Set the max coins needed for next level
    // console.log(playerData.playerLvlEXP)
    // Calculate the width percentage for the level bar based on playerLvlEXP
    const widthPercentage = Math.min((playerData.playerLvlEXP / maxCoinsForNextLevel) * 100, 100); // Ensure it doesn't exceed 100%
    levelExpFill.style.width = `${widthPercentage}%`; // Update the width of the level fill
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

// Function to update balance and save data
function updateBalance() {
    playerData.playerBalance += playerData.playerIncome; // Increase balance by player income
    playerData.playerLvlEXP += playerData.playerIncome; // Also update playerLvlEXP with income

    updateGameUI(); // Update the UI
    savePlayerData(); // Save updated player data
}

// Start a timer to update balance every second
setInterval(updateBalance, 1000); // Call updateBalance every 1000 ms (1 second)

// Initial UI update
updateGameUI();
