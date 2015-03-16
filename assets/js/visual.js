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

        $scope.tree1 = [];
        $scope.tree2 = [];
        $scope.tree3 = [];
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
              if (tab.importance == 1) $scope.tree1.push(obj);
              else if (tab.importance == 2) $scope.tree2.push(obj);
              else $scope.tree3.push(obj);
              $scope.$digest();  
            }
          }
        });
        if (Array.isArray($scope.tree3)) $scope.tree1 = [{title:"Nothing here yet.",items:[]}];
        if (Array.isArray($scope.tree3)) $scope.tree2 = [{title:"Nothing here yet.",items:[]}];
        if (Array.isArray($scope.tree3)) $scope.tree3 = [{title:"Nothing here yet.",items:[]}];
        $scope.$apply();

      } else if (request.newTask) {   //from popup.js
        task = request.task;
        listApp.refreshVisual();
        listApp.refreshTaskVisual();
      } else if (request.currentTask) { //newVisual from me
        task = request.task;
        listApp.refreshVisual();
        listApp.refreshTaskVisual();

        $scope.tree1 = [];
        $scope.tree2 = [];
        $scope.tree3 = [];
        pageDB.fetchTabs(function(tabs) {
          for(var i = 0; i < tabs.length; i++) {
            // Read the tab items backwards (most recent first).
            var tab = tabs[tabs.length - i - 1];

            if (tab.task == task) {
              var title = tab.title;
              if (title == undefined || title.length == 0) title = "Untitled";
              else if (title.length > 65) title = title.substring(0,64) + "... ";
              var obj = {};
              obj.title = title;
              obj.task = task;
              obj.id = tab.timestamp;
              obj.items = [];
              obj.url = tab.url;
              if (tab.importance == 1) $scope.tree1.push(obj);
              else if (tab.importance == 2) $scope.tree2.push(obj);
              else $scope.tree3.push(obj);   
              $scope.$digest();   
            }
          }
          
        });
        if ($scope.tree1 === []) $scope.tree1 = [{title:"Nothing here yet.",items:[]}];
        if ($scope.tree2 === []) $scope.tree2 = [{title:"Nothing here yet.",items:[]}];
        if ($scope.tree3 === []) $scope.tree3 = [{title:"Nothing here yet.",items:[]}];
        $scope.$apply();
        // $scope.tree3 = [{title:"Nothing here yet.",items:[]}];
      }
    });


  //some of the task stuff is messed up now.
    
  $scope.selectedItem = {};

  $scope.options = {
    dropped: function(event) {
      var start = event.source.index;
      var end = event.dest.index;
      var dest = event.dest.nodesScope.$modelValue;
      // Update pageDB order
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

  $scope.rm = function(scope) {
    var nodeData = scope.$modelValue;
    pageDB.deleteTab(scope.$modelValue.id, newView);
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

}]);


listApp.factory('listApp', function() {
  var _list = [];

  return {

  // Update the list of todo items.
  refreshVisual: function refreshVisual() {
    pageDB.fetchTabs(function(tabs) {
      document.getElementById('currentTask').innerHTML = "My current task: " + task;

      var allTabs = JSON.stringify(tabs);

      // taken from 
      // http://stackoverflow.com/questions/20104552/javascript-export-
      // in-json-and-download-it-as-text-file-by-clicking-a-button
      var save = document.getElementById("export");
      save.download = "JSONexport.txt";
      save.href = "data:text/plain;base64," + btoa(unescape(encodeURIComponent(allTabs)));
      save.innerHTML = "Export your data here.";

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