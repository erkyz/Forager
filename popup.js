// When the HTML has loaded
window.addEventListener('load', function(evt) {
    taskDB.open(refreshVisual);

    var newTabForm = document.getElementById('newSearch');
    var newTabInput = document.getElementById('query');

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
});

// Update the list of todo items.
function refreshVisual() {
  taskDB.fetchTasks(function(tasks) {
    var taskList = document.getElementById('tasklist');
    taskList.innerHTML = '';

    // Sort tasks by counts (max to min) using an anonymous function!
    tasks.sort(function(a,b) {
      return b.count - a.count;
    });

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
      info.innerHTML = title + " || " + tsk.count;
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

  });
}