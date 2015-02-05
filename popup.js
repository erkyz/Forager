// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    pageDB.open();

    var newTabForm = document.getElementById('newSearch');
    var newTabInput = document.getElementById('query');

    // Handle new todo item form submissions.
    newTabForm.onsubmit = function() {
      // Get the task
      var text = newTabInput.value;
      chrome.runtime.sendMessage({newTask: true, task: text}, function(response) {
        console.log(response.farewell);
      });
      window.close();
    };
});