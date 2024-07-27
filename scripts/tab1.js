const coinContainer = document.querySelector('.coin-container');
const coinImage = document.querySelector('.coin-image');

let coinsPerClick = playerData.playerPerClick; // Coins earned per click based on player data
const feedbackQueue = [];


// Function to handle feedback creation
function createFeedback(x, y, amount) {
    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    feedback.innerText = `+${amount}`; // Display the amount of coins
    feedback.style.left = `${x}px`;
    feedback.style.top = `${y}px`;
    document.body.appendChild(feedback);

    // Trigger feedback animation
    requestAnimationFrame(() => {
        feedback.classList.add('show');
    });

    // Remove the feedback element after animation
    setTimeout(() => {
        feedback.remove(); // Remove without fading
    }, 600); // Match the duration of the animation
}

// Touch event listener
coinContainer.addEventListener('touchstart', (event) => {
    coinClicked(event);
    event.preventDefault();
}, { passive: false });

// Click event listener for testing
coinContainer.addEventListener('click', (event) => {
    coinClicked(event);
});

function coinClicked(event) {
    event.preventDefault();
    const touches = event.touches || [{ clientX: event.clientX, clientY: event.clientY }];

    // Check if the player has enough energy
    if (playerData.playerEnergy > 0) {
        // Add the clicked class for animation
        coinImage.classList.add('clicked');

        // Remove the clicked class after the animation duration
        setTimeout(() => {
            coinImage.classList.remove('clicked');
        }, 100); // Match the CSS transition duration

        // Update player balance based on coinsPerClick from playerData
        playerData.playerBalance += coinsPerClick; // Increase balance by coinsPerClick
        playerData.playerEnergy -= 1; // Decrease energy by 1

        // Update playerLvlEXP based on the coins earned
        playerData.playerLvlEXP += coinsPerClick; // Accumulate coins for level EXP
        
        updateGameUI(); // Update the UI to reflect the new balance and energy
        savePlayerData(); // Save updated player data

        batchFeedback(touches, coinsPerClick); // Batch feedback animations
    } else {
        // Optionally, show a message when energy is not enough
        console.log("Not enough energy!");
    }
}



function batchFeedback(touches, amount) {
    for (const touch of touches) {
        feedbackQueue.push({ x: touch.clientX, y: touch.clientY, amount });
    }

    if (!feedbackQueue.length) return;

    requestAnimationFrame(() => {
        const feedbacks = feedbackQueue.splice(0, feedbackQueue.length); // Clear the queue
        feedbacks.forEach(feedback => {
            createFeedback(feedback.x, feedback.y, feedback.amount);
        });
    });
}


// Start a timer to replenish energy every second
// Start a timer to replenish energy every second
setInterval(() => {
    if (playerData.playerEnergy < 1000) { // Check if energy is less than max
        playerData.playerEnergy += 1; // Increase energy by 1
        updateEnergyBar(); // Update energy bar display
        playerData.lastEnergyUpdate = Date.now(); // Update the last energy update time
        savePlayerData(); // Save updated player data
    }
}, 1000); // Call this every 1000 ms (1 second)
