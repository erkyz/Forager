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
		}); 
   // chrome.browserAction.setIcon({path: 'SpeakSel16.png'});
}

function add2() {
	chrome.tabs.query({'currentWindow': true, 'active': true}, 
		function(tabs) {
			activeId = tabs[0].id;
			chrome.tabs.executeScript(
				activeId,
      		{file: 'content2.js'});
		}); 
   // chrome.browserAction.setIcon({path: 'SpeakSel16.png'});
}

function add3() {
	chrome.tabs.query({'currentWindow': true, 'active': true}, 
		function(tabs) {
			activeId = tabs[0].id;
			chrome.tabs.executeScript(
				activeId,
      		{file: 'content3.js'});
		}); 
   // chrome.browserAction.setIcon({path: 'SpeakSel16.png'});
}


function init() {
   //add listeners
	chrome.extension.onRequest.addListener(
      function(request, sender) {
         if (request['importance1']) {
            var title = request['title'];
            var url = request['url'];
		 	 	titleDB.open();
	         // Create the item.
	         titleDB.createTab(title, 1, function() {});
	         window.alert("Added! (Priority 1)");
			}
      });

	chrome.extension.onRequest.addListener(
      function(request, sender) {
         if (request['importance2']) {
            var title = request['title'];
            var url = request['url'];
	 		   titleDB.open();
	         // Create the item.
	         titleDB.createTab(title, 2, function() {});
	         window.alert("Added! (Priority 2)");
			}
      });

	chrome.extension.onRequest.addListener(
      function(request, sender) {
         if (request['importance3']) {
            var title = request['title'];
            var url = request['url'];
	 		   titleDB.open();
	         // Create the item.
	         titleDB.createTab(title, 3, function() {});
	         window.alert("Added! (Priority 3)");
			}
      });
}

init();
