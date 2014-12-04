// When page has loaded
window.addEventListener('load', function(evt) {
    pageDB.open(refreshTabs);
});

// Refresh page once a second
window.setInterval(function(){
    pageDB.open(refreshTabs);
}, 2500);

// Update the list of todo items.
function refreshTabs() {  
  pageDB.fetchTabs(function(tabs) {
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
      if (tab.importance == 1) a.id = 'tabone-' + tab.timestamp;
      else if (tab.importance == 2) a.id = 'tabtwo-' + tab.timestamp;
      else if (tab.importance == 3) a.id = 'tabthree-' + tab.timestamp;
      
      a.className = "list-group-item";
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "tab-checkbox";
      checkbox.setAttribute("data-id", tab.timestamp);

      a.appendChild(checkbox);

      var span = document.createElement('span');
      span.innerHTML = tab.highlighted;

      a.appendChild(span);

      if (tab.importance == 1) tabList1.appendChild(a);
      else if (tab.importance == 2) tabList2.appendChild(a);
      else if (tab.importance == 3) tabList3  .appendChild(a);

      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        pageDB.deleteTab(id, refreshTabs);
      });
    }

  });
}
