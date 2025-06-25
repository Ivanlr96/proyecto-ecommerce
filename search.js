document.addEventListener('DOMContentLoaded', function() {
  const searchIcon = document.querySelector('.menu-search');
  const searchBar = document.querySelector('.search-bar');

const searchContainer = document.querySelector('.search');

  searchIcon.addEventListener('click', function() {
    searchBar.classList.toggle('active'); // Toggle the 'active' class
    if (searchBar.classList.contains('active')) {
      searchBar.focus(); // Focus on the search bar when it opens
    }
  });
  
  document.addEventListener('click', function(event) {
    if (!searchContainer.contains(event.target) && searchBar.classList.contains('active')) {
      searchBar.classList.remove('active');
      searchBar.value = '';
    }
  });
});