document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && Telegram.WebApp) {
      Telegram.WebApp.ready();
      console.log('Telegram Web App initialized');
      Telegram.WebApp.expand(); // Expand the web app to full height
    }
  
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
      const touch = touches[0];
  
      const rect = coinImage.getBoundingClientRect();
      const x = touch.clientX - rect.left - rect.width / 2;
      const y = touch.clientY - rect.top - rect.height / 2;
  
      // Add the 3D perspective animation
      coinImage.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
      setTimeout(() => {
        coinImage.style.transform = '';
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
  });
  