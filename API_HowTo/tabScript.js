/***********************************************
* Alicia Broederdorf
* November 28, 2015
* Script to display tab content
***********************************************/

//Toggle function to toggle display property of element
function toggle(id){
	var div = document.getElementById(id);
	if (div.style.display == "none")
		div.style.display = "block";
	else
		div.style.display = "none";
}

//Function to display home div and color it gray, hiding other divs and making those tabs white
function showHome(){
	//Hide other divs and show selected
	document.getElementById("homeDiv").style.display = "block";
	document.getElementById("startDiv").style.display = "none";
	document.getElementById("reqDiv").style.display = "none";
	document.getElementById("respDiv").style.display = "none";
	
	//Change colors of tab to show active one
	document.getElementById("homeTab").style.backgroundColor = "silver";
	document.getElementById("startTab").style.backgroundColor = "white";
	document.getElementById("reqTab").style.backgroundColor = "white";
	document.getElementById("respTab").style.backgroundColor = "white";
}

//Function to display getting started div and color it gray, hiding other divs and making those tabs white
function showStart(){
	//Hide other divs and show selected
	document.getElementById("homeDiv").style.display = "none";
	document.getElementById("startDiv").style.display = "block";
	document.getElementById("reqDiv").style.display = "none";
	document.getElementById("respDiv").style.display = "none";
	
	//Change colors of tab to show active one
	document.getElementById("homeTab").style.backgroundColor = "white";
	document.getElementById("startTab").style.backgroundColor = "silver";
	document.getElementById("reqTab").style.backgroundColor = "white";
	document.getElementById("respTab").style.backgroundColor = "white";
}

//Function to display requests div and color it gray, hiding other divs and making those tabs white
function showReq(){
	//Hide other divs and show selected
	document.getElementById("homeDiv").style.display = "none";
	document.getElementById("startDiv").style.display = "none";
	document.getElementById("reqDiv").style.display = "block";
	document.getElementById("respDiv").style.display = "none";
	
	//Change colors of tab to show active one
	document.getElementById("homeTab").style.backgroundColor = "white";
	document.getElementById("startTab").style.backgroundColor = "white";
	document.getElementById("reqTab").style.backgroundColor = "silver";
	document.getElementById("respTab").style.backgroundColor = "white";
}

//Function to display response data div and color it gray, hiding other divs and making those tabs white
function showResp(){
	//Hide other divs and show selected
	document.getElementById("homeDiv").style.display = "none";
	document.getElementById("startDiv").style.display = "none";
	document.getElementById("reqDiv").style.display = "none";
	document.getElementById("respDiv").style.display = "block";
	
	//Change colors of tab to show active one
	document.getElementById("homeTab").style.backgroundColor = "white";
	document.getElementById("startTab").style.backgroundColor = "white";
	document.getElementById("reqTab").style.backgroundColor = "white";
	document.getElementById("respTab").style.backgroundColor = "silver";
}

//Create event listeners for tab buttons
document.getElementById("homeTab").addEventListener("click", showHome);
document.getElementById("startTab").addEventListener("click", showStart);
document.getElementById("reqTab").addEventListener("click", showReq);
document.getElementById("respTab").addEventListener("click", showResp);

//Create event listeners for next page buttons
document.getElementById("homeNext").addEventListener("click", showStart);
document.getElementById("startNext").addEventListener("click", showReq);
document.getElementById("reqNext").addEventListener("click", showResp);

//Initialize - show home div and tab gray, color other tabs white and hide other content divs
showHome();

//Initialize - hide all accordion divs
document.getElementById("directSearch").style.display = "none";
document.getElementById("SocOpenData").style.display = "none";
document.getElementById("OpenDataNet").style.display = "none";
document.getElementById("simpleFilter").style.display = "none";
document.getElementById("queryOptions").style.display = "none";