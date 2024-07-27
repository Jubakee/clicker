document.addEventListener("DOMContentLoaded", () => {
  const footerItems = document.querySelectorAll(".footer-item");
  const tabContents = document.querySelectorAll(".tab-content");

  function hideAllTabs() {
    tabContents.forEach(tab => {
        tab.classList.remove("active"); // Use a class to manage visibility
    });
}

function showTab(tabId) {
    hideAllTabs();
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add("active");
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
