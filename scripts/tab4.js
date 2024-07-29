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
            // inventoryItem.appendChild(p);

            if (item.rarity) {
                const rarityClass = item.rarity.toLowerCase();
                inventoryItem.classList.add(rarityClass);
            }

            // Check if the item is equipped and add the 'equipped' class
            const isEquipped = Object.values(playerData.playerEquipped).some(equippedItem => equippedItem && equippedItem.id === item.id);
            if (isEquipped) {
                inventoryItem.classList.add('equipped');
            }

            inventoryItem.addEventListener('click', () => {
                showItemPopup(item, isEquipped);
            });
        } else {
            inventoryItem.innerHTML = '<p class="inventory-name">Empty</p>';
        }

        inventoryContainer.appendChild(inventoryItem);
    });
}


function showItemPopup(item, isEquipped) {
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
    itemDescription.innerText = item.description;
    itemDescription.className = 'popup-description';

    const actionButton = document.createElement('button');
    actionButton.className = 'popup-button';

    if (item.type === 'Chest' && item.isOpened === 'false') {
        actionButton.innerText = 'Open';
        actionButton.addEventListener('click', () => {
            openChest(item);
            closePopup(popupOverlay);
        });
    } else if (isEquipped) {
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
        recycleItem(item)
;      closePopup(popupOverlay);
    });


    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.className = 'popup-button';
    closeButton.addEventListener('click', () => {
        closePopup(popupOverlay);
    });

    popup.appendChild(itemSlot);
    popup.appendChild(itemImage);
    popup.appendChild(itemName);
    popup.appendChild(itemDescription);
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

function recycleItem(item) {
    // Find the item's index in the inventory
    const itemIndex = playerData.inventory.findIndex(slot => slot && slot.id === item.id);

    if (itemIndex !== -1) {
        // Check if the item is equipped and unequip it if necessary
        const equippedSlot = Object.keys(playerData.playerEquipped).find(slot => playerData.playerEquipped[slot] && playerData.playerEquipped[slot].id === item.id);
        if (equippedSlot) {
            playerData.playerEquipped[equippedSlot] = null;
            console.log(`Unequipped: ${item.name} from ${equippedSlot}`);
        }

        // Remove the item by setting its slot to null
        playerData.inventory[itemIndex] = null;

        // Shift all non-null items to the front
        playerData.inventory = playerData.inventory.filter(slot => slot !== null);

        // Fill the rest of the inventory with null
        while (playerData.inventory.length < 20) {
            playerData.inventory.push(null);
        }

        // Chance to obtain 1-5 emeralds
        const emeraldsObtained = Math.floor(Math.random() * 5) + 1;

        // Find if there's already an emerald entry in the materials array
        const existingEmeraldIndex = playerData.playerMaterials.findIndex(material => material && material.type === 'emerald');

        if (existingEmeraldIndex !== -1) {
            // Increase the quantity if emerald entry exists
            playerData.playerMaterials[existingEmeraldIndex].quantity += emeraldsObtained;
        } else {
            // Add new entry if there's no existing emerald entry
            const materialIndex = playerData.playerMaterials.findIndex(material => material === null);
            if (materialIndex !== -1) {
                playerData.playerMaterials[materialIndex] = { type: 'emerald', quantity: emeraldsObtained };
            } else {
                console.log('Materials array is full! Could not add diamond.');
            }
        }

        alert(`Recycled ${item.name} and obtained ${emeraldsObtained} diamond(s)!`);

        savePlayerData();
        renderInventory();
        renderEquippedItems();
        displayMaterials(); // For debugging purposes
    } else {
        console.log('Item not found in inventory!');
    }
}


function displayMaterials() {
    console.log('Player Materials:', playerData.playerMaterials);
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

// Function to close the popup
function closePopup(popupOverlay) {
    popupOverlay.remove();
}

// Load and render inventory on page load
document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
    renderInventory();
});


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

// Function to close the popup
function closePopup(popupOverlay) {
    
    popupOverlay.remove();
}

// Load and render inventory on page load
document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
    renderInventory();
});

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
    if (playerData.playerEquipped[slot]) {
        console.log(`Unequipped: ${playerData.playerEquipped[slot].name}`);
    }
    playerData.playerEquipped[slot] = item;
    console.log(`Equipped: ${item.name} to ${slot}`);
    savePlayerData();
    renderInventory();
    renderEquippedItems();
}

function unequipItem(item) {
    console.log('unequip')
    const slot = item.slot;
    playerData.playerEquipped[slot] = null;
    console.log(`Unequipped: ${item.name} from ${slot}`);
    savePlayerData();
    renderInventory();
    renderEquippedItems();
}

// Function to close the popup
function closePopup(popupOverlay) {
    popupOverlay.remove();
}

function displayMaterials() {
    const emeraldsQuantity = document.getElementById('emeralds-quantity');

    // Find the emerald material in playerMaterials
    const emeraldMaterial = playerData.playerMaterials.find(material => material && material.type === 'emerald');
    
    // Update the displayed quantity of emeralds
    emeraldsQuantity.innerText = emeraldMaterial ? emeraldMaterial.quantity : 0; // Show 0 if no emeralds

    // You can add similar code for other materials here
}


// Load and render inventory on page load
document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
    displayMaterials(); // Add this line to display materials on load

    renderInventory();

});

