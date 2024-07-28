document.addEventListener('DOMContentLoaded', () => {
    renderEquippedItems();
});

function renderEquippedItems() {
    const slots = ['head', 'top', 'bottom', 'hand', 'feet'];
    let totalBoost = 0;

    slots.forEach(slot => {
        const slotElement = document.getElementById(`${slot}-slot`).querySelector('.equipped-item-content');
        const equippedItem = playerData.playerEquipped[slot];

        slotElement.innerHTML = ''; // Clear the slot
        slotElement.parentElement.className = 'equipped-item'; // Reset the class name

        if (equippedItem) {
            const itemImage = document.createElement('img');
            itemImage.src = equippedItem.image;
            itemImage.alt = equippedItem.name;
            itemImage.className = 'equipped-item-image';

            const itemName = document.createElement('p');
            itemName.className = 'equipped-item-name';
            itemName.innerText = equippedItem.name;

            const itemDescription = document.createElement('p');
            itemDescription.className = 'equipped-item-description';
            itemDescription.innerText = equippedItem.description;

            const unequipButton = document.createElement('button');
            unequipButton.innerText = 'Unequip';
            unequipButton.className = 'unequip-button';
            unequipButton.addEventListener('click', () => {
                unequipItem(slot);
            });
            
            slotElement.appendChild(itemImage);
            slotElement.appendChild(itemName);
            slotElement.appendChild(itemDescription);
            slotElement.appendChild(unequipButton);

            // Add rarity class to the equipped item
            if (equippedItem.rarity) {
                const rarityClass = equippedItem.rarity.toLowerCase(); // Ensure class names are lowercase
                slotElement.parentElement.classList.add(rarityClass);
            }

            // Extract and sum up the stat boost from the item description
            const boostMatch = equippedItem.description.match(/\+[\D]*([\d]+)/);
            if (boostMatch) {
                totalBoost += parseInt(boostMatch[1], 10);
            }
        } else {
            slotElement.innerText = 'No item equipped';
        }
    });

    // Set player income to base value before recalculating total boost
    playerData.playerIncome = playerData.baseIncome + totalBoost;

    // Display the total stat boosts
    const summaryElement = document.getElementById('equipped-items-summary');
    summaryElement.innerText = `Total Boost: +${totalBoost}`;

    savePlayerData();
}

// Function to unequip an item
function unequipItem(slot) {
    const equippedItem = playerData.playerEquipped[slot];
    if (equippedItem) {
        // Remove the item from the equipped slot
        playerData.playerEquipped[slot] = null;

        // Recalculate the player income without the unequipped item's boost
        renderEquippedItems();

        // Optionally, you can log the action or handle additional logic if needed
        console.log(`Unequipped: ${equippedItem.name} from ${slot}`);
    }
}

// Example base income initialization
playerData.baseIncome = 1 // or set this to your game's base income value
