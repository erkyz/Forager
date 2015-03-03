// When the HTML has loaded
window.addEventListener('load', function(evt) {
    pageDB.open(refreshVisual);

    var myAppModule = angular.module('MyApp', ['ui.tree']);
});

chrome.runtime.sendMessage({newVisual: true}, function(response) {
      console.log(response.farewell);
});

task = "default";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.newTab == true) {   //from content.js
      refreshVisual();
    } else if (request.newTask) {   //from popup.js
      task = request.task;
      refreshVisual();
    } else if (request.currentTask) { //newVisual from me
      task = request.task;
      refreshVisual();
    }
  });

// Update the list of todo items.
function refreshVisual() {  
  pageDB.fetchTabs(function(tabs) {
    document.getElementById('currentTask').innerHTML = "My current task: " + task;

    var tabList1 = document.getElementById('high-priority');
    tabList1.innerHTML = '';
    var tabList2 = document.getElementById('medium-priority');
    tabList2.innerHTML = '';
    var tabList3 = document.getElementById('low-priority');
    tabList3.innerHTML = '';

    for(var i = 0; i < tabs.length; i++) {
      // Read the tab items backwards (most recent first).
      var tab = tabs[tabs.length - i - 1];

      if (tab.task == task) {
        var a = document.createElement('a');
        if (tab.importance == 1) a.id = 'tabone-' + tab.timestamp;
        else if (tab.importance == 2) a.id = 'tabtwo-' + tab.timestamp;
        else if (tab.importance == 3) a.id = 'tabthree-' + tab.timestamp;
        a.className = "list-group-item";

        var info = document.createElement('a');
        var title = tab.title;
        var tabTask = tab.task;
        if (title.length == 0) title = "Untitled";
        else if (title.length > 65) title = title.substring(0,64) + "... ";
        info.innerHTML = title;
        info.href = tab.url;
        info.target = "_blank";

        a.appendChild(info);

        var space = document.createElement('span')
        space.innerHTML = '&nbsp;&nbsp;'

        a.appendChild(space);

        var x = document.createElement('button');
        x.setAttribute("class", 'close');
        x.innerHTML = 'Delete';
        x.setAttribute("data-id", tab.timestamp);

        a.appendChild(x);

        if (tab.importance == 1) tabList1.appendChild(a);
        else if (tab.importance == 2) tabList2.appendChild(a);
        else if (tab.importance == 3) tabList3.appendChild(a);

        x.addEventListener('click', function(e) {
          var id = parseInt(e.target.getAttribute('data-id'));
          pageDB.deleteTab(id, refreshVisual);
        });
      }
    }

  });
}