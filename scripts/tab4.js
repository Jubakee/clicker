// Load inventory from playerData
function loadInventory() {
    if (!Array.isArray(playerData.inventory)) {
        playerData.inventory = Array(20).fill(null);
    }
}

// Save inventory to playerData
function saveInventory() {
    savePlayerData();
}

let selectedItems = new Set();

function renderInventory() {
    const inventoryContainer = document.querySelector('.inventory-container');
    if (!inventoryContainer) {
        console.error('Inventory container not found!');
        return;
    }
    inventoryContainer.innerHTML = ''; // Clear the container

    const filterValue = document.getElementById('slot-filter').value;

    playerData.inventory.forEach((item, index) => {
        if (filterValue !== 'all' && item && item.slot !== filterValue) {
            return; // Skip items that don't match the filter
        }

        const inventoryItem = document.createElement('div');
        inventoryItem.className = 'inventory-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'inventory-checkbox';
        checkbox.dataset.index = index; // Store the index in a data attribute

        if (selectedItems.has(index)) {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                selectedItems.add(index);
            } else {
                selectedItems.delete(index);
            }
        });

        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';
        checkboxContainer.appendChild(checkbox);
        inventoryItem.appendChild(checkboxContainer);

        if (item) {
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.className = 'inventory-image';
        
            const starsContainer = document.createElement('div');
            starsContainer.className = 'stars-container';
        
            // Only generate stars if the item is not a chest
            if (item.type !== 'Chest') {
                starsContainer.innerHTML = generateStars(0); // Generate stars based on item level
            }
        
            const levelDisplay = document.createElement('p');
            levelDisplay.className = 'inventory-level';
            // levelDisplay.innerText = `Level: ${item.level || 1}`; // Display level
        
            inventoryItem.appendChild(img);
            inventoryItem.appendChild(starsContainer); // Add stars to inventory item
            // inventoryItem.appendChild(levelDisplay); // Add level display
        
            // inventoryItem.appendChild(levelDisplay); // Add level display

            // const p = document.createElement('p');
            // p.className = 'inventory-name';
            // p.innerText = item.name; // Keep item name for reference or later use
            // inventoryItem.appendChild(p); // Optional: You can choose to keep this or not

            if (item.rarity) {
                const rarityClass = item.rarity.toLowerCase();
                inventoryItem.classList.add(rarityClass);
            }

            const isEquipped = Object.values(playerData.playerEquipped).some(equippedItem => equippedItem && equippedItem.id === item.id);
            if (isEquipped) {
                inventoryItem.classList.add('equipped');
            }

            inventoryItem.addEventListener('click', (event) => {
                // Prevent triggering the popup when clicking the checkbox
                if (event.target !== checkbox) {
                    showItemPopup(item, isEquipped);
                }
            });
        } else {
            inventoryItem.innerHTML += '<p class="inventory-name">Empty</p>';
        }

        inventoryContainer.appendChild(inventoryItem);
    });
}


document.getElementById('slot-filter').addEventListener('change', () => {
    renderInventory();
});



