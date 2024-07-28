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

// Render inventory
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
            inventoryItem.innerHTML = '<p class="inventory-name">Empty</p>';
        }

        inventoryContainer.appendChild(inventoryItem);
    });
}

// Show item popup
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

    const actionButton = document.createElement('button');
    actionButton.className = 'popup-button';

    console.log(item)
    if (item.type === 'Chest' && item.isOpened === 'false') {
        actionButton.innerText = 'Open';
        actionButton.addEventListener('click', () => {
            // Open chest logic here
            item.isOpened = 'true';
    
            let randomItem;
            if (item.rarity === 'Common') {
                // Select a random item from the common item pool
                randomItem = commonItemPool[Math.floor(Math.random() * commonItemPool.length)];
            } else if (item.rarity === 'Uncommon') {
                // Select a random item from the uncommon item pool
                randomItem = uncommonItemPool[Math.floor(Math.random() * uncommonItemPool.length)];
            }
            else if (item.rarity === 'Rare') {
                // Select a random item from the uncommon item pool
                randomItem = rareItemPool[Math.floor(Math.random() * rareItemPool.length)];
            }
            else if (item.rarity === 'Epic') {
                // Select a random item from the uncommon item pool
                randomItem = epicItemPool[Math.floor(Math.random() * epicItemPool.length)];
            }
            // Replace the chest with the selected item
            const chestIndex = playerData.inventory.indexOf(item);
            if (chestIndex !== -1) {
                playerData.inventory[chestIndex] = randomItem;
            }
    
            // Save the updated inventory
            saveInventory();
    
            // Re-render the inventory
            renderInventory();
    
            console.log(`Opened: ${item.name} and replaced with ${randomItem.name}`);
            closePopup(popupOverlay);
        });
    } else {
        
        actionButton.innerText = 'Equip';
        actionButton.addEventListener('click', () => {
            // Equip item logic here
            console.log(`Equipped: ${item.name}`);
            closePopup(popupOverlay);
        });
    }
    

    // const recycleButton = document.createElement('button');
    // recycleButton.innerText = 'Recycle';
    // recycleButton.className = 'popup-button';
    // recycleButton.addEventListener('click', () => {
    //     // Recycle item logic here
    //     console.log(`Recycled: ${item.name}`);
    //     closePopup(popupOverlay);
    // });

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.className = 'popup-button';
    closeButton.addEventListener('click', () => {
        closePopup(popupOverlay);
    });

    popup.appendChild(itemImage);
    popup.appendChild(itemName);
    popup.appendChild(itemDescription);
    popup.appendChild(actionButton);
    // popup.appendChild(recycleButton);
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
            fontSize: '16px'
        });

        // button.addEventListener('mouseenter', () => {
        //     button.style.backgroundColor = '#0056b3';
        // });

        // button.addEventListener('mouseleave', () => {
        //     button.style.backgroundColor = '#007bff';
        // });
    });
}

// Function to close the popup
function closePopup(popupOverlay) {
    popupOverlay.remove();
}

// Add an item to the inventory
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
