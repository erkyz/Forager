// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    // // Handle the bookmark form submit event
    document.getElementById('newSearch').addEventListener('submit', function() {
      var text = document.getElementById('query').value;
      //open new Wikipedia window
      chrome.windows.create({'url': 'https://www.google.com/search?q=' + text, 
      'focused': true}, function(window) {} );
    });

    tabDB.open(refreshTabs);

    // Get references to the form elements.
    var newTabForm = document.getElementById('newSearch');
    var newTabInput = document.getElementById('query');

    // Handle new todo item form submissions.
    newTabForm.onsubmit = function() {
      // Get the todo text.
      var text = newTabInput.value;

      // Check to make sure the text is not blank (or just spaces).
      if (text.replace(/ /g,'') != '') {
        // Create the todo item.
        tabDB.createTab(text, function(tab) {
          refreshTabs();
        });
      }

      // Reset the input field.
      newTabInput.value = '';

      // Don't send the form.
      return false;
    };
});

// Update the list of todo items.
function refreshTabs() {  
  tabDB.fetchTabs(function(tabs) {
    var tabList = document.getElementById('tab-items');
    tabList.innerHTML = '';

    for(var i = 0; i < tabs.length; i++) {
      // Read the tab items backwards (most recent first).
      var tab = tabs[(tabs.length - 1 - i)];

      var a = document.createElement('a');
      a.id = 'tab-' + tab.timestamp;
      a.className = "list-group-item";
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "tab-checkbox";
      checkbox.setAttribute("data-id", tab.timestamp);

      a.appendChild(checkbox);

      var span = document.createElement('span');
      span.innerHTML = tab.text;

      a.appendChild(span);

      tabList.appendChild(a);

      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        tabDB.deleteTab(id, refreshTabs);
      });
    }

  });
}
