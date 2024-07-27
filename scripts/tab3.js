document.addEventListener("DOMContentLoaded", () => {
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

        // Check player coin balance
        if (playerData.playerBalance >= itemPrice) {
            // Show confirmation popup
            const confirmation = confirm(`Are you sure you want to purchase ${itemName} for 💵 ${itemPrice.toLocaleString()}?`);
            
            if (confirmation) {
                playerData.playerBalance -= itemPrice; // Deduct the price from player balance

                // Create inventoryId based on current inventory length (or any other logic)
                const inventoryId = playerData.purchasedItems.length + 1;

                // Add the purchased item to the inventory
                playerData.purchasedItems.push({
                    inventoryId,
                    name: itemName,
                    description: itemDescription,
                    image: itemImage
                });

                savePlayerData(); // Save updated player data
                console.log(`You purchased ${itemName} for 💵 ${itemPrice.toLocaleString()}.`);
                alert(`You successfully purchased ${itemName}!`);
                updateGameUI(); // Update UI to reflect new balance

                // For test purposes, log the inventory
                console.log("Current Inventory:", playerData.purchasedItems);
            } else {
                alert(`Purchase of ${itemName} was canceled.`);
            }
        } else {
            alert(`You do not have enough coins to purchase ${itemName}.`);
            console.log(`Not enough coins to purchase ${itemName}.`);
        }
    });
});})