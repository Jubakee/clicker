
const coinContainer = document.querySelector('.coin-container');
const coinImage = document.querySelector('.coin-image');

let coinsPerClick = 1; // Coins earned per click
const feedbackQueue = [];



// Function to handle feedback creation
function createFeedback(x, y, amount) {
    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    feedback.innerText = `💵`; // Display the amount of coins
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

    // Add the clicked class for animation
    coinImage.classList.add('clicked');

    // Remove the clicked class after the animation duration
    setTimeout(() => {
        coinImage.classList.remove('clicked');
    }, 100); // Match the CSS transition duration
     
    batchFeedback(touches, coinsPerClick); // Batch feedback animations
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

    
    document.addEventListener('DOMContentLoaded', () => {
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.init();
            Telegram.WebApp.onEvent('init', () => {
              console.log('Telegram Web App initialized');
              Telegram.WebApp.expand(); // Expand the web app to full height
            });
        
            // Set the tgWebAppVersion
            Telegram.WebApp.initParams = {
              tgWebAppVersion: "7.7"
            };
          }

});