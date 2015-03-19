var script = document.createElement('script');
script.src = '/assets/js/jquery-2.1.3.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

console.log("hi");
var s = document.createElement('script');
s.src = chrome.extension.getURL('assets/js/sidebar.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
};


// // Within a content script:
// var f = document.createElement('iframe');
// f.src = chrome.extension.getURL('assets/html/popup.html');
// f.setAttribute("style", "border:none; width:150px; height:30px");
// f.setAttribute("scrolling", "no");
// f.setAttribute("frameborder", "0");
// document.body.appendChild(f); // Append to body, for example.

// // Event listener
// document.addEventListener('RW759_connectExtension', function(e) {
//     // e.detail contains the transferred data (can be anything, ranging
//     // from JavaScript objects to strings).
//     // Do something, for example:
//     alert(e.detail);
// });

 var sidebar;
  $('body').css({
    'padding-right': '350px'
  });
  sidebar = $("<div id='sidebar'></div>");
  sidebar.css({
    'position': 'fixed',
    'right': '0px',
    'top': '0px',
    'z-index': 9999,
    'width': '290px',
    'height': '100%',
    'background-color': 'blue'  // Confirm it shows up
  });
  $('body').append(sidebar);