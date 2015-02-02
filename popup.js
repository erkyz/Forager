// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    // document.getElementById('newTask').addEventListener('submit', function() {
    //   var text = document.getElementById('query').value;
    //   alert();
    // });

    //IndexedDB stuff
    pageDB.open();

    var newTabForm = document.getElementById('newSearch');
    var newTabInput = document.getElementById('query');

    // Handle new todo item form submissions.
    newTabForm.onsubmit = function() {
      // Get the todo text.
      var text = newTabInput.value;
      chrome.extension.sendRequest({"task": text});
    };
});