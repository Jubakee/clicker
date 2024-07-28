document.addEventListener("DOMContentLoaded", () => {
    const shopItems = document.querySelectorAll(".shop-item");

    shopItems.forEach(item => {
        const rarity = item.getAttribute("data-item-rarity").toLowerCase();
        item.classList.add(rarity);
    });

    const buyButtons = document.querySelectorAll(".buy-button");

    buyButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const shopItem = event.target.closest(".shop-item");
            const itemId = shopItem.getAttribute("data-item-id");
            const itemName = shopItem.querySelector("h3").innerText;
            const itemDescription = shopItem.querySelector(".item-description").innerText; // Get item description
            const itemImage = shopItem.querySelector(".shop-image").src; // Get item image
            
            // Select the price element and format it
            const itemPriceText = shopItem.querySelector(".item-price").innerText;
            const itemPrice = parseFloat(itemPriceText.replace(/[^0-9.-]+/g, "")); // Remove currency symbol and commas

            // Define additional properties for the inventory item
            const itemType = shopItem.getAttribute("data-item-type") || "Unknown";
            const itemRarity = shopItem.getAttribute("data-item-rarity") || "Common";
            const itemRequirement = shopItem.getAttribute("data-item-requirement") || "None";
            const itemRequirementLevel = parseInt(itemRequirement.replace(/[^0-9]/g, ""), 10); // Extract numeric level requirement
            
            const itemIsOpened = shopItem.getAttribute("data-item-opened") || "false";
            // Check player level
            if (playerData.playerLevel < itemRequirementLevel) {
                alert(`You need to be at least level ${itemRequirementLevel} to purchase ${itemName}.`);
                console.log(`Player level too low to purchase ${itemName}. Required: ${itemRequirementLevel}, Current: ${playerData.playerLevel}`);
                return;
            }

            // Check player coin balance
            if (playerData.playerBalance >= itemPrice) {
                // Show confirmation popup
                const confirmation = confirm(`Are you sure you want to purchase ${itemName} for 💵 ${itemPrice.toLocaleString()}?`);
                
                if (confirmation) {
                    playerData.playerBalance -= itemPrice; // Deduct the price from player balance

                    // Find the first empty slot in the inventory
                    const emptySlotIndex = playerData.inventory.findIndex(slot => slot === null);

                    if (emptySlotIndex !== -1) {
                        // Add the purchased item to the inventory
                        playerData.inventory[emptySlotIndex] = {
                            inventoryId: emptySlotIndex + 1, // Use slot index + 1 as inventoryId
                            name: itemName,
                            description: itemDescription,
                            image: itemImage,
                            type: itemType,
                            rarity: itemRarity,
                            datePurchased: new Date().toISOString(),
                            requirement: itemRequirement,
                            isOpened: itemIsOpened
                        };

                        savePlayerData(); // Save updated player data
                        console.log(`You purchased ${itemName} for 💵 ${itemPrice.toLocaleString()}.`);
                        alert(`You successfully purchased ${itemName}!`);
                        updateGameUI(); // Update UI to reflect new balance

                        // For test purposes, log the inventory
                        console.log("Current Inventory:", playerData.inventory);
                    } else {
                        alert(`Your inventory is full!`);
                        console.log(`Inventory is full. Cannot purchase ${itemName}.`);
                    }
                } else {
                    alert(`Purchase of ${itemName} was canceled.`);
                }
            } else {
                alert(`You do not have enough coins to purchase ${itemName}.`);
                console.log(`Not enough coins to purchase ${itemName}.`);
            }
        });
    });
});
