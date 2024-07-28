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

            slotElement.appendChild(itemImage);
            slotElement.appendChild(itemName);
            slotElement.appendChild(itemDescription);

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

    // Display the total stat boosts
    const summaryElement = document.getElementById('equipped-items-summary');
    summaryElement.innerText = `Total Boost: +${totalBoost}`;
}
