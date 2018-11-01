// ==UserScript==
// @name	scihubIt
// @version	1.1
// @grant	none
// @description A little script that adds a button to the top of a page which opens the current page via scihub.
// ==/UserScript==

// Enter as many scihub mirrors here as you wish.
var scihubMirrors = ["www.sci-hub.se", "www.sci-hub.tw"];

//////////////////////////////////////////////////////////////////////////////////////////
console.log("scihubIt :: [*] Starting up scihubIt...");
console.log("scihubIt :: [*] Checking mirrors for availability...");


// Iterate thorugh list of available mirrors and check if active
mirrorToUse = "";
for (var i = 0; i < scihubMirrors.length; i++) {
	// Current mirror to check
	scihubMirror = scihubMirrors[i];

	// Add pre- and suffix to address if neccessary
	if (scihubMirror.indexOf("http://") != 0) {
		scihubMirror = "http://" + scihubMirror;
	}
	if (scihubMirror.slice(-1) != "/") {
		scihubMirror = scihubMirror + "/";
	}

	// Send synchronous request to check if the mirror is up (Request Status = 200?)
	var request = new XMLHttpRequest();
	request.open('GET', scihubMirror, false);
	request.timeout = 4000;

	request.onreadystatechange = function(){
		if (request.readyState === 4){
			if (request.status === 200) {
				console.log("scihubIt :: [*] Mirror " + scihubMirror + " is available. Request status: " + request.status);
				mirrorToUse = scihubMirror;
			} else {
				console.log("scihubIt :: [!] Mirror " + scihubMirror + " is NOT available. Request status: " + request.status);
			}
		} 
	};

	try {
		request.send();
	} catch(exception) {
		console.log("scihubIt :: [!] An error occured during connecting to mirror " + scihubMirror);
	}
}


// None of the mirrors was up -- exit script
if (mirrorToUse === "") {
	alert("None of the registered scihub mirrors seems to be working. Exiting script ...");
	return;
}

// Add 'Scihub It!' button to page
var btndiv = document.createElement ('div');
btndiv.innerHTML = '<button style="opacity: 0.75; background-color: #008CBA; color: yellow; font-size: 24px; width: 250px; height: 120px; position: absolute; top: 0; left: 30%; z-index: 10000" id="myButton">Scihub it!</button>'; btndiv.setAttribute ('id', 'myContainer');
document.body.appendChild(btndiv);
document.getElementById("myButton").addEventListener("click", openScihubTab, false);

function openScihubTab (zEvent) {
	var currentURL = window.location.href;
	var newURL = mirrorToUse + currentURL;
	window.open(newURL,'_blank');
}

