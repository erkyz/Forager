chrome.commands.onCommand.addListener(function(command) {
  // Call 'update' with an empty properties object to get access to the current
  // tab (given to us in the callback function).
  chrome.tabs.update({}, function(tab) {
   if (command == 'right-tab')
      nextTab();
   else if (command == 'left-tab')
      prevTab();
   else if (command == 'add-to-search')
      addToSearch();
  });
});

// switch to next tab
function nextTab() {
  // first, get currently active tab
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    if (tabs.length) {
      var activeTab = tabs[0],
      tabId = activeTab.id,
      currentIndex = activeTab.index;
      // next, get number of tabs in the window, in order to allow cyclic next
      chrome.tabs.query({currentWindow: true}, function(tabs) {
        var numTabs = tabs.length;
        // finally, get the index of the tab to activate and activate it
        chrome.tabs.query({currentWindow: true, index: (currentIndex+1) % numTabs}, 
        	function(tabs){
          if (tabs.length) {
            var tabToActivate = tabs[0],
            tabToActivate_Id = tabToActivate.id;
            chrome.tabs.update(tabToActivate_Id, {active: true});
          }
        });
      });
    }
  });
}

// switch to prev tab
function prevTab() {
  // first, get currently active tab
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    if (tabs.length) {
      var activeTab = tabs[0],
      tabId = activeTab.id,
      currentIndex = activeTab.index;
      // next, get number of tabs in the window
      chrome.tabs.query({currentWindow: true}, function (tabs) {
        var numTabs = tabs.length;
        // finally, get the index of the tab to activate and activate it
        if (currentIndex == 0)
        	prevIndex = numTabs - 1;
        else
        	prevIndex = (currentIndex - 1) % tabs.length;
        chrome.tabs.query({currentWindow: true, index: prevIndex}, 
        	function(tabs){
          if (tabs.length) {
            var tabToActivate = tabs[0],
            tabToActivate_Id = tabToActivate.id;
            chrome.tabs.update(tabToActivate_Id, {active: true});
          }
        });
      });
    }
  });
}

function addToSearch() {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.windows.create({'url': tab.url, 
     	'focused': true}, function() {} );
	});

// The functional stuff going on with runtime is kind of trippy so I won't worry
// about this now. 

// function addToSearch() {
// 	chrome.runtime.getBackgroundPage(function(eventPage) {
//         // Call the getPageInfo function in the event page, passing in 
//         // our onPageDetailsReceived function as the callback. This injects 
//         // content.js into the current tab's HTML
//         eventPage.getPageDetails(print);
//     });
// }

// function addToSearch(callback) {
// 	// Inject the content script into the current page 
//    chrome.tabs.executeScript({file: 'content.js'}); 
//    // Performed when a message is received from the content script
// 	chrome.runtime.onMessage.addListener(null, null, function(message) { 
//     	callback(message);
//     	chrome.windows.create({url: 'https://www.google.com/' + message,
//    	'focused': true}, function() {} );
//     }); 
}