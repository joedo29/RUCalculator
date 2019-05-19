var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;



//SAMPLE FUNCTION THAT NEEDS TO BE ON THE FRONT END
function httpGet()
{
	var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
	var theUrl = "http://localhost:8080/";
	//var theUrl = "";
	xmlhttp.responseType = 'json';
	xmlhttp.open("POST", theUrl, true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.onload = function(){
		console.log(xmlhttp.status + " " + xmlhttp.responseText);
		return xmlhttp.response;
	};
	
	//Tests with either send
	//xmlhttp.send(JSON.stringify({"source": { "name": "Tester" } }));
	xmlhttp.send(JSON.stringify({"source": { "name": "Tester" }, "update": { "name": "tester2" } }));
};
httpGet();
