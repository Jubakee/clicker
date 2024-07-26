const coinContainer = document.querySelector('.coin-container');
const coinImage = document.querySelector('.coin-image');

let coinsPerClick = 1; // Coins earned per click
const feedbackQueue = [];

// Function to create feedback for the user
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

    // Remove the feedback element after a set duration
    setTimeout(() => {
        feedback.remove(); // Remove without fading
    }, 600); // Duration to match the animation
}

// Function to handle coin click/touch events
function coinClicked(event) {
    event.preventDefault();
    
    const touches = event.touches || [{ clientX: event.clientX, clientY: event.clientY }];
    
    // Add the clicked class for image animation
    coinImage.classList.add('clicked');

    // Remove the clicked class after the animation duration
    setTimeout(() => {
        coinImage.classList.remove('clicked');
    }, 100); // Duration to match the CSS transition

    batchFeedback(touches, coinsPerClick); // Handle feedback animations
}

// Function to batch feedback for multiple touches
function batchFeedback(touches, amount) {
    for (const touch of touches) {
        feedbackQueue.push({ x: touch.clientX, y: touch.clientY, amount });
    }

    if (feedbackQueue.length === 0) return;

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
        const feedbacks = feedbackQueue.splice(0, feedbackQueue.length); // Clear the queue
        feedbacks.forEach(feedback => {
            createFeedback(feedback.x, feedback.y, feedback.amount);
        });
    });
}

// Event listeners for touch and click interactions
coinContainer.addEventListener('touchstart', coinClicked);
coinContainer.addEventListener('click', coinClicked);
