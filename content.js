function getInfo() {
  var ttl = document.title;
  var link = document.URL;
  var highlighted = "";
  if (window.getSelection().toString().replace(/ /g,'') != '')
  		var highlighted = window.getSelection().toString();

  chrome.runtime.sendMessage({init: true}, function(response) {
	  console.log(response.farewell);
	});
  chrome.runtime.sendMessage({title: ttl, url: link, selected: highlighted, importance1: true}, function(response) {
	  console.log(response.farewell);
	});
}

getInfo();