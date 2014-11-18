// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    // Handle the bookmark form submit event
    document.getElementById('newSearch').addEventListener('submit', function() {
      var text = document.getElementById('query').value;
      //open new Google window
      chrome.windows.create({'url': 'https://www.google.com/search?q=' + text, 
      'focused': true}, function(window) {} );
    });

    // //add to list
    // chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    //   var tabList = document.getElementById('high-priority');
    //   tabList.innerHTML = '';

    //   var a = document.createElement('a');
    //   a.className = "list-group-item";
    //   var checkbox = document.createElement('input');
    //   checkbox.type = "checkbox";
    //   checkbox.className = "tab-checkbox";
    //   // checkbox.setAttribute("data-id", tab.timestamp);

    //   a.appendChild(checkbox);

    //   var span = document.createElement('span');
    //   span.innerHTML = tab.text;

    //   a.appendChild(span);

    //   tabList.appendChild(a);
    // });


    //IndexedDB stuff

    titleDB.open(refreshTabs);

    // // Get references to the form elements.
    // var newTabForm = document.getElementById('newSearch');
    // var newTabInput = document.getElementById('query');

    // // Handle new todo item form submissions.
    // newTabForm.onsubmit = function() {
    //   // Get the todo text.
    //   var text = newTabInput.value;
    //   var priority = 1;

    //   // Check to make sure the text is not blank (or just spaces).
    //   if (text.replace(/ /g,'') != '') {
    //     // Create the todo item.
    //     titleDB.createTab(text, 1, function(tab) {
    //       refreshTabs();
    //     });
    //   }

    //   // Reset the input field.
    //   newTabInput.value = '';

    //   // Don't send the form.
    //   return false;
    // };
});

// Update the list of todo items.
function refreshTabs() {  
  titleDB.fetchTabs(function(tabs) {
    var tabList1 = document.getElementById('high-priority');
    tabList1.innerHTML = '';
    var tabList2 = document.getElementById('medium-priority');
    tabList2.innerHTML = '';
    var tabList3 = document.getElementById('low-priority');
    tabList3.innerHTML = '';

    for(var i = 0; i < tabs.length; i++) {
      // Read the tab items backwards (most recent first).
      var tab = tabs[tabs.length - i - 1];

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

      if (tab.importance == 1) tabList1.appendChild(a);
      else if (tab.importance == 2) tabList2.appendChild(a);
      else if (tab.importance == 3) tabList3  .appendChild(a);

      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        titleDB.deleteTab(id, refreshTabs);
      });
    }

  });
}