function showItemPopup(item, isEquipped) {
    if (item.type === 'Chest' && item.isOpened === 'false') {
        openChest(item);
        return;
    }
    
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';

    const popup = document.createElement('div');
    popup.className = 'popup';

    if (item.rarity) {
        const rarityClass = item.rarity.toLowerCase(); // Match CSS class names in tab4.css
        popup.classList.add(rarityClass);
    }

    const itemSlot = document.createElement('h3');
    itemSlot.innerText = item.slot.charAt(0).toUpperCase() + item.slot.slice(1);
    itemSlot.className = 'popup-slot';
    

    const itemImage = document.createElement('img');
    itemImage.src = item.image;
    itemImage.alt = item.name;
    itemImage.className = 'popup-image';

    const itemName = document.createElement('h3');
    itemName.innerText = item.name;
    itemName.className = 'popup-name';

    const itemDescription = document.createElement('p');
    itemDescription.innerText = `+ 💵 ${item.income} per second`;
    itemDescription.className = 'popup-description';

    const actionButton = document.createElement('button');
    actionButton.className = 'popup-button';

 if (isEquipped) {
        actionButton.innerText = 'Unequip';
        console.log(`Setting up Unequip button for: ${item.name}`); // Add this log
        actionButton.addEventListener('click', () => {
            console.log(`Unequipping item: ${item.name}`); // Add this log
            unequipItem2(item);
            closePopup(popupOverlay);
        });
    } else {
        actionButton.innerText = 'Equip';
        actionButton.addEventListener('click', () => {
            equipItem(item);
            closePopup(popupOverlay);
        });
    }


    const recycleButton = document.createElement('button');
    recycleButton.innerText = 'Recycle';
    recycleButton.className = 'popup-button';
    recycleButton.addEventListener('click', () => {
        recycleItem(item); // Call recycleItem

        // alert(`You obtained ${emeraldsObtained} 💎(s) from recycling ${item.name}!`); // Alert for recycled item
        // closePopup(popupOverlay);
    });
    
    const levelUpButton = document.createElement('button');
    levelUpButton.innerText = 'Level Up';
    levelUpButton.className = 'popup-button';
    levelUpButton.addEventListener('click', () => {
        const originalIncome = item.income; // Store the original income for the animation
        const levelUpCost = calculateLevelUpCost(item.level); // Calculate the cost before leveling up
        const descriptionText = itemDescription; // Reference to the description text element
    
        // Proceed with leveling up
        if (levelUpItem(item, popupOverlay)) { // Pass popupOverlay here
            // If leveling up is successful, keep the popup open and show the animation
            let newIncome = item.income; // Get the new income after leveling up
    
            // Update income for the animation
            descriptionText.innerText = `+ 💵 ${originalIncome} → ${newIncome} per second`; // Show the transition
    
            // Add an animation class for the description text
            descriptionText.classList.add('income-animation');
            starsContainer.innerHTML = generateStars(item.level || 1); // Generate stars based on item level
    
            // Reset the text after the animation is complete
            setTimeout(() => {
                descriptionText.innerText = `+ 💵 ${newIncome} per second`; // Final update of the text
                descriptionText.classList.remove('income-animation'); // Remove the animation class
            }, 1000); // Adjust the timeout to match your animation duration
        }
    });
    


    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.className = 'popup-button';
    closeButton.addEventListener('click', () => {
        closePopup(popupOverlay);
    });

    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    starsContainer.innerHTML = generateStars(item.level || 1); // Generate stars based on item level
    
    popup.appendChild(itemSlot);
    popup.appendChild(starsContainer); // Add stars to the popup

    popup.appendChild(itemImage);
    popup.appendChild(itemName);
    popup.appendChild(itemDescription);
    popup.appendChild(levelUpButton); // Add the button to the popup
    popup.appendChild(actionButton);
    if (item.type != 'Chest') {
        popup.appendChild(recycleButton);

    }

   
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
        width: '100%'
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
            fontSize: '14px'
        });
    });
}


function generateStars(level) {
    const maxStars = 5; // Maximum number of stars
    let stars = '';
    for (let i = 0; i < maxStars; i++) {
        if (i < level) {
            stars += '★'; // Filled star
        } else {
            stars += '☆'; // Empty star
        }
    }
    return stars; // Return the star representation
}

