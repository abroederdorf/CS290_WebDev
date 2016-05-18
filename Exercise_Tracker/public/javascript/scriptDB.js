/*******************************
* Author: Alicia Broederdorf
* Date: December 1, 2015
* Description: CS 290 assignment: Database UI
*******************************/

//Add event listener event for when cotnent has loaded
document.addEventListener('DOMContentLoaded', bindButtons);
document.addEventListener('DOMContentLoaded', getData);

//Name: bindButtons
//Description: Binds buttons in form by adding event listeners
//Input: None
//Output: None
function bindButtons(){
	document.getElementById("submitData").addEventListener('click', insertData);
	document.getElementById('startDB').addEventListener('click', createDB);
	document.getElementById('submitUpdate').addEventListener('click', updateData);
	document.getElementById('closeUpdate').addEventListener('click', closeUpdate);
}

//Name: createDB
//Description: Creates HTTP request and sends for resetting table
//Input: None
//Output: Old table deleted, no table with no data created
function createDB(){
	//Create and send request to reset table
	var req = new XMLHttpRequest();
	var url = 'http://52.88.155.231:3000/reset-table';
	req.open('GET', url, true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = req.responseText;
			document.getElementById("statusMsg").textContent = response;
			//console.log('Called reset table, now calling getData');
			getData();
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send(null);
	event.preventDefault();
}

//Name: insertData
//Description: Creates HTTP request and sends
//Input: None
//Output: None
function insertData(){
	//console.log('In insertdata');
	//Get values from form to create URL for request
	if (document.getElementById('name').value != "")
	{
		var nInput = document.getElementById('name').value;
		var rInput = document.getElementById('reps').value;
		var wInput = document.getElementById('weight').value;
		var dInput = document.getElementById('activityDate').value;
		if (document.getElementById('unit0').checked)
			var uInput = document.getElementById('unit0').value;
		else
			var uInput = document.getElementById('unit1').value;
		
		//Create and send request
		var req = new XMLHttpRequest();
		var url = 'http://52.88.155.231:3000/insert?n=' + nInput + '&r=' + rInput + '&w=' + wInput + '&d=' + dInput + '&u=' + uInput;
		req.open('GET', url, true);
		req.addEventListener('load', function(){
			//Check for error message
			if (req.status >= 200 && req.status < 400)
			{
				var response = req.responseText;
				document.getElementById("statusMsg").textContent = response;
				getData();
			}
			else
				console.log("Error in network request: " + req.StatusText);
		});
		req.send(null);
		event.preventDefault();
	}
	else
	{
		document.getElementById("statusMsg").textContent = "Error - please enter a name for the activity!";
	}
}

//Name: updateData
//Description: Creates HTTP request and sends for update
//Input: None
//Output: A row will be updated and new table shown
function updateData(){
	//Get values from form to create URL for request
	var nInput = document.getElementById('nameUp').value;
	var rInput = document.getElementById('repsUp').value;
	var wInput = document.getElementById('weightUp').value;
	var dInput = document.getElementById('activityDateUp').value;
	var idInput = document.getElementById('hiddenID').value;
	if (document.getElementById('unitUp0').checked)
		var uInput = document.getElementById('unitUp0').value;
	else
		var uInput = document.getElementById('unitUp1').value;
	
	//Create and send request
	var req = new XMLHttpRequest();
	var url = 'http://52.88.155.231:3000/update?id=' + idInput + '&n=' + nInput + '&r=' + rInput + '&w=' + wInput + '&d=' + dInput + '&u=' + uInput;
	req.open('GET', url, true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = req.responseText;
			document.getElementById("statusMsg").textContent = response;
			getData();
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send(null);
	event.preventDefault();
	
	//Hide update form
	document.getElementById("updateForm").style.display = "none";
}

//Name: showUpdate
//Description: Shows form to update row selected
//Input: Row id
//Output: A form will be made visible
function showUpdate(index){
	//console.log('showUpdate and index is ' + index.value);
	
	//Display update form
	document.getElementById("updateForm").style.display = "block";
	
	//Get row for update
	var rowUp = document.getElementById(index.value);
	
	//console.log(rowUp.cells[3].innerHTML);
	
	//Populate form with values
	document.getElementById("hiddenID").value = index.value;
	document.getElementById("nameUp").value = rowUp.cells[0].innerHTML;
	document.getElementById("repsUp").value = rowUp.cells[1].innerHTML;
	document.getElementById("weightUp").value = rowUp.cells[2].innerHTML;
	document.getElementById("activityDateUp").value = rowUp.cells[4].innerHTML;
	if (rowUp.cells[3].innerHTML == "lbs")
		document.getElementById("unitUp1").checked = true;
	else
		document.getElementById("unitUp0").checked = true;
}

//Name: deleteData
//Description: Creates HTTP request and sends for delete
//Input: None
//Output: Row is deleted and new table shown
function deleteData(index){
	//Get values from form to create URL for request
	var idInput = index.value;
	//console.log('Delete Data and index is ' + idInput);
	
	//Create and send request
	var req = new XMLHttpRequest();
	var url = 'http://52.88.155.231:3000/delete?id=' + idInput;
	req.open('GET', url, true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = req.responseText;
			document.getElementById("statusMsg").textContent = response;
			getData();
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send(null);
	event.preventDefault();
}

//Name: getData
//Description: Creates HTTP request and sends to get data back from select query
//Input: None
//Output: Will get data and pass to updateTable function to create new table
function getData(){
	//Create and send request
	var req = new XMLHttpRequest();
	var url = 'http://52.88.155.231:3000/';
	req.open('GET', url, true);
	req.addEventListener('load', function(){
		//Check for error message
		if (req.status >= 200 && req.status < 400)
		{
			var response = req.responseText;
			updateTable(response);
		}
		else
			console.log("Error in network request: " + req.StatusText);
	});
	req.send(null);
	event.preventDefault();
}


//Name: updateTable
//Description: Build table using content returned from database
//Input: None
//Output: Table created with rows representing data in the database
function updateTable(response) {
	//Get response data and parse
	var rowData = JSON.parse(response);
	
	//Delete rows from table body
		var tblBody = document.getElementById("tableBody");
		while (tblBody.hasChildNodes())
			tblBody.removeChild(tblBody.firstChild);
	
	if (rowData != "")
	{
		//Create body rows and cells
		for (var i in rowData)
		{
			//console.log('Row id: ' + rowData[i].id + ', name: ' + rowData[i].name);
			
			//Create row
			var newRow = document.createElement("tr");
			newRow.id = rowData[i].id;
			tblBody.appendChild(newRow);
			
			//Create cells with response content
			//Name
			var newCell = document.createElement("td");
			newCell.textContent = rowData[i].name;
			newRow.appendChild(newCell);
			
			//Reps
			newCell = document.createElement("td");
			newCell.textContent = rowData[i].reps;
			newRow.appendChild(newCell);
			
			//Weight
			newCell = document.createElement("td");
			newCell.textContent = rowData[i].weight;
			newRow.appendChild(newCell);
			
			//Units
			newCell = document.createElement("td");
			if (rowData[i].lbs)
				newCell.textContent = "lbs";
			else
				newCell.textContent = "kgs";
			newRow.appendChild(newCell);
			
			//Date
			newCell = document.createElement("td");
			newCell.textContent = rowData[i].date;
			newRow.appendChild(newCell);
			
			//Create Update Button in Form
			newCell = document.createElement("td");
			var newInput = document.createElement("button");
			newInput.setAttribute("type", "button");
			newInput.textContent = "Update";
			newInput.style.textAlign = "center";
			newInput.value = rowData[i].id;
			newInput.addEventListener('click', function(){showUpdate(this);});
			newCell.appendChild(newInput);
			newRow.appendChild(newCell);
			
			//Create Delete Button in Form
			newCell = document.createElement("td");
			newInput = document.createElement("button");
			newInput.setAttribute("type", "button");
			newInput.textContent = "Delete";
			newInput.style.textAlign = "center";
			newInput.value = rowData[i].id;
			newInput.addEventListener('click', function(){deleteData(this);});
			newCell.appendChild(newInput);
			newRow.appendChild(newCell);
		}
	}
}	

//Name: closeUpdate
//Description: Hides div that contains update form
//Input: None
//Output: Output form is hidden
function closeUpdate(){
	document.getElementById("updateForm").style.display = "none";
}

//Initialize page
//Hide update form
document.getElementById("updateForm").style.display = "none";