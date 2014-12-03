<%@ language="javascript"%>
<!DOCTYPE html>
<html>
<body>
<%

title = request.form("title");
newTitle();

function newTitle(title) {
	h3 = document.getElementById("h3");
	h3.innerHTML(title);
}

%>

</body>
</html>