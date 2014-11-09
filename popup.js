// Run script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  //newSearch();
});

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    // Handle the bookmark form submit event
    document.getElementById('newSearch').addEventListener('submit', function() {
      var text = document.getElementById('query').value;
      //open new Wikipedia window
      chrome.windows.create({'url': 'https://www.google.com/search?q=' + text, 
      'focused': true}, function(window) {} );
    });
});

function searchGoogle() {
  chrome.windows.create({'url': 'https://www.google.com/', 
    'focused': true}, function(window) {} );
}