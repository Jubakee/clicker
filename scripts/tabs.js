document.addEventListener("DOMContentLoaded", () => {
    const footerItems = document.querySelectorAll(".footer-item");
    const tabContents = document.querySelectorAll(".tab-content");
  
    function hideAllTabs() {
      tabContents.forEach(tab => {
        tab.classList.remove("active"); // Use a class to manage visibility
      });
      footerItems.forEach(item => {
        item.querySelector('.footer-icon').classList.remove('active'); // Remove active class from all icons
      });
    }
  
    function showTab(tabId) {
      hideAllTabs();
      const selectedTab = document.getElementById(tabId);
      if (selectedTab) {
        selectedTab.classList.add("active");
        const activeFooterItem = Array.from(footerItems).find(item => item.getAttribute("data-tab") === tabId);
        if (activeFooterItem) {
          activeFooterItem.querySelector('.footer-icon').classList.add('active'); // Add active class to the corresponding icon
        }
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
  