function levelUpItem(item, popupOverlay) { // Add popupOverlay parameter
    if (item.level >= 5) {
        alert(`${item.name} has already reached the maximum level.`);
        console.log(`${item.name} is at the maximum level of 5.`);
        return false; // Indicate that leveling up failed
    }

    const levelUpCost = calculateLevelUpCost(item.level); // Calculate cost based on the item's current level

    if (playerData.playerBalance >= levelUpCost) {
        // Show confirmation popup
        const confirmation = confirm(`Leveling up ${item.name} to level ${item.level + 1} will cost 💵 ${levelUpCost.toLocaleString()}. Do you want to proceed?`);
        
        if (confirmation) {
            playerData.playerBalance -= levelUpCost; // Deduct the cost from the player's balance

            // Check for risk factor if leveling from level 3 or higher
            if (item.level >= 3) {
                console.log('level 3')
                const successChance = item.level === 3 ? 0.1 : item.level === 4 ? 0.05 : 0; // 80% for level 3 to 4, 70% for level 4 to 5
                const isSuccess = Math.random() < successChance; // Randomly determine success based on chance

                if (!isSuccess) {
                    // Animate item failure (you can replace this with your animation logic)
                    // notifyUser(`${item.name} has perished during the level-up! You receive some materials instead.`, 'error');

                    // Here, you can add logic to convert the item into materials
                    convertItemToMaterials(item, popupOverlay);
          
                    return false; // Indicate that leveling up failed
                }
            }

            // Proceed with leveling up the item if it was successful
            item.level += 1; // Increase the item's level by 1
            item.income += item.income; // Increase the item's income

            console.log(`Income after level up: ${item.income}`);
            console.log(`Leveled up ${item.name} to level ${item.level}`);

            // Save player data
            savePlayerData();

            // notifyUser(`${item.name} leveled up to level ${item.level}!`, 'success');
            return true; // Indicate that leveling up was successful
        } else {
            alert(`Level up of ${item.name} was canceled.`);
            return false; // Indicate that leveling up failed
        }
    } else {
        alert(`You do not have enough coins to level up ${item.name}. Required: 💵 ${levelUpCost.toLocaleString()}, Current: 💵 ${playerData.playerBalance.toLocaleString()}`);
        console.log(`Not enough coins to level up ${item.name}. Required: ${levelUpCost}, Current: ${playerData.playerBalance}`);
        return false; // Indicate that leveling up failed
    }
}

// Function to close the popup
function closePopup(popupOverlay) {
    popupOverlay.remove();
}


// Function to notify the user
function notifyUser(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;
    document.body.appendChild(notification);

    // Style the notification (you can customize this)
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: type === 'error' ? '#ff4d4d' : '#4CAF50',
        color: '#fff',
        padding: '10px',
        zIndex: '1000',
        borderRadius: '5px'
    });

    // Remove the notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}


// Function to convert item to materials
function convertItemToMaterials(item, popupOverlay) {
     // Display a message indicating failure
     alert(`Uh oh! The item "${item.name}" has been destroyed!`);

     // Remove the item from the inventory using its ID
     playerData.inventory = playerData.inventory.filter(slot => slot && slot.id !== item.id);
 
     // Fill the rest of the inventory with null to maintain length
     while (playerData.inventory.length < 20) {
         playerData.inventory.push(null);
     }
 

     
     // Update the inventory display

    // Define how many materials are obtained based on the item's level or type
    let materialsObtained = {
        emerald: item.level * 2, // Example: 2 emeralds per item level
        // You can add more material types if needed
    };

    // Add materials to playerData.playerMaterials
    const existingEmeraldIndex = playerData.playerMaterials.findIndex(material => material && material.type === 'emerald');

    // Update materials based on the obtained amount
    if (existingEmeraldIndex !== -1) {
        playerData.playerMaterials[existingEmeraldIndex].quantity += materialsObtained.emerald;
    } else {
        const materialIndex = playerData.playerMaterials.findIndex(material => material === null);
        if (materialIndex !== -1) {
            playerData.playerMaterials[materialIndex] = { type: 'emerald', quantity: materialsObtained.emerald };
        } else {
            console.log('Materials array is full! Could not add 💎.');
        }
    }


    savePlayerData();
    renderInventory();
    renderEquippedItems();
    displayMaterials(); // For debugging purposes
    alert(`"${item.name}" has been removed from your inventory BUT you gained ${materialsObtained.emerald} 💎(s) in the process!.`);
    closePopup(popupOverlay); // Close the popup if leveling fails
    // You can implement similar logic for other materials based on item type
}


// Function to calculate the cost of leveling up based on the item's current level
function calculateLevelUpCost(currentLevel) {
    return Math.floor(100 * Math.pow(1.5, currentLevel)); // Example cost calculation formula
}


