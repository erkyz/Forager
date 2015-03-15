var listApp = angular.module('listApp', ['ui.tree']); 

function newView() {
  // Get the current task from the background page.
  chrome.runtime.sendMessage({newVisual: true}, function(response) {
    console.log(response.farewell);
  });
}
newView();

listApp.controller('MainCtrl', ['$scope', 'listApp', function ($scope, listApp) {
  pageDB.open(listApp.refreshVisual);

  pageDB.open(listApp.refreshVisual);
  taskDB.open(listApp.refreshTaskVisual);
  task = "default";

  shortcut.add("Right", function() {
    window.open("/assets/html/visual2.html","_self");   
  });

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.newTab == true) {   //from content.js
        listApp.refreshVisual();

        list = [];
        $scope.list = [];
        pageDB.fetchTabs(function(tabs) {
          for(var i = 0; i < tabs.length; i++) {
            // Read the tab items backwards (most recent first).
            var tab = tabs[tabs.length - i - 1];

            if (tab.task == task) {
              var title = tab.title;
              if (title.length == 0) title = "Untitled";
              else if (title.length > 65) title = title.substring(0,64) + "... ";
            var obj = {};
            obj.title = title;
            obj.task = task;
            obj.id = tab.timestamp;
            obj.items = [];
            obj.url = tab.url;
            $scope.list.push(obj);
            $scope.$apply();
            }
          }
        });
      } else if (request.newTask) {   //from popup.js
        task = request.task;
        listApp.refreshVisual();
        listApp.refreshTaskVisual();
      } else if (request.currentTask) { //newVisual from me
        task = request.task;
        listApp.refreshVisual();
        listApp.refreshTaskVisual();

        list = [];
        $scope.list = [];
        pageDB.fetchTabs(function(tabs) {
          for(var i = 0; i < tabs.length; i++) {
            // Read the tab items backwards (most recent first).
            var tab = tabs[tabs.length - i - 1];

            if (tab.task == task) {
              var title = tab.title;
              if (title.length == 0) title = "Untitled";
              else if (title.length > 65) title = title.substring(0,64) + "... ";
            var obj = {};
            obj.title = title;
            obj.task = task;
            obj.id = tab.timestamp;
            obj.items = [];
            obj.url = tab.url;
            $scope.list.push(obj);
            $scope.$apply();
            }
          }
        });
      }
    });


  //some of the task stuff is messed up now.
    
  $scope.selectedItem = {};

  $scope.options = {
    dropped: function(event) {
      var start = event.source.index;
      var end = event.dest.index;
      var dest = event.dest.nodesScope.$modelValue;
      if (Math.abs(start-end) == 1) {
        pageDB.swapId(dest[end].id,dest[start].id, function() {});
      } else if (start < end) {
        for (var i = end; i > start; i--) {
            pageDB.swapId(dest[i].id,dest[start].id, function() {});
        }
      } else {
        for (var i = end; i < start; i++) {
            pageDB.swapId(dest[i].id,dest[end].id, function() {});
        }
      }
    }
  };

  $scope.remove = function(scope) {
        var nodeData = scope.$modelValue;
      alert(JSON.stringify(scope.$modelValue));

    pageDB.deleteTab(id, newView);
    scope.remove();
  };

  $scope.toggle = function(scope) {
    scope.toggle();
  };

  $scope.newSubItem = function(scope) {
    window.open(scope.$modelValue.url, "_self");

    nodeData.items.push({
      id: nodeData.id * 10 + nodeData.items.length,
      title: nodeData.title + '.' + (nodeData.items.length + 1),
      items: []
    });
  };     

  // listApp.linkList($scope.list);

}]);


listApp.factory('listApp', function() {
  var _list = [];

  return {

  // Update the list of todo items.
  refreshVisual: function refreshVisual() {
    pageDB.fetchTabs(function(tabs) {
      document.getElementById('currentTask').innerHTML = "My current task: " + task;

      // var tabList1 = document.getElementById('high-priority');
      // tabList1.innerHTML = '';
      var tabList2 = document.getElementById('medium-priority');
      tabList2.innerHTML = '';
      var tabList3 = document.getElementById('low-priority');
      tabList3.innerHTML = '';

      var allTabs = JSON.stringify(tabs);

      // taken from 
      // http://stackoverflow.com/questions/20104552/javascript-export-
      // in-json-and-download-it-as-text-file-by-clicking-a-button
      var save = document.getElementById("export");
      save.download = "JSONexport.txt";
      save.href = "data:text/plain;base64," + btoa(unescape(encodeURIComponent(allTabs)));
      save.innerHTML = "Export your data here.";

      for(var i = 0; i < tabs.length; i++) {
        // Read the tab items backwards (most recent first).
        var tab = tabs[tabs.length - i - 1];

        if (tab.task == task) {
          var a = document.createElement('a');
          // if (tab.importance == 1) a.id = 'tabone-' + tab.timestamp;
          if (tab.importance == 2) a.id = 'tabtwo-' + tab.timestamp;
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

          // if (tab.importance == 1) tabList1.appendChild(a);
          if (tab.importance == 2) tabList2.appendChild(a);
          else if (tab.importance == 3) tabList3.appendChild(a);

          x.addEventListener('click', function(e) {
            var id = parseInt(e.target.getAttribute('data-id'));
            pageDB.deleteTab(id, refreshVisual);
          });
        }
      }

    });
  },

  refreshTaskVisual: function refreshTaskVisual() {
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
          taskDB.deleteTask(id, refreshTaskVisual);
        });
      }
    });
  },

  linkList: function(list) {_list = list; }

  }
});