function getInfo() {
  var ttl = document.title;
  var link = document.URL;
  chrome.extension.sendRequest({'title': ttl, 'url': link, 'importance1': true});
}

getInfo();