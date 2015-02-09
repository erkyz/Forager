task = "default";

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.importance1 == true) {  //coming from content script
         var title = request.title;
         var url = request.url;
         var highlighted = request.selected;
	 	 	pageDB.open();
	 	 	//create item in database
         pageDB.createTab(task, title, 1, highlighted, url, function() {});
         // //inform visual that there's a new tab
         chrome.runtime.sendMessage({newTab: true}, function(response) {
			  console.log(response.farewell);
			});

		} else if (request.importance2 == true) {
         var title = request.title;
         var url = request.url;
         var highlighted = request.selected;
 		   pageDB.open();
         pageDB.createTab(task, title, 2, highlighted, url, function() {});
         chrome.runtime.sendMessage({newTab: true}, function(response) {
			  console.log(response.farewell);
			});
		} else if (request.importance3 == true) {
         var title = request.title;
         var url = request.url;
         var highlighted = request.selected;
 		   pageDB.open();
         pageDB.createTab(task, title, 3, highlighted, url, function() {});
         chrome.runtime.sendMessage({newTab: true}, function(response) {
			  console.log(response.farewell);
			});
		} else if (request.newTask) {
			task = request.task; 
		} else if (request.newVisual) {
			chrome.runtime.sendMessage({currentTask: true, task: task}, function(response) {
        		console.log(response.farewell);
     		});
		} else if (request.init) {
			console.log(reponse.begin)
		}
   });

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
				activeId, {file: 'content.js', runAt: "document_start"}, function() {
					chrome.tabs.remove(activeId);
				});
		}); 
}

function add2() {
	chrome.tabs.query({'currentWindow': true, 'active': true}, 
		function(tabs) {
			activeId = tabs[0].id;
			chrome.tabs.executeScript(
				activeId, {file: 'content2.js', runAt: "document_start"}, function() {
					chrome.tabs.remove(activeId);
				});
		}); 
}

function add3() {
	chrome.tabs.query({'currentWindow': true, 'active': true}, 
		function(tabs) {
			activeId = tabs[0].id;
			chrome.tabs.executeScript(
				activeId, {file: 'content3.js', runAt: "document_start"}, function() {
					chrome.tabs.remove(activeId);
				});
		}); 
}