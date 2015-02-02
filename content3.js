function getInfo() {
  var ttl = document.title;
  var link = document.URL;
  var highlighted = window.getSelection().toString();

  chrome.extension.sendRequest({'title': ttl, 'url': link, 'selected': highlighted, 'importance3': true});
}

getInfo();