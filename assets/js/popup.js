// When the HTML has loaded
window.addEventListener('load', function(evt) {
    taskDB.open(refreshVisual);

    chrome.runtime.sendMessage({newVisual: true}, function(response) {
      console.log(response.farewell);
    });

    currentTask = "default";
    newTabForm = document.getElementById('newSearch');
    newTabInput = document.getElementById('query');

    // Handle new todo item form submissions.
    newTabForm.onsubmit = function() {
      // Get the task
      var text = newTabInput.value;
      chrome.runtime.sendMessage({newTask: true, task: text}, function(response) {
        console.log(response.farewell);
      });
      taskDB.createTask(text, function() {
        window.close();
      });
    };

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.currentTask) {     //newVisual
          currentTask = request.task;
          refreshVisual();
        }
      });
});


// Update the list of todo items.
function refreshVisual() {
  taskDB.fetchTasks(function(tasks) {
    document.getElementById('query').placeholder = "Current task: " + currentTask;

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
          window.close();
        });
      });

      a.appendChild(info);

      var space = document.createElement('span')
      space.innerHTML = '&nbsp;&nbsp;'

      a.appendChild(space);

      var x = document.createElement('button');
      x.setAttribute("class", 'close');
      x.innerHTML = 'Delete';
      x.setAttribute("data-id", tsk.timestamp);

      a.appendChild(x);

      taskList.appendChild(a);

      x.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));
        taskDB.deleteTask(id, refreshVisual);
      });

    }

    // Keyboard shortcuts (1,2,3,...) to switch tasks

    shortcut.add("Meta+1", function() {
      //change current task to this task
      if (firstTask != "") document.getElementById(firstTask).click();    });
    shortcut.add("Meta+2", function() {
      if (secondTask != "") document.getElementById(secondTask).click();    });
    shortcut.add("Meta+3", function() {
      if (thirdTask != "") document.getElementById(thirdTask).click();    }); 
    shortcut.add("Ctrl+1", function() {
      if (firstTask != "") document.getElementById(firstTask).click();    }); 
    shortcut.add("Ctrl+2", function() {
      if (secondTask != "") document.getElementById(secondTask).click();    });
    shortcut.add("Ctrl+3", function() {
      if (thirdTask != "") document.getElementById(thirdTask).click();    }); 
    shortcut.add("Meta+4", function() {
      if (firstTask != "") document.getElementById(fourthTask).click();    });
    shortcut.add("Meta+5", function() {
      if (secondTask != "") document.getElementById(fifthTask).click();    });
    shortcut.add("Meta+6", function() {
      if (thirdTask != "") document.getElementById(sixthTask).click();    }); 
    shortcut.add("Ctrl+4", function() {
      if (firstTask != "") document.getElementById(fourthTask).click();    }); 
    shortcut.add("Ctrl+5", function() {
      if (secondTask != "") document.getElementById(fifthTask).click();    });
    shortcut.add("Ctrl+6", function() {
      if (thirdTask != "") document.getElementById(sixthTask).click();    }); 
    shortcut.add("Meta+7", function() {
      if (firstTask != "") document.getElementById(seventhTask).click();    });
    shortcut.add("Meta+8", function() {
      if (secondTask != "") document.getElementById(eighthTask).click();    });
    shortcut.add("Meta+9", function() {
      if (thirdTask != "") document.getElementById(ninthTask).click();    }); 
    shortcut.add("Ctrl+7", function() {
      if (firstTask != "") document.getElementById(seventhTask).click();    }); 
    shortcut.add("Ctrl+8", function() {
      if (secondTask != "") document.getElementById(eighthTask).click();    });
    shortcut.add("Ctrl+9", function() {
      if (thirdTask != "") document.getElementById(ninthTask).click();    }); 
  });
}