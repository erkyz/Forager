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

//I give up on the notifications.

function addToSearch() {
	var options = {
		type: 'basic',
		iconURL: 'icon.png',
		title: 'Test',
		message: 'Hi'
	}
	chrome.notifications.create(options, function() {});
}
