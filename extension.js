function init() {
   //add listeners

   var task = "default";

	chrome.extension.onRequest.addListener(
      function(request, sender) {
         if (request['importance1']) {
            var title = request['title'];
            var url = request['url'];
            var highlighted = request['selected'];
		 	 	pageDB.open();
	         // Create the item.
	         // if (highlighted.replace(/ /g,'') != '') {
	         	pageDB.createTab(task, title, 1, highlighted, url, function() {});
	         	// window.alert("Added \"" + highlighted + "\" with high importance.");
	         // }
	         // else window.alert("Nothing to add.");
			} else if (request['importance2']) {
            var title = request['title'];
            var url = request['url'];
            var highlighted = request['selected'];
	 		   pageDB.open();
	         // Create the item
	         pageDB.createTab(task, title, 2, highlighted, url, function() {});
			} else if (request['importance3']) {
            var title = request['title'];
            var url = request['url'];
            var highlighted = request['selected'];
	 		   pageDB.open();
	         // Create the item.
	         pageDB.createTab(task, title, 3, highlighted, url, function() {});
			} else if (request['task']) {
				task = request['task'];
			}
      });
}

init();

chrome.commands.onCommand.addListener(function(command) {
  // Call 'update' with an empty properties object to get access to the current
  // tab (given to us in the callback function).
  chrome.tabs.update({}, function(tab) {
   if (command == 'add-importance-1')
      add1();
   else if (command == 'add-importance-2')
      add2();
   else if (command == 'add-importance-3')
      add3();
  });
});

function add1() {
	chrome.tabs.query({'currentWindow': true, 'active': true}, 
		function(tabs) {
			activeId = tabs[0].id;
			chrome.tabs.executeScript(
				activeId,
      		{file: 'content.js'});
			chrome.tabs.remove(activeId)
		}); 
}

function add2() {
	chrome.tabs.query({'currentWindow': true, 'active': true}, 
		function(tabs) {
			activeId = tabs[0].id;
			chrome.tabs.executeScript(
				activeId,
      		{file: 'content2.js'});
			chrome.tabs.remove(activeId)
		}); 
}

function add3() {
	chrome.tabs.query({'currentWindow': true, 'active': true}, 
		function(tabs) {
			activeId = tabs[0].id;
			chrome.tabs.executeScript(
				activeId,
      		{file: 'content3.js'});
			chrome.tabs.remove(activeId)
		}); 
}
