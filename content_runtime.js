//This line opens up a long-lived connection to your background page.
var port = chrome.runtime.connect();

var ttl = document.title;
var link = document.URL;
var highlighted = window.getSelection().toString();

port.postMessage({'title': ttl, 'url': link, 'selected': highlighted, 'importance1': true});