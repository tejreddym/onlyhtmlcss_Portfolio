/**
 * Floating Action Menu (FAB) Toggle
 * Handles opening/closing of quick action menu
 */

document.addEventListener('DOMContentLoaded', function() {
  const fabToggle = document.querySelector('.fab-toggle');
  const fabMenu = document.querySelector('.fab-menu');
  
  if (fabToggle && fabMenu) {
    fabToggle.addEventListener('click', function() {
      fabToggle.classList.toggle('active');
      fabMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.floating-action-menu')) {
        fabToggle.classList.remove('active');
        fabMenu.classList.remove('active');
      }
    });
    
    // Close menu when clicking a link
    const fabItems = document.querySelectorAll('.fab-item');
    fabItems.forEach(item => {
      item.addEventListener('click', function() {
        fabToggle.classList.remove('active');
        fabMenu.classList.remove('active');
      });
    });
  }
});
