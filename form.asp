<%@ language="javascript"%>
<!DOCTYPE html>
<html>
<body>
<%

search = request.querystring("search");
newSearch();

function newSearch() {
	chrome.windows.create({"url": "https://www.google.com/?gws_rd=ssl#q=" + search, 
		"focused": true}, function(newWindow) {} );
}
}
%>

</body>
</html>