// Function to calculate the cost of leveling up based on the item's current level
function calculateLevelUpCost(currentLevel) {
    return Math.floor(1 * Math.pow(1.5, currentLevel)); // Example cost calculation formula
}


function recycleItem(item) {
    const slot = Object.keys(playerData.playerEquipped).find(key => playerData.playerEquipped[key] && playerData.playerEquipped[key].id === item.id);
    let emeraldsObtained = 0;

    // Check if the item is equipped
    if (slot) {
        const confirmRecycle = confirm(`You are recycling an equipped item: ${item.name}. Are you sure?`);
        if (!confirmRecycle) {
            return 0; // Exit the function if the user cancels
        }
    }

    // Loop through the inventory to find and recycle all instances of the item
    let itemCount = playerData.inventory.filter(slot => slot && slot.id === item.id).length;

    if (itemCount > 0) {
        for (let i = 0; i < playerData.inventory.length; i++) {
            if (playerData.inventory[i] && playerData.inventory[i].id === item.id) {
                // Check if the item is equipped and unequip it if necessary
                if (slot) {
                    playerData.playerEquipped[slot] = null;
                    console.log(`Unequipped: ${item.name} from ${slot}`);
                }

                // Remove the item by setting its slot to null
                playerData.inventory[i] = null;

                // Calculate emeralds based on item level and a range
                const emeraldsFromItem = calculateEmeraldsFromItemLevel(item.level);
      

                emeraldsObtained += emeraldsFromItem;
                console.log(`Recycled ${item.name} (Level ${item.level}) and obtained ${emeraldsFromItem} emeralds!`);
            }
        }

        // Shift all non-null items to the front
        playerData.inventory = playerData.inventory.filter(slot => slot !== null);

        // Fill the rest of the inventory with null
        while (playerData.inventory.length < 20) {
            playerData.inventory.push(null);
        }

        // Add emeralds to player's materials
        const existingEmeraldIndex = playerData.playerMaterials.findIndex(material => material && material.type === 'emerald');
        if (existingEmeraldIndex !== -1) {
            playerData.playerMaterials[existingEmeraldIndex].quantity += emeraldsObtained;
        } else {
            const materialIndex = playerData.playerMaterials.findIndex(material => material === null);
            if (materialIndex !== -1) {
                playerData.playerMaterials[materialIndex] = { type: 'emerald', quantity: emeraldsObtained };
            } else {
                console.log('Materials array is full! Could not add 💎.');
            }
        }

        savePlayerData();
        renderInventory();
        renderEquippedItems();
        displayMaterials(); // For debugging purposes
        
        return emeraldsObtained; // Return the number of emeralds obtained
    } else {
        console.log('Item not found in inventory!');
        return 0; // No items recycled
    }
}

// Function to calculate the number of emeralds based on item level and a range
function calculateEmeraldsFromItemLevel(level) {
    // Define the material ranges based on item level
    const materialRanges = {
        1: [1, 5],
        2: [5, 10],
        3: [10, 15],
        4: [15, 20],
        5: [20,25]
        // Add more levels as needed
    };

    // Get the range for the given level
    const range = materialRanges[level] || [0, 0]; // Default to [0, 0] if the level is not defined

    // Calculate random emeralds within the defined range
    const emeraldsObtained = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    return emeraldsObtained;
}

function recycleSelectedItems() {
    if (selectedItems.size === 0) {
        alert("No items are selected to recycle.");
        return; // Exit the function if no items are selected
    }

    const confirmRecycleAll = confirm("Are you sure you want to recycle all selected items?");
    if (!confirmRecycleAll) {
        return; // Exit the function if the user cancels
    }

    let totalEmeraldsObtained = 0;

    // Create an array from the selected items
    const itemsToRecycle = Array.from(selectedItems);


    // Sort selected items in descending order
    itemsToRecycle.sort((a, b) => b - a);

    // Loop through the selected items to recycle
    itemsToRecycle.forEach(index => {
        const item = playerData.inventory[index];
        if (item) {
            if(item.type === 'Chest'){
                alert(`Can't recycle Chests!`);
                return;
            }
            totalEmeraldsObtained += recycleItem(item); // Accumulate emeralds obtained from recycling
            console.log(item)
        
            alert(`Recycled item and obtained a total of ${totalEmeraldsObtained} 💎(s)!`);

            // Remove the item by setting its slot to null using its ID
            playerData.inventory = playerData.inventory.filter(slot => slot && slot.id !== item.id);
        }
    });

    // Fill the rest of the inventory with null to maintain length
    while (playerData.inventory.length < 20) {
        playerData.inventory.push(null);
    }

    // Clear the selected items set
    selectedItems.clear();


    savePlayerData();
    renderInventory();
    renderEquippedItems();
    displayMaterials(); // For debugging purposes
}



