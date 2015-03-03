// When the HTML has loaded
window.addEventListener('load', function(evt) {
    pageDB.open(refreshVisual);
    taskDB.open(refreshTabVisual);

    task = "default";

    shortcut.add("Right", function() {
      window.open("/assets/html/visual2.html","_self");   
    });

    // Get the current task from the background page.
    chrome.runtime.sendMessage({newVisual: true}, function(response) {
      console.log(response.farewell);
    });

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.currentTask) {     //newVisual
          task = request.task;
          refreshVisual();
          refreshTabVisual();
        }
      });

    chrome.runtime.sendMessage({newVisual: true}, function(response) {
      console.log(response.farewell);
    });

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.newTab == true) {   //from content.js
          refreshVisual();
        } else if (request.newTask) {   //from popup.js
          task = request.task;
          refreshVisual();
          refreshTabVisual();
        } else if (request.currentTask) { //newVisual from me
          task = request.task;
          refreshVisual();
          refreshTabVisual();
        }
      });
});

listApp = angular.module('listApp', ['ui.tree']);
listApp.controller('MainCtrl', function ($scope) {
    $scope.list = [{
      "id": 1,
      "title": "1. dragon-breath",
      "items": []
    }, {
      "id": 2,
      "title": "2. moiré-vision",
      "items": [{
        "id": 21,
        "title": "2.1. tofu-animation",
        "items": [{
          "id": 211,
          "title": "2.1.1. spooky-giraffe",
          "items": []
        }, {
          "id": 212,
          "title": "2.1.2. bubble-burst",
          "items": []
        }],
      }, {
        "id": 22,
        "title": "2.2. barehand-atomsplitting",
        "items": []
      }],
    }, {
      "id": 3,
      "title": "3. unicorn-zapper",
      "items": []
    }, {
      "id": 4,
      "title": "4. romantic-transclusion",
      "items": []
    }];

    $scope.selectedItem = {};

    $scope.options = {
    };

    $scope.remove = function(scope) {
      scope.remove();
    };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    $scope.newSubItem = function(scope) {
      var nodeData = scope.$modelValue;
      nodeData.items.push({
        id: nodeData.id * 10 + nodeData.items.length,
        title: nodeData.title + '.' + (nodeData.items.length + 1),
        items: []
      });
    };
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

    var allTabs = JSON.stringify(tabs);

    // taken from 
    // http://stackoverflow.com/questions/20104552/javascript-export-in-json-and-download-it-as-text-file-by-clicking-a-button
    var save = document.getElementById("export");
    save.download = "JSONexport.txt";
    save.href = "data:text/plain;base64," + btoa(unescape(encodeURIComponent(allTabs)));
    save.innerHTML = "Export your data here.";

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
        info.target = "_self";
        info.style = "word-wrap: break-word;"

        a.appendChild(info);
        // a.setAttribute("style","width:85%; word-wrap:break-word;")

        var space = document.createElement('span')
        space.innerHTML = '&nbsp;&nbsp;'

        a.appendChild(space);

        var x = document.createElement('button');
        x.setAttribute("class", 'close');
        x.innerHTML = 'x';
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

function refreshTabVisual() {
    taskDB.fetchTasks(function(tasks) {

    var taskList = document.getElementById('tasklist');
    taskList.innerHTML = '';

    // Sort tasks by counts (max to min) using an anonymous function!
    tasks.sort(function(a,b) {
      return b.count-a.count;
    });

    var firstTask = ""; var secondTask = ""; var thirdTask = "";
    var fourthTask = ""; var fifthTask = ""; var sixthTask = "";
    var seventhTask = ""; var eighthTask = ""; var ninthTask = "";

    if (tasks.length >= 1) firstTask = tasks[0].task;
    if (tasks.length >= 2) secondTask = tasks[1].task;
    if (tasks.length >= 3) thirdTask = tasks[2].task;
    if (tasks.length >= 4) fourthTask = tasks[3].task;
    if (tasks.length >= 5) fifthTask = tasks[4].task;
    if (tasks.length >= 6) sixthTask = tasks[5].task;
    if (tasks.length >= 7) seventhTask = tasks[6].task;
    if (tasks.length >= 8) eighthTask = tasks[7].task;
    if (tasks.length >= 9) ninthTask = tasks[8].task;

    for(var i = 0; i < tasks.length; i++) {
      var tsk = tasks[i];

      var a = document.createElement('a');
      a.className = "list-group-item";

      var info = document.createElement('a');
      var title = tsk.task;
      info.id = title; //should be unique.
      if(title.length > 15) {
          title = title.substring(0,14) + "... ";
      }
      info.innerHTML = (i+1).toString() + ". " + title;
      info.setAttribute('data-id',tsk.timestamp)
      info.target = "_blank";
      
      //add onclick to change current task to the clicked task
      info.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        //increment counter for this task
        taskDB.incrementCount(id, function() {
          chrome.runtime.sendMessage(
            {newTask: true, task: e.target.getAttribute('id')},
            function() {});
          chrome.runtime.sendMessage({newVisual: true}, function(response) {
            console.log(response.farewell);
          });
        });
      });

      a.appendChild(info);

      var space = document.createElement('span')
      space.innerHTML = '&nbsp;&nbsp;'

      a.appendChild(space);

      var x = document.createElement('button');
      x.setAttribute("class", 'close');
      x.innerHTML = 'x';
      x.setAttribute("data-id", tsk.timestamp);

      a.appendChild(x);

      taskList.appendChild(a);

      x.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));
        taskDB.deleteTask(id, refreshTabVisual);
      });
    }
  });
}
