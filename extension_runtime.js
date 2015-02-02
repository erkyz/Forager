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

function init() {
   // chrome.runtime.onConnect.addListener(function(port){
	   //add listeners
	   var port = chrome.runtime.connect()
	   port.onMessage.addListener(function(message, sender) {
			if (message.importance1) {
				windw.alert("success");
            var title = message.title;
            var url = message.url;
            var highlighted = message.selected;
		 	 	pageDB.open();
	         // Create the item.
	         // if (highlighted.replace(/ /g,'') != '') {
	         	pageDB.createTab(title, 1, highlighted, url, function() {});
	         	// window.alert("Added \"" + highlighted + "\" with high importance.");
	         // }
	         // else window.alert("Nothing to add.");
			} else if (message.importance2) {
            var title = message.title;
            var url = message.url;
            var highlighted = message.selected;
	 		   pageDB.open();
	         // Create the item
	         pageDB.createTab(title, 2, highlighted, url, function() {});
			} else if (message.importance3) {
            var title = message.title;
            var url = message.url;
            var highlighted = message.selected;
	 		   pageDB.open();
	         // Create the item.
	         pageDB.createTab(title, 3, highlighted, url, function() {});
			}
		});
	// });
}
init();