function unequipItem2(item) {
    console.log('Unequip item function called for:', item.name);
    const slot = Object.keys(playerData.playerEquipped).find(key => playerData.playerEquipped[key] && playerData.playerEquipped[key].id === item.id);
    if (slot) {
        playerData.playerEquipped[slot] = null;
        console.log(`Unequipped: ${item.name} from ${slot}`);
        savePlayerData();
        renderInventory();
        renderEquippedItems();
    }
}




function unequipItem(item) {

    const slot = Object.keys(playerData.playerEquipped).find(key => playerData.playerEquipped[key] && playerData.playerEquipped[key].id === item.id);
    if (slot) {
        playerData.playerEquipped[slot] = null;
        console.log(`Unequipped: ${item.name} from ${slot}`);
        savePlayerData();
        renderInventory();
        renderEquippedItems();
    }
}

function addItemToInventory(itemPool) {
    const newItem = itemPool[Math.floor(Math.random() * itemPool.length)]();
    playerData.inventory.push(newItem);
    savePlayerData();
    renderInventory();
}

function openChest(item) {
    item.isOpened = 'true';

    let randomItem;
    if (item.rarity === 'Common') {
        randomItem = commonItemPool[Math.floor(Math.random() * commonItemPool.length)]();
    } else if (item.rarity === 'Uncommon') {
        randomItem = uncommonItemPool[Math.floor(Math.random() * uncommonItemPool.length)]();
    } else if (item.rarity === 'Rare') {
        randomItem = rareItemPool[Math.floor(Math.random() * rareItemPool.length)]();
    } else if (item.rarity === 'Epic') {
        randomItem = epicItemPool[Math.floor(Math.random() * epicItemPool.length)]();
    }

    const chestIndex = playerData.inventory.indexOf(item);
    if (chestIndex !== -1) {
        playerData.inventory[chestIndex] = randomItem;
    }

    savePlayerData();
    renderInventory();
    console.log(`Opened: ${item.name} and replaced with ${randomItem.name}`);
}

function equipItem(item) {
    const slot = item.slot;
    const currentlyEquippedItem = playerData.playerEquipped[slot];
    
    if (currentlyEquippedItem) {
        const confirmUnequip = confirm(`Are you sure you want to unequip ${currentlyEquippedItem.name}?`);
        if (!confirmUnequip) {
            return; // Exit the function if the user cancels
        }
        console.log(`Unequipped: ${currentlyEquippedItem.name}`);
    }

    playerData.playerEquipped[slot] = item;
    console.log(`Equipped: ${item.name} to ${slot}`);
    savePlayerData();
    renderInventory();
    renderEquippedItems();
}



function displayMaterials() {
    const emeraldsQuantity = document.getElementById('emeralds-quantity');

    // Find the emerald material in playerMaterials
    const emeraldMaterial = playerData.playerMaterials.find(material => material && material.type === 'emerald');
    
    // Update the displayed quantity of emeralds
    emeraldsQuantity.innerText = emeraldMaterial ? emeraldMaterial.quantity : 0; // Show 0 if no emeralds

    // You can add similar code for other materials here
}



// Attach the recycleSelectedItems function to the Recycle All button
document.getElementById('recycle-all-button').addEventListener('click', recycleSelectedItems);


// Load and render inventory on page load
document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
    displayMaterials(); // Add this line to display materials on load

    renderInventory();

});

