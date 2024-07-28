// Initialize the Telegram Web App
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();
window.Telegram.WebApp.disableVerticalSwipes();
//resetGame();
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
    playerLastLvlUpdate: Date.now(),
    inventory: Array(20).fill(null), // 20 slots initialized to null
};

function resetGame() {
    // Clear saved data from local storage
    localStorage.removeItem('playerData');
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

        // Ensure inventory is properly initialized
        if (!Array.isArray(playerData.inventory)) {
            playerData.inventory = Array(20).fill(null);
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
    }

    const lastUpdateTime = playerData.playerLastSaved; // Use the last saved time directly
    const now = Date.now();
    const elapsedTime = now - lastUpdateTime;

    const elapsedTimeInSeconds = Math.floor(elapsedTime / 1000); // Convert to seconds

    // Update player balance based on elapsed time
    playerData.playerBalance += elapsedTimeInSeconds * playerData.playerIncome;

    // Update player experience based on elapsed time
    playerData.playerLvlEXP += elapsedTimeInSeconds * playerData.playerIncome;

    // Handle leveling up if experience surpasses the requirement for the next level
    let maxCoinsForNextLevel = calculateMaxCoinsForNextLevel(playerData.playerLevel);
    while (playerData.playerLvlEXP >= maxCoinsForNextLevel) {
        playerData.playerLevel += 1; // Level up
        playerData.playerLvlEXP -= maxCoinsForNextLevel; // Deduct the experience required for the next level
        maxCoinsForNextLevel = calculateMaxCoinsForNextLevel(playerData.playerLevel); // Recalculate for the next level
    }

    showAccumulatedCoinsPopup(elapsedTimeInSeconds); // Show popup for earned coins

    // Update player energy based on elapsed time
    if (elapsedTimeInSeconds > 0) {
        playerData.playerEnergy = Math.min(playerData.playerEnergy + elapsedTimeInSeconds, 1000); // Recharge energy
    }

    // Update last energy update time
    playerData.lastEnergyUpdate = now;

    updateGameUI(); // Update UI after loading data
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

    const maxCoinsForNextLevel = calculateMaxCoinsForNextLevel(playerData.playerLevel);
    
    // Check if the player has enough experience to level up
    if (playerData.playerLvlEXP >= maxCoinsForNextLevel) {
        playerData.playerLevel += 1; // Level up
        playerData.playerLvlEXP = 0; // Reset experience for the next level
        // displayLevelUpMessage(); // Show a message indicating the level up
        resetLevelBar(); // Reset the level bar
        savePlayerData(); // Save updated player data
    }

    updateGameUI(); // Update the UI
    savePlayerData(); // Save updated player data
}

// Function to display level up message
function displayLevelUpMessage() {
    const levelUpPopup = document.createElement('div');
    levelUpPopup.className = 'popup';
    levelUpPopup.innerText = `Congratulations! You've reached Level ${playerData.playerLevel}!`;
    document.body.appendChild(levelUpPopup);

    // Style the level up popup
    Object.assign(levelUpPopup.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        zIndex: '1000'
    });

    // Remove the level up popup after 2 seconds
    setTimeout(() => {
        levelUpPopup.remove();
    }, 2000);
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

// Function to load inventory from playerData
function loadInventory() {
    if (!Array.isArray(playerData.inventory)) {
        playerData.inventory = Array(20).fill(null);
    }
}

// Function to save inventory to playerData
function saveInventory() {
    savePlayerData();
}
function renderInventory() {
    const inventoryContainer = document.querySelector('.inventory-container');
    if (!inventoryContainer) {
        console.error('Inventory container not found!');
        return;
    }
    inventoryContainer.innerHTML = ''; // Clear the container

    playerData.inventory.forEach((item, index) => {
        const inventoryItem = document.createElement('div');
        inventoryItem.className = 'inventory-item';

        if (item) {
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.className = 'inventory-image';

            const p = document.createElement('p');
            p.className = 'inventory-name';
            p.innerText = item.name;

            inventoryItem.appendChild(img);
            inventoryItem.appendChild(p);

            // Add rarity class to inventory item
            if (item.rarity) {
                const rarityClass = item.rarity.toLowerCase(); // Ensure class names are lowercase
                inventoryItem.classList.add(rarityClass);
            }

            // Add click event listener to show item details in a popup
            inventoryItem.addEventListener('click', () => {
                showItemPopup(item);
            });
        } else {
            inventoryItem.innerHTML = '<p class="inventory-name">Empty Slot</p>';
        }

        inventoryContainer.appendChild(inventoryItem);
    });
}

function showItemPopup(item) {
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';

    const popup = document.createElement('div');
    popup.className = 'popup';

    if (item.rarity) {
        const rarityClass = item.rarity.toLowerCase(); // Match CSS class names in tab4.css
        popup.classList.add(rarityClass);
    }

    const itemImage = document.createElement('img');
    itemImage.src = item.image;
    itemImage.alt = item.name;
    itemImage.className = 'popup-image';

    const itemName = document.createElement('h3');
    itemName.innerText = item.name;
    itemName.className = 'popup-name';

    const itemDescription = document.createElement('p');
    itemDescription.innerText = item.description;
    itemDescription.className = 'popup-description';

    const equipButton = document.createElement('button');
    equipButton.innerText = 'Equip';
    equipButton.className = 'popup-button';
    equipButton.addEventListener('click', () => {
        // Equip item logic here
        console.log(`Equipped: ${item.name}`);
        closePopup(popupOverlay);
    });

    const recycleButton = document.createElement('button');
    recycleButton.innerText = 'Recycle';
    recycleButton.className = 'popup-button';
    recycleButton.addEventListener('click', () => {
        // Recycle item logic here
        console.log(`Recycled: ${item.name}`);
        closePopup(popupOverlay);
    });

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.className = 'popup-button';
    closeButton.addEventListener('click', () => {
        closePopup(popupOverlay);
    });

    popup.appendChild(itemImage);
    popup.appendChild(itemName);
    popup.appendChild(itemDescription);
    popup.appendChild(equipButton);
    popup.appendChild(recycleButton);
    popup.appendChild(closeButton);

    popupOverlay.appendChild(popup);
    document.body.appendChild(popupOverlay);

    // Style the popup overlay
    Object.assign(popupOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000'
    });

    // Style the popup
    Object.assign(popup.style, {
        backgroundColor: '#fff',
       
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        maxWidth: '300px',
        width: '100%',
    });

    // Style the popup image
    Object.assign(itemImage.style, {
        maxWidth: '100%',
        borderRadius: '10px'
    });

    // Style the popup buttons
    const buttons = popup.querySelectorAll('.popup-button');
    buttons.forEach(button => {
        Object.assign(button.style, {
            display: 'block',
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#333',
            color: '#fff',
            fontSize: '16px'
        });

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#0056b3';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#007bff';
        });
    });
}

// Function to close the popup
function closePopup(popupOverlay) {
    popupOverlay.remove();
}


// Function to add an item to the inventory
function addItemToInventory(item) {
    const emptyIndex = playerData.inventory.findIndex(slot => slot === null);
    if (emptyIndex !== -1) {
        playerData.inventory[emptyIndex] = item;
        saveInventory();
        renderInventory();
    } else {
        console.log('Inventory is full!');
    }
}

// Load and render inventory on page load
document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
    renderInventory();
});

// // Sample usage: Adding an item to the inventory
// const sampleItem = {
//     name: 'Sample Item',
//     image: 'assets/chest.png'
// };
// addItemToInventory(sampleItem);
