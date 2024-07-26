document.addEventListener("DOMContentLoaded", () => {
  const footerItems = document.querySelectorAll(".footer-item");
  const tabContents = document.querySelectorAll(".tab-content");

  // Function to hide all tabs
  function hideAllTabs() {
      tabContents.forEach(tab => {
          tab.style.display = "none";
      });
  }

  // Function to show the selected tab
  function showTab(tabId) {
      hideAllTabs();
      const selectedTab = document.getElementById(tabId);
      if (selectedTab) {
          selectedTab.style.display = "flex"; // Change to "flex" for proper centering
      }
  }

  // Add click event listeners to footer items
  footerItems.forEach(item => {
      item.addEventListener("click", () => {
          const tabId = item.getAttribute("data-tab");
          showTab(tabId);
      });
  });

  // Initialize by showing the first tab
  hideAllTabs();
  showTab("tab1"); // Show the first tab by default